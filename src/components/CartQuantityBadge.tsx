
import React from 'react';
import { useSafeCartContext } from '@/hooks/useSafeCartContext';

const CartQuantityBadge = () => {
  const { getTotalItems, isAvailable } = useSafeCartContext();
  
  // Only show badge if cart context is available
  if (!isAvailable) return null;

  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
      {totalItems > 99 ? '99+' : totalItems}
    </div>
  );
};

export default CartQuantityBadge;
