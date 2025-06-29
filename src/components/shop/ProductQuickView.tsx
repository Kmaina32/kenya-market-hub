
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  rating?: number;
  in_stock: boolean;
  category: string;
  vendors?: {
    business_name: string;
  };
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
}) => {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Eye className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              {product.vendors && (
                <p className="text-sm text-gray-600">by {product.vendors.business_name}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.rating || 0})</span>
            </div>
            
            <p className="text-2xl font-bold text-orange-600">
              KSh {product.price.toLocaleString()}
            </p>
            
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}
            
            <div className="flex gap-3">
              <Button 
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleAddToWishlist}
                className="px-3"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Availability:</span>
                  <span className={`ml-2 ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
