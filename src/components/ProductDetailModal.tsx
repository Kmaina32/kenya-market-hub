import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAddToRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useAuth } from '@/contexts/AuthContext';
import { useProductImages } from '@/hooks/useProductImages';
import ProductReviews from './ProductReviews';
import WishlistButton from './WishlistButton';
import LazyImage from '@/components/LazyImage';

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

const ProductDetailModal = ({ open, onOpenChange, product }: ProductDetailModalProps) => {
  const { addToCart } = useCartContext();
  const { toast } = useToast();
  const { user } = useAuth();
  const addToRecentlyViewed = useAddToRecentlyViewed();
  const { data: productImages } = useProductImages(product?.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (open && product && user) {
      addToRecentlyViewed.mutate(product.id);
    }
  }, [open, product, user]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  // Get images - use product_images if available, fallback to product.image_url
  const images = productImages && productImages.length > 0 
    ? productImages.map(img => img.image_url)
    : product.image_url 
      ? [product.image_url]
      : ['/placeholder.svg'];

  const handleAddToCart = () => {
    addToCart(product.id);
    toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <LazyImage 
                src={images[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <LazyImage 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{product.vendor || 'Soko Smart'}</p>
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews_count || 0} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  KSH {Number(product.price).toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">
                    KSH {Number(product.original_price).toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.condition && (
                <Badge variant="secondary">Condition: {product.condition}</Badge>
              )}
              
              {product.location && (
                <p className="text-sm text-gray-600">📍 {product.location}</p>
              )}
              
              <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </Badge>
            </div>

            {product.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <WishlistButton productId={product.id} size="default" />
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
