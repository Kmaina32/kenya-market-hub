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
      <DialogContent className="max-w-5xl max-h-[95vh] w-[95vw] sm:w-full overflow-y-auto p-0 rounded-2xl mobile-safe-padding">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="fixed top-2 right-2 sm:absolute sm:top-4 sm:right-4 z-50 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Enhanced Image Carousel Section */}
            <div className="relative bg-gray-50 p-3 sm:p-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square relative overflow-hidden rounded-xl bg-white shadow-sm">
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
                <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
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
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-base text-gray-600">{product.vendor || 'Sokko Sasa'}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="text-orange-600 border-orange-200 px-3 py-1">
                    {product.category}
                  </Badge>
                  <Badge variant={product.in_stock ? 'default' : 'destructive'} className="bg-orange-100 text-orange-800 px-3 py-1">
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
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

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl lg:text-4xl font-bold text-orange-600">
                    KSh {Number(product.price).toLocaleString()}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      KSh {Number(product.original_price).toLocaleString()}
                    </span>
                  )}
                </div>
                
                {product.location && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="mr-1">📍</span> {product.location}
                  </p>
                )}
              </div>

              {product.description && (
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3 text-lg">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="flex space-x-4 pt-6">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 py-3 text-base font-medium"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
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
