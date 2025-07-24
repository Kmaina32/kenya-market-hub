
import { useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Create a safe interface that matches CartContext but with optional methods
interface SafeCartContextType {
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
  isAvailable: boolean;
}

// Default safe state when context is not available
const defaultCartState: SafeCartContextType = {
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
  isLoading: false,
  isAvailable: false
};

export const useSafeCartContext = (): SafeCartContextType => {
  const { user } = useAuth();
  
  try {
    // Dynamically import the cart context to avoid errors if not available
    const CartContextModule = require('@/contexts/CartContext');
    const context = useContext(CartContextModule.CartContext);
    
    if (context && typeof context === 'object') {
      return {
        items: context.items || [],
        addToCart: context.addToCart || (() => {}),
        removeFromCart: context.removeFromCart || (() => {}),
        updateQuantity: context.updateQuantity || (() => {}),
        clearCart: context.clearCart || (() => {}),
        getTotalPrice: context.getTotalPrice || (() => 0),
        getTotalItems: context.getTotalItems || (() => 0),
        isLoading: context.isLoading || false,
        isAvailable: true
      };
    }
  } catch (error) {
    console.warn('Cart context not available:', error);
  }
  
  // Return default state if context is not available or user is not authenticated
  return {
    ...defaultCartState,
    isAvailable: !!user
  };
};
