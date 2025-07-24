
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

interface CartProviderWrapperProps {
  children: React.ReactNode;
}

const CartProviderWrapper: React.FC<CartProviderWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Don't render CartProvider until auth is resolved
  if (loading) {
    return <div>{children}</div>;
  }

  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
};

export default CartProviderWrapper;
