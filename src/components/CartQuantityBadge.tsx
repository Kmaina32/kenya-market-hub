
import React from 'react';
import { useCartContext } from '@/contexts/CartContext';

const CartQuantityBadge = () => {
  const { items } = useCartContext();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
      {totalItems > 99 ? '99+' : totalItems}
    </div>
  );
};

export default CartQuantityBadge;
