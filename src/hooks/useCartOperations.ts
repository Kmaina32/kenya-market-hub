
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

export const useCartOperations = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addToCart, updateQuantity, removeFromCart } = useCart();

  const getQuantity = (productId: string) => {
    return quantities[productId] || 1;
  };

  const setQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity)
    }));
  };

  const handleAddToCart = async (product: any) => {
    try {
      const quantity = getQuantity(product.id);
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart!`);
      
      // Reset quantity after adding to cart
      setQuantities(prev => ({
        ...prev,
        [product.id]: 1
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleUpdateCartQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(productId);
        toast.success('Item removed from cart');
      } else {
        await updateQuantity(productId, newQuantity);
        toast.success('Cart updated');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  return {
    quantities,
    getQuantity,
    setQuantity,
    handleAddToCart,
    handleUpdateCartQuantity
  };
};
