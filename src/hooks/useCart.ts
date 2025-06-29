
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  vendor?: string;
}

export const useCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);

  // Load local cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setLocalCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(localCartItems));
  }, [localCartItems]);

  // Fetch user's cart from database if authenticated
  const { data: dbCartItems = [] } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(name, price, image_url, vendor)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data?.map(item => ({
        id: item.product_id,
        name: item.products?.name || '',
        price: item.products?.price || 0,
        quantity: item.quantity,
        image_url: item.products?.image_url,
        vendor: item.products?.vendor
      })) || [];
    },
    enabled: !!user
  });

  // Use database cart if authenticated, otherwise local cart
  const cartItems = user ? dbCartItems : localCartItems;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      console.log('Adding to cart:', { productId, quantity }); // Debug log
      
      if (!user) {
        // Handle local cart for non-authenticated users
        const { data: product } = await supabase
          .from('products')
          .select('id, name, price, image_url, vendor')
          .eq('id', productId)
          .single();
        
        if (!product) throw new Error('Product not found');
        
        setLocalCartItems(prev => {
          const existingItem = prev.find(item => item.id === productId);
          if (existingItem) {
            return prev.map(item =>
              item.id === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            return [...prev, {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity,
              image_url: product.image_url,
              vendor: product.vendor
            }];
          }
        });
        return;
      }

      // Handle database cart for authenticated users
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.id] });
      }
      toast.success('Item added to cart');
    },
    onError: (error: any) => {
      console.error('Cart error:', error);
      toast.error(`Failed to add item to cart: ${error.message}`);
    }
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        setLocalCartItems(prev => prev.filter(item => item.id !== productId));
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.id] });
      }
      toast.success('Item removed from cart');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove item: ${error.message}`);
    }
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (quantity <= 0) {
        return removeFromCartMutation.mutateAsync(productId);
      }

      if (!user) {
        setLocalCartItems(prev =>
          prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.id] });
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to update quantity: ${error.message}`);
    }
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        setLocalCartItems([]);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.id] });
      }
      toast.success('Cart cleared');
    },
    onError: (error: any) => {
      toast.error(`Failed to clear cart: ${error.message}`);
    }
  });

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart: (productIdOrProduct: string | any, quantity = 1) => {
      // Handle both string ID and product object
      let productId: string;
      if (typeof productIdOrProduct === 'string') {
        productId = productIdOrProduct;
      } else if (productIdOrProduct && productIdOrProduct.id) {
        productId = productIdOrProduct.id;
      } else {
        console.error('Invalid product data passed to addToCart:', productIdOrProduct);
        toast.error('Invalid product data');
        return;
      }
      
      addToCartMutation.mutate({ productId, quantity });
    },
    removeFromCart: (productId: string) => removeFromCartMutation.mutate(productId),
    updateQuantity: (productId: string, quantity: number) => updateQuantityMutation.mutate({ productId, quantity }),
    clearCart: () => clearCartMutation.mutate(),
    getCartTotal,
    getCartCount,
    isLoading: addToCartMutation.isPending || removeFromCartMutation.isPending || updateQuantityMutation.isPending
  };
};
