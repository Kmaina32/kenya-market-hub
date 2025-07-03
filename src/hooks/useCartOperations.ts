// src/hooks/useCartOperations.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext'; // Import your AuthContext hook
import { toast } from 'sonner';

// Define the shape of a CartItem as stored in the database
interface CartItem {
  id: string; // The UUID of the cart item entry
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products?: { // This will be populated if you use .select('*, products(*)')
    id: string;
    name: string;
    price: number;
    image_url?: string;
    in_stock: boolean; // Useful for cart to check availability
    // Add other product fields you need here
  };
}

export const useCartOperations = () => {
  const { user, loading: authLoading } = useAuth(); // Corrected property name to 'loading'
  const queryClient = useQueryClient();

  // Query to fetch the user's cart items
  const { data: cartItems, isLoading: cartLoading, error: cartError } = useQuery<CartItem[]>({
    queryKey: ['cartItems', user?.id],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      const { data, error } = await supabase
        .from('cart_items')
        .select(`*, products ( id, name, price, image_url, in_stock )`)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching cart:", error.message);
        toast.error("Failed to load cart items.");
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !authLoading,
    staleTime: 60 * 1000,
  });

  // Mutation to add/update an item in the cart (using upsert for convenience)
  const upsertCartItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }): Promise<CartItem | { type: 'removed'; productId: string; quantity: number }> => {
      if (!user) throw new Error("User not authenticated.");

      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) throw error;
        // Explicitly return a type indicating removal
        return { type: 'removed', productId, quantity: 0 };
      }

      // Upsert: inserts if not exists, updates if exists (based on user_id and product_id unique constraint)
      const { data, error } = await supabase
        .from('cart_items')
        .upsert(
          { user_id: user.id, product_id: productId, quantity: quantity },
          { onConflict: 'user_id,product_id' }
        )
        .select(`*, products ( id, name )`) // Select the inserted/updated item with minimal product info for toast
        .single();

      if (error) throw error;
      return data as CartItem; // Cast to CartItem to ensure 'products' property is recognized
    },
    onSuccess: (data) => {
      // FIX: Check for the 'type' property to differentiate between removal and upsert
      if (data && 'type' in data && data.type === 'removed') {
        // Handle removal case
        toast.info(`Item removed from cart.`);
      } else if (data && 'products' in data && data.quantity > 0) {
        // Handle upsert (add/update) case where 'products' exists
        toast.success(`${data.products?.name || 'Item'} quantity updated to ${data.quantity}.`);
      }
      queryClient.invalidateQueries({ queryKey: ['cartItems', user?.id] });
    },
    onError: (err: any) => {
      console.error("Error updating cart:", err.message);
      toast.error(`Failed to update cart: ${err.message}`);
    }
  });

  // Helper to get quantity of a specific product in cart
  const getQuantity = useCallback((productId: string) => {
    // FIX: Ensure cartItems is treated as an array for array methods
    return (cartItems || []).find(item => item.product_id === productId)?.quantity || 0;
  }, [cartItems]);

  // Handle adding to cart or updating quantity
  const handleAddToCart = useCallback((product: { id: string; name: string; in_stock: boolean }) => {
    if (authLoading) {
      toast.info("Loading user data, please wait...");
      return;
    }
    if (!user) {
      toast.warning("Please log in to add items to your cart.");
      return;
    }
    if (!product.in_stock) {
      toast.error(`${product.name} is out of stock.`);
      return;
    }

    const currentQuantity = getQuantity(product.id);
    upsertCartItemMutation.mutate({ productId: product.id, quantity: currentQuantity + 1 });
  }, [upsertCartItemMutation, user, authLoading, getQuantity]);

  // Handle setting specific quantity for a product
  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (authLoading) {
      toast.info("Loading user data, please wait...");
      return;
    }
    if (!user) {
      toast.warning("Please log in to manage your cart.");
      return;
    }
    upsertCartItemMutation.mutate({ productId, quantity });
  }, [upsertCartItemMutation, user, authLoading]);

  // Helper to remove item explicitly
  const removeFromCart = useCallback((productId: string) => {
    setQuantity(productId, 0); // Use setQuantity with 0 to trigger removal logic
  }, [setQuantity]);

  // Calculate total items in cart
  const getTotalItems = useMemo(() => {
    // FIX: Ensure cartItems is treated as an array for array methods
    return (cartItems || []).reduce((total, item) => total + item.quantity, 0) || 0;
  }, [cartItems]);

  // Calculate total price of items in cart
  const getTotalPrice = useMemo(() => {
    // FIX: Ensure cartItems is treated as an array for array methods
    return (cartItems || []).reduce((total, item) => total + (item.products?.price || 0) * item.quantity, 0) || 0;
  }, [cartItems]);

  return {
    cartItems: cartItems || [],
    cartLoading: cartLoading || authLoading,
    cartError: cartError,
    getQuantity,
    setQuantity,
    handleAddToCart,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  };
};