
import React, { createContext, useContext } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

interface CartContextType {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    vendor?: string;
  }>;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const cartHook = useCart();

  const contextValue = {
    items: cartHook.cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image_url,
      vendor: item.vendor
    })),
    addToCart: cartHook.addToCart,
    removeFromCart: cartHook.removeFromCart,
    updateQuantity: cartHook.updateQuantity,
    clearCart: cartHook.clearCart,
    getTotalPrice: cartHook.getCartTotal,
    getTotalItems: cartHook.getCartCount,
    isLoading: cartHook.isLoading
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

// Export the context for use in useSafeCartContext
export { CartContext };

// Export the hook for backward compatibility
export { useCart };
