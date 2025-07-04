
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category: string;
  rating?: number;
  reviews_count?: number;
  in_stock?: boolean;
  vendor?: string;
  description?: string;
}

interface OptimizedProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

const OptimizedProductCard: React.FC<OptimizedProductCardProps> = ({ 
  product, 
  onViewDetails 
}) => {
  const { addItem, isLoading } = useCartContext();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product.in_stock) {
      toast.error('This product is out of stock');
      return;
    }

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        in_stock: product.in_stock
      });
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-orange-100 hover:border-orange-200 bg-white rounded-2xl overflow-hidden">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-orange-300" />
            </div>
          )}
        </div>
        
        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white rounded-full"
          onClick={handleWishlistToggle}
        >
          <Heart 
            className={`h-4 w-4 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'
            }`} 
          />
        </Button>

        {/* Stock status badge */}
        {!product.in_stock && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 text-xs"
          >
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Category badge */}
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            {product.category}
          </Badge>

          {/* Product name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Vendor */}
          {product.vendor && (
            <p className="text-xs text-gray-500">by {product.vendor}</p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews_count || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-orange-600">
              KSH {Number(product.price).toLocaleString()}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={handleViewDetails}
              variant="outline"
              size="sm"
              className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!product.in_stock || isLoading}
              size="sm"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedProductCard;
