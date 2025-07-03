// src/hooks/useWishlist.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext'; // Import your AuthContext hook
import { toast } from 'sonner';

// Define the shape of a WishlistItem as stored in the database
interface WishlistItem {
  id: string; // The UUID of the wishlist item entry
  user_id: string;
  product_id: string;
  created_at: string;
  products?: { // This will be populated if you use .select('*, products(*)')
    id: string;
    name: string;
    price: number;
    image_url?: string;
    // Add other product fields you need here
  };
}

export const useWishlist = () => {
  // FIX: Changed 'isLoading' to 'loading' to match your AuthContextType
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch the user's wishlist
  const { data: wishlistItems, isLoading: wishlistLoading, error: wishlistError } = useQuery<WishlistItem[]>({
    queryKey: ['wishlist', user?.id], // Query key includes user ID for user-specific data
    queryFn: async () => {
      if (!user) {
        return [];
      }
      const { data, error } = await supabase
        .from('wishlist') // Your wishlist table name
        .select(`*, products ( id, name, price, image_url )`) // Select wishlist item and joined product details
        .eq('user_id', user.id); // Filter by current user's ID

      if (error) {
        console.error("Error fetching wishlist:", error.message);
        toast.error("Failed to load wishlist items."); // FIX: Moved toast here
        throw error; // Re-throw error to be caught by useQuery's error state
      }
      return data || [];
    },
    enabled: !!user && !authLoading, // Only run query if user is logged in and auth is not loading
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    // FIX: Removed onError from useQuery options for TanStack Query v5
  });

  // Mutation to add an item to the wishlist
  const addMutation = useMutation({
    mutationFn: async (productToAdd: { id: string; name: string }) => {
      if (!user) throw new Error("User not authenticated.");

      // FIX: Ensure wishlistItems is treated as an array for find()
      const existingItem = (wishlistItems || []).find(item => item.product_id === productToAdd.id);
      if (existingItem) {
        toast.info(`${productToAdd.name} is already in your wishlist!`);
        return null; // Return null to indicate no new item was added
      }

      const { data, error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: productToAdd.id })
        .select(`*, products ( name )`) // Select the inserted item with product name for toast
        .single(); // Expect a single record back

      if (error) throw error;
      return data;
    },
    onSuccess: (newItem) => {
      if (newItem) { // Check if newItem is not null (i.e., actually added)
        toast.success(`${newItem.products?.name || 'Item'} added to wishlist!`);
        queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] }); // Invalidate and refetch wishlist
      }
    },
    onError: (err: any) => {
      console.error("Error adding to wishlist:", err.message);
      toast.error(`Failed to add to wishlist: ${err.message}`);
    }
  });

  // Mutation to remove an item from the wishlist
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("User not authenticated.");

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      return productId; // Return the ID of the removed product
    },
    onSuccess: () => {
      toast.success("Item removed from wishlist.");
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] }); // Invalidate and refetch wishlist
    },
    onError: (err: any) => {
      console.error("Error removing from wishlist:", err.message);
      toast.error(`Failed to remove from wishlist: ${err.message}`);
    }
  });

  // Helper function to check if a product is in the wishlist
  const isInWishlist = useCallback((productId: string) => {
    // FIX: Ensure wishlistItems is treated as an array
    return (wishlistItems || []).some(item => item.product_id === productId) || false;
  }, [wishlistItems]);

  const addToWishlist = useCallback((product: { id: string; name: string }) => {
    if (authLoading) {
      toast.info("Loading user data, please wait...");
      return;
    }
    if (!user) {
      toast.warning("Please log in to add items to your wishlist.");
      // Optionally navigate to login page if desired
      // navigate('/login');
      return;
    }
    addMutation.mutate(product);
  }, [addMutation, user, authLoading]);

  const removeFromWishlist = useCallback((productId: string) => {
    if (authLoading) {
        toast.info("Loading user data, please wait...");
        return;
    }
    if (!user) {
      toast.warning("Please log in to manage your wishlist.");
      return;
    }
    removeMutation.mutate(productId);
  }, [removeMutation, user, authLoading]);

  return {
    wishlistItems: wishlistItems || [],
    wishlistLoading: wishlistLoading || authLoading,
    wishlistError: wishlistError,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};