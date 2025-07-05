
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'default' | 'lg';
}

const WishlistButton = ({ productId, size = 'sm' }: WishlistButtonProps) => {
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!user) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productIsInWishlist = isInWishlist(productId);
    
    if (productIsInWishlist) {
      removeFromWishlist(productId);
    } else {
      // For this to work properly, we'd need the full product object
      // This is a simplified version - in a real app you'd fetch the product details
      addToWishlist({
        id: productId,
        name: 'Product' // This should come from props or be fetched
      });
    }
  };

  const productIsInWishlist = isInWishlist(productId);

  return (
    <Button
      variant={productIsInWishlist ? 'default' : 'outline'}
      size={size}
      onClick={handleClick}
      className={`${productIsInWishlist ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      <Heart 
        className={`h-4 w-4 ${size !== 'sm' ? 'mr-2' : ''} ${
          productIsInWishlist ? 'fill-current' : ''
        }`} 
      />
      {size !== 'sm' && (productIsInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
    </Button>
  );
};

export default WishlistButton;
