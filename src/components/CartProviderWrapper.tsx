
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

interface CartProviderWrapperProps {
  children: React.ReactNode;
}

const CartProviderWrapper: React.FC<CartProviderWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Always render CartProvider, but it will handle auth state internally
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
};

export default CartProviderWrapper;
