
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCartOperations } from '@/hooks/useCartOperations';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  in_stock?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number; image?: string; in_stock?: boolean }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  
  const {
    cartItems,
    cartLoading,
    handleAddToCart,
    setQuantity,
    removeFromCart,
    getTotalItems: dbGetTotalItems,
    getTotalPrice: dbGetTotalPrice,
  } = useCartOperations();

  // Convert database cart items to our CartItem format
  const items: CartItem[] = user 
    ? cartItems.map(item => ({
        id: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        quantity: item.quantity,
        image: item.products?.image_url,
        in_stock: item.products?.in_stock
      }))
    : localItems;

  const addItem = (product: { id: string; name: string; price: number; image?: string; in_stock?: boolean }) => {
    if (user) {
      handleAddToCart(product);
    } else {
      // Local storage fallback for non-authenticated users
      setLocalItems(prev => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  const removeItem = (productId: string) => {
    if (user) {
      removeFromCart(productId);
    } else {
      setLocalItems(prev => prev.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (user) {
      setQuantity(productId, quantity);
    } else {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        setLocalItems(prev =>
          prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
      }
    }
  };

  const clearCart = () => {
    if (user) {
      // Clear all items in the database
      items.forEach(item => removeFromCart(item.id));
    } else {
      setLocalItems([]);
    }
  };

  const getTotalItems = (): number => {
    return user ? dbGetTotalItems : localItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return user ? dbGetTotalPrice : localItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Load local cart from localStorage on mount
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          setLocalItems(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [user]);

  // Save local cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(localItems));
    }
  }, [localItems, user]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading: cartLoading,
      }}
    >
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
