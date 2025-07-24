
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';

interface CartProviderWrapperProps {
  children: React.ReactNode;
}

const CartProviderWrapper: React.FC<CartProviderWrapperProps> = ({ children }) => {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
};

export default CartProviderWrapper;
