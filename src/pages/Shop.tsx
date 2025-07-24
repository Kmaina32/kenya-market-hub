
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Star, ShoppingCart, Search, Filter, Heart, Eye } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAddToRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useAuth } from '@/contexts/AuthContext';
import ProductDetailModal from '@/components/ProductDetailModal';
import WishlistButton from '@/components/WishlistButton';
import RecentlyViewed from '@/components/RecentlyViewed';
import LazyImage from '@/components/LazyImage';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const addToRecentlyViewed = useAddToRecentlyViewed();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, selectedCondition, selectedLocation, priceRange, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .gte('price', priceRange[0])
        .lte('price', priceRange[1]);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,vendor.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (selectedCondition !== 'all') {
        query = query.eq('condition', selectedCondition);
      }

      if (selectedLocation !== 'all') {
        query = query.eq('location', selectedLocation);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  // Get unique values for filters
  const { data: filterOptions } = useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      const { data: allProducts } = await supabase
        .from('products')
        .select('category, condition, location')
        .eq('in_stock', true);

      const categories = [...new Set(allProducts?.map(p => p.category).filter(Boolean))];
      const conditions = [...new Set(allProducts?.map(p => p.condition).filter(Boolean))];
      const locations = [...new Set(allProducts?.map(p => p.location).filter(Boolean))];

      return { categories, conditions, locations };
    }
  });

  const handleAddToCart = (product: any) => {
    addToCart(product.id);
    toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    if (user) {
      addToRecentlyViewed.mutate(product.id);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedLocation('all');
    setPriceRange([0, 100000]);
    setSortBy('newest');
  };

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading products</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section - Made sticky */}
        <div className="sticky top-0 z-30 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop</h1>
          <p className="text-gray-600 text-lg">Discover amazing products from trusted vendors across Kenya</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products, brands, vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {filterOptions?.categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      {filterOptions?.conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {filterOptions?.locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Range: KSH {priceRange[0].toLocaleString()} - KSH {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {products?.length || 0} products found
                </div>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No products found</h2>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card 
                key={product.id} 
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <LazyImage 
                      src={product.image_url || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.original_price && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                        SALE
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2">
                      <WishlistButton productId={product.id} />
                    </div>
                    {product.condition && product.condition !== 'new' && (
                      <Badge className="absolute bottom-2 left-2 bg-blue-500 text-xs">
                        {product.condition}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{product.vendor || 'Sokko Sasa'}</p>
                    
                    <div className="flex items-center mb-2">
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
                        <span className="text-xs text-gray-600 ml-1">
                          ({product.reviews_count || 0})
                        </span>
                      </div>
                    </div>
                    
                    {product.location && (
                      <p className="text-xs text-gray-500 mb-2">📍 {product.location}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-gray-900">
                          KSH {Number(product.price).toLocaleString()}
                        </span>
                        {product.original_price && (
                          <span className="text-xs text-gray-500 line-through">
                            KSH {Number(product.original_price).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-xs px-3 py-1"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <RecentlyViewed />
      </div>

      <ProductDetailModal
        open={showProductModal}
        onOpenChange={setShowProductModal}
        product={selectedProduct}
      />
    </MainLayout>
  );
};

export default Shop;
