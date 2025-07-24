
import React from 'react';
import { useCartContext } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const CartQuantityBadge = () => {
  const { user } = useAuth();
  
  // Only use cart context if user is authenticated
  if (!user) return null;

  try {
    const { items } = useCartContext();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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
