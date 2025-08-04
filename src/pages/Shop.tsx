import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Search,
  ShoppingBag,
  Filter,
  Heart,
  Eye,
  ShoppingCart,
  Loader2,
  Star,
  Package2
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProductQuickView from '@/components/shop/ProductQuickView';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartOperations } from '@/hooks/useCartOperations';
import { QuantitySelector } from '@/components/shop/QuantitySelector';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import SEOManager from '@/components/seo/SEOManager';
import LazyImage from '@/components/LazyImage';

// --- Interfaces for better type safety and clarity ---
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  in_stock: boolean;
  rating?: number;
  total_reviews?: number;
  created_at: string;
  vendor_id: string;
  vendors: {
    business_name: string;
    logo_url?: string;
  };
}

// --- Constants for better maintainability ---
const PRODUCT_CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Food & Beverage', 'Automotive'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
];

const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]); 
  const [showFilters, setShowFilters] = useState(false);

  const { addToWishlist, isInWishlist } = useWishlist();
  const { getQuantity, setQuantity, handleAddToCart } = useCartOperations();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get unique values for filters
  const { data: filterOptions } = useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      const { data: allProducts } = await supabase
        .from('products')
        .select('category')
        .eq('in_stock', true);

      const categories = [...new Set(allProducts?.map(p => p.category).filter(Boolean))];
      return { categories };
    }
  });

  const { data: products, isLoading, isFetching, refetch } = useQuery<Product[]>({
    queryKey: ['products', searchTerm, selectedCategory, sortBy, priceRange],
    queryFn: async () => {
      let query = supabase.from('products').select(`*, vendors ( business_name, logo_url )`).eq('in_stock', true);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

      switch (sortBy) {
        case 'price-low': query = query.order('price', { ascending: true }); break;
        case 'price-high': query = query.order('price', { ascending: false }); break;
        case 'rating': query = query.order('rating', { ascending: false, nullsFirst: false }); break; 
        case 'name': query = query.order('name', { ascending: true }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching products:", error.message);
        toast.error("Failed to load products. Please try again.");
        throw error;
      }
      return data || [];
    },
    staleTime: 60 * 1000, 
    placeholderData: (previousData) => previousData, 
  });

  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const handleAddToWishlistCallback = useCallback((product: Product) => {
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist!`);
  }, [addToWishlist]);

  const handleAddToCartCallback = useCallback((product: Product) => {
    handleAddToCart(product);
  }, [handleAddToCart]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    setPriceRange([0, 100000]);
    refetch(); 
    toast.success("Filters cleared!");
  }, [refetch]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  return (
    <MainLayout>
      <SEOManager
        title="Buy Products Online in Kenya | Electronics, Fashion & More | Sokko Sasa Shop"
        description="Explore and buy a wide range of products online in Kenya. From electronics to fashion, find the best deals and trusted vendors on Sokko Sasa."
        keywords="buy products Kenya, online shopping Kenya, e-commerce Kenya, shop electronics Nairobi, local products Kenya, best deals Kenya, Sokko Sasa online store"
        url={`${window.location.origin}/shop`}
        type="website"
      />

      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-gray-600 text-lg">Discover amazing products from trusted vendors across Kenya</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-2">
                    Price Range: KSH {priceRange[0].toLocaleString()} - KSH {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
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
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }} 
                        aria-label="Quick View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className={`p-2 rounded-full bg-white/90 hover:bg-white shadow-sm ${isInWishlist(product.id) ? 'text-red-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(product);
                          toast.success(`${product.name} added to wishlist!`);
                        }}
                        aria-label="Add to Wishlist"
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{product.vendors?.business_name || 'Sokko Sasa'}</p>
                    
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
                          ({product.total_reviews || 0})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-gray-900">
                          KSH {Number(product.price).toLocaleString()}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!product.in_stock}
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
      </div>

      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={(product) => {
          addToWishlist(product);
          toast.success(`${product.name} added to wishlist!`);
        }}
      />
    </MainLayout>
  );
};

export default Shop;
