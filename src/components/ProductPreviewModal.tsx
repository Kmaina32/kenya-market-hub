
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, X } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import WishlistButton from './WishlistButton';
import { useProductImages } from '@/hooks/useProductImages';
import LazyImage from '@/components/LazyImage';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ProductPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

const ProductPreviewModal = ({ open, onOpenChange, product }: ProductPreviewModalProps) => {
  const { addToCart } = useCartContext();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: productImages } = useProductImages(product?.id);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const images = productImages && productImages.length > 0
    ? productImages.map(img => img.image_url)
    : product.image_url
      ? [product.image_url]
      : ['/placeholder.svg'];

  const handleAddToCart = () => {
    addToCart(product.id);
    toast({ 
      title: "Added to cart", 
      description: `${product.name} has been added to your cart.` 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[92vw] sm:w-full overflow-y-auto p-3 sm:p-6 rounded-xl m-4 sm:m-8">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="absolute top-2 right-2 z-50 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Enhanced Image Carousel Section */}
            <div className="relative bg-gray-50 p-2 sm:p-4 rounded-lg">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-sm">
                        <LazyImage 
                          src={image} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                    <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
                  </>
                )}
              </Carousel>
              
              {/* Enhanced Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'border-orange-500 ring-2 ring-orange-200' 
                          : 'border-gray-200 hover:border-orange-300'
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
            
            {/* Product Details Section */}
            <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-gray-600">{product.vendor || 'Sokko Sasa'}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-orange-600 border-orange-200 px-2 py-1 text-xs sm:text-sm">
                    {product.category}
                  </Badge>
                  <Badge variant={product.in_stock ? 'default' : 'destructive'} className="bg-orange-100 text-orange-800 px-2 py-1 text-xs sm:text-sm">
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Math.floor(product.rating || 0) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    ({product.reviews_count || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                    KSh {Number(product.price).toLocaleString()}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      KSh {Number(product.original_price).toLocaleString()}
                    </span>
                  )}
                </div>
                
                {product.location && (
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                    <span className="mr-1">📍</span> {product.location}
                  </p>
                )}
              </div>

              {product.description && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-base sm:text-lg">Description</h4>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 py-3 text-sm sm:text-base font-medium"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Add to Cart
                </Button>
                <WishlistButton productId={product.id} size="default" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewModal;
