// src/pages/Shop.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Search,
  ShoppingBag,
  Filter,
  Grid,
  List,
  Heart,
  Eye,
  ShoppingCart,
  DollarSign,
  Tag,
  Loader2,
  Star,
  Package2
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProductQuickView from '@/components/shop/ProductQuickView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import SEOManager from '@/components/seo/SEOManager';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); 
  const [minPriceInput, setMinPriceInput] = useState<string>('0');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('5000');

  const { addToWishlist, isInWishlist } = useWishlist();
  const { getQuantity, setQuantity, handleAddToCart } = useCartOperations();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: products, isLoading, isFetching, refetch } = useQuery<Product[]>({
    queryKey: ['products', debouncedSearchTerm, selectedCategory, sortBy, priceRange],
    queryFn: async () => {
      let query = supabase.from('products').select(`*, vendors ( business_name, logo_url )`).eq('in_stock', true);

      if (debouncedSearchTerm) {
        query = query.or(`name.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`);
      }
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

      switch (sortBy) {
        case 'price_low': query = query.order('price', { ascending: true }); break;
        case 'price_high': query = query.order('price', { ascending: false }); break;
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

  useEffect(() => {
    setMinPriceInput(priceRange[0].toString());
    setMaxPriceInput(priceRange[1].toString());
  }, [priceRange]);

  const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPriceInput(value);
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setPriceRange(prev => [numValue, prev[1]]);
    }
  };

  const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPriceInput(value);
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setPriceRange(prev => [prev[0], numValue]);
    }
  };

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

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    setPriceRange([0, 5000]);
    refetch(); 
    toast.info("Filters cleared!");
  }, [refetch]);

  const EnhancedProductCard = React.memo(({ product }: { product: Product }) => (
    <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
            <Badge variant="destructive" className="text-sm px-3 py-1 animate-pulse">Out of Stock</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button size="sm" variant="secondary" className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm" onClick={() => handleQuickView(product)} aria-label="Quick View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className={`p-2 rounded-full bg-white/90 hover:bg-white shadow-sm ${isInWishlist(product.id) ? 'text-red-500' : ''}`}
            onClick={() => handleAddToWishlistCallback(product)}
            aria-label="Add to Wishlist"
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{product.category}</Badge>
          {product.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm">{Number(product.rating).toFixed(1)}</span>
              <span className="text-gray-500 ml-1 text-sm">({product.total_reviews || 0})</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div>
            <div className="font-medium line-clamp-2">{product.name}</div>
            <div className="text-sm text-gray-500 line-clamp-1">
              {product.vendors?.business_name || 'Unknown Vendor'}
            </div>
          </div>
        </div>
        <div className="mt-2 mb-3">
          <span className="text-lg font-semibold text-green-600">
            KSh {Number(product.price).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector 
            quantity={getQuantity(product.id)} 
            onQuantityChange={(qty) => setQuantity(product.id, qty)} 
            size="sm" 
          />
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            onClick={() => handleAddToCartCallback(product)}
            disabled={!product.in_stock || getQuantity(product.id) === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <MainLayout>
      <SEOManager
        title="Buy Products Online in Kenya | Electronics, Fashion & More | Sokko Sasa Shop"
        description="Explore and buy a wide range of products online in Kenya. From electronics to fashion, find the best deals and trusted vendors on Sokko Sasa."
        keywords="buy products Kenya, online shopping Kenya, e-commerce Kenya, shop electronics Nairobi, local products Kenya, best deals Kenya, Sokko Sasa online store"
        url={`${window.location.origin}/shop`}
        type="website"
      />

      <div className="space-y-6 p-4 md:p-6 animate-fade-in">
        {/* Page Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingBag className="h-9 w-9" />
              Shop Products
            </h1>
            <p className="text-orange-100 mt-2 text-lg">Discover amazing products from trusted vendors across Kenya.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 bg-white text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-white border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-800">Filter & Sort</CardTitle>
            <div className="flex gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')} aria-label="Grid View">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {PRODUCT_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minPriceInput}
                  onChange={(e) => {
                    setMinPriceInput(e.target.value);
                    const numValue = Number(e.target.value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      setPriceRange(prev => [numValue, prev[1]]);
                    }
                  }}
                  placeholder="Min price"
                  className="w-32"
                />
                <span>-</span>
                <Input
                  type="number"
                  value={maxPriceInput}
                  onChange={(e) => {
                    setMaxPriceInput(e.target.value);
                    const numValue = Number(e.target.value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      setPriceRange(prev => [prev[0], numValue]);
                    }
                  }}
                  placeholder="Max price"
                  className="w-32"
                />
              </div>

              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-white border-b border-gray-100">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">Available Products</CardTitle>
              <p className="text-gray-600 mt-1">
                {products ? `${products.length} products available` : 'Loading products...'}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading || isFetching ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
                <span className="text-lg font-medium">Loading products...</span>
                <p className="text-sm mt-1">Fetching the latest product data.</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'space-y-4'}>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <EnhancedProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Package2 className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <p className="text-xl font-semibold">No products found</p>
                <p className="text-md mt-2">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'No products match your current search and filter criteria. Try adjusting them!'
                    : 'Products will appear here once they are added to the platform.'}
                </p>
                <Button onClick={handleClearFilters} className="mt-6 bg-orange-500 hover:bg-orange-600">
                  <Filter className="h-4 w-4 mr-2" /> Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCartCallback}
        onAddToWishlist={handleAddToWishlistCallback}
      />
    </MainLayout>
  );
};

export default Shop;
