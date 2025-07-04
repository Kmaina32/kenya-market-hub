
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import HeroSection from '@/components/shared/HeroSection';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistItems, wishlistLoading, removeFromWishlist } = useWishlist();
  const { addItem } = useCartContext();
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Use wishlistItems directly since that's what the hook returns
  const items = wishlistItems || [];
  const loading = wishlistLoading || false;

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.product_name || 'Product',
      price: item.product_price || 0,
      image: item.product_image_url,
      in_stock: true
    });
    toast({ title: "Added to cart", description: `${item.product_name || 'Product'} has been added to your cart.` });
  };

  const handleRemove = (itemId: string) => {
    removeFromWishlist(itemId);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="My Wishlist"
          subtitle="Saved Items"
          description="Products you've saved for later."
          imageUrl="photo-1556742049-0cfed4f6a45d"
          className="mb-0 rounded-b-2xl h-64"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
                    <div className="bg-gray-200 h-3 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-sm text-gray-600 mb-4">Start adding products you love to save them for later!</p>
              <Button 
                onClick={() => window.location.href = '/shop'}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm px-4 py-2 rounded-lg"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => {
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-200 rounded-xl">
                    <CardContent className="p-3">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                        <img 
                          src={item.product_image_url || '/placeholder.svg'} 
                          alt={item.product_name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                        {item.product_name || 'Unknown Product'}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">Unknown Vendor</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-orange-600">
                          KSH {Number(item.product_price || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs px-2 py-1"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRemove(item.id)}
                          className="border-orange-200 text-orange-600 hover:bg-orange-50 px-2 py-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Wishlist;
