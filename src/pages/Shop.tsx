
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import HeroSection from '@/components/shared/HeroSection';

const Shop = () => {
  // Mock products data
  const products = [
    {
      id: 1,
      name: "Fresh Vegetables Bundle",
      price: 1500,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300",
      rating: 4.5,
      vendor: "Nairobi Fresh Market"
    },
    {
      id: 2,
      name: "Organic Fruits Pack",
      price: 2200,
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300",
      rating: 4.8,
      vendor: "Organic Kenya"
    },
    {
      id: 3,
      name: "Electronics Bundle",
      price: 15000,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300",
      rating: 4.2,
      vendor: "Tech Hub Kenya"
    },
    {
      id: 4,
      name: "Fashion Collection",
      price: 8500,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300",
      rating: 4.6,
      vendor: "Style Kenya"
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="Shop Smart"
          subtitle="Kenya's Marketplace"
          description="Discover amazing products from local vendors across Kenya"
          imageUrl="photo-1472851294608-062f824d29cc"
          className="mb-0 rounded-b-2xl h-64"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-200">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-orange-600">
                      KSH {product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-3"
            >
              Load More Products
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Shop;
