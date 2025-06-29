
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import LazyImage from './LazyImage';
import ProductPreviewModal from './ProductPreviewModal';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  category?: string;
  rating?: number;
  reviews_count?: number;
  discount_percentage?: number;
}

interface OptimizedProductCardProps {
  product: Product;
  className?: string;
  showQuickActions?: boolean;
}

const OptimizedProductCard = memo<OptimizedProductCardProps>(({ 
  product, 
  className,
  showQuickActions = true 
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [showPreview, setShowPreview] = React.useState(false);

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.image_url || '/placeholder.svg',
      vendor: 'Unknown Vendor'
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  const handleCardClick = () => {
    setShowPreview(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-3 w-3',
          i < Math.floor(rating) 
            ? 'text-yellow-500 fill-yellow-500' 
            : 'text-gray-300'
        )}
      />
    ));
  };

  const productIsInWishlist = isInWishlist(product.id);

  return (
    <>
      <Card className={cn(
        'group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-orange-100 hover:border-orange-200',
        className
      )} onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="relative">
            <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
              <LazyImage
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {product.discount_percentage && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                -{product.discount_percentage}%
              </Badge>
            )}
            
            {showQuickActions && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={handleToggleWishlist}
                >
                  <Heart 
                    className={cn(
                      'h-4 w-4',
                      productIsInWishlist ? 'fill-red-500 text-red-500' : ''
                    )} 
                  />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            {product.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}

            {product.rating && product.reviews_count && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviews_count})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-600">
                  KSh {discountedPrice.toLocaleString()}
                </span>
                {product.discount_percentage && (
                  <span className="text-xs text-gray-500 line-through">
                    KSh {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              
              {showQuickActions && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="h-8 px-3 text-xs bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </Button>
              )}
            </div>

            {product.category && (
              <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                {product.category}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={product}
      />
    </>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;
