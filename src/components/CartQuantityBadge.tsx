
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const CartQuantityBadge = () => {
  const { user } = useAuth();
  
  // Only show badge if user is authenticated
  if (!user) return null;

  // Use a conditional hook approach to avoid context errors
  try {
    // Dynamically import the cart context only when needed
    const { useCartContext } = require('@/contexts/CartContext');
    const { items } = useCartContext();
    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    if (totalItems === 0) return null;

    return (
      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
        {totalItems > 99 ? '99+' : totalItems}
      </div>
    );
  } catch (error) {
    // If CartProvider is not available, don't render the badge
    console.warn('CartQuantityBadge: CartProvider not available');
    return null;
  }
};

export default CartQuantityBadge;
