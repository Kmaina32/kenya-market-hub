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
  Star 
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import SEOManager from '@/components/seo/SEOManager'; // FIX: Import SEOManager

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
    <Card className="w-full group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-300 bg-white rounded-2xl overflow-hidden">
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
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
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
            <Badge variant="destructive" className="text-sm px-3 py-1 animate-pulse">Out of Stock</Badge>
          </div>
        )}
        {product.rating && product.total_reviews !== undefined && (
          <div className="absolute bottom-3 left-3 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 text-yellow-500 fill-current" /> 
            {product.rating.toFixed(1)} ({product.total_reviews})
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200">{product.category}</Badge>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-base">
            {product.name}
          </h3>
          {product.vendors && (<p className="text-xs text-gray-500 flex items-center gap-1">by <span className="font-medium text-gray-700">{product.vendors.business_name}</span></p>)}
          <p className="text-xl font-bold text-orange-600">KSh {product.price.toLocaleString()}</p>
          <div className="flex items-center justify-between pt-2">
            <QuantitySelector quantity={getQuantity(product.id)} onQuantityChange={(qty) => setQuantity(product.id, qty)} size="sm" />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
            onClick={() => handleAddToCartCallback(product)}
            disabled={!product.in_stock || getQuantity(product.id) === 0} 
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  ));

  const EnhancedProductListItem = React.memo(({ product }: { product: Product }) => (
    <Card className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-300 bg-white rounded-2xl">
      <div className="flex items-start sm:items-center flex-1 min-w-0 mb-4 sm:mb-0 sm:pr-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-200 relative overflow-hidden rounded-lg mr-4">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs px-2 py-0.5 animate-pulse">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200">{product.category}</Badge>
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">{product.name}</h3>
          {product.vendors && (<p className="text-sm text-gray-500 flex items-center gap-1">by <span className="font-medium text-gray-700">{product.vendors.business_name}</span></p>)}
          <p className="text-xl font-bold text-orange-600">KSh {product.price.toLocaleString()}</p>
          {product.rating && product.total_reviews !== undefined && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 fill-current" /> 
              {product.rating.toFixed(1)} ({product.total_reviews} reviews)
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end sm:items-center gap-3 w-full sm:w-auto">
        <div className="flex gap-2">
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
        <QuantitySelector quantity={getQuantity(product.id)} onQuantityChange={(qty) => setQuantity(product.id, qty)} size="sm" />
        <Button
          className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
          onClick={() => handleAddToCartCallback(product)}
          disabled={!product.in_stock || getQuantity(product.id) === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Card>
  ));


  return (
    <MainLayout>
      {/* FIX: Add SEOManager component here for Shop/Products page */}
      <SEOManager
        title="Buy Products Online in Kenya | Electronics, Fashion & More | Sokko Sasa Shop"
        description="Explore and buy a wide range of products online in Kenya. From electronics to fashion, find the best deals and trusted vendors on Sokko Sasa."
        keywords="buy products Kenya, online shopping Kenya, e-commerce Kenya, shop electronics Nairobi, local products Kenya, best deals Kenya, Sokko Sasa online store"
        url={`${window.location.origin}/shop`} // Replace with your actual domain
        type="website"
        // Consider adding specific structuredData for a listing page (e.g., CollectionPage)
        // structuredData={{
        //   "@context": "https://schema.org",
        //   "@type": "CollectionPage", // or WebPage
        //   "name": "Sokko Sasa Online Shop",
        //   "description": "Wide range of products for sale in Kenya.",
        //   "url": `${window.location.origin}/shop`,
        // }}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-orange-100" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Discover & Shop</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Find exactly what you need from trusted vendors across Kenya.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters and Search Bar */}
          <Card className="mb-8 p-6 shadow-lg border border-gray-100">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Search Input */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    aria-label="Search products"
                  />
                </div>

                {/* Category Filter (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-select" className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {PRODUCT_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-select" className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Buttons */}
                <div className="flex gap-2 justify-end sm:justify-start">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('grid')} aria-label="Grid View">
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('list')} aria-label="List View">
                    <List className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Filter Sheet */}
                <div className="sm:hidden col-span-full">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center gap-2 shadow-sm">
                        <Filter className="h-5 w-5" /> More Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Filter /> Filters
                        </SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        {/* Mobile Category Filter */}
                        <div>
                          <label htmlFor="mobile-category-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Tag className="h-4 w-4" /> Category
                          </label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="mobile-category-select" className="w-full">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {PRODUCT_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Sort By */}
                        <div>
                          <label htmlFor="mobile-sort-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <List className="h-4 w-4" /> Sort By
                          </label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger id="mobile-sort-select" className="w-full">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Price Range Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> Price Range
                          </label>
                          <Slider
                            min={0}
                            max={5000}
                            step={10}
                            value={priceRange}
                            onValueChange={(val: [number, number]) => setPriceRange(val)}
                            className="w-full"
                          />
                          <div className="flex justify-between items-center mt-3 text-sm font-semibold text-gray-700">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={minPriceInput}
                                onChange={handleMinPriceInputChange}
                                className="w-24 text-center"
                                min={0}
                              />
                            </div>
                            <span>-</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={maxPriceInput}
                                onChange={handleMaxPriceInputChange}
                                className="w-24 text-center"
                                min={0}
                              />
                            </div>
                          </div>
                        </div>

                        <Button onClick={handleClearFilters} variant="outline" className="w-full mt-4">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              {/* Desktop Price Range Filter */}
              <div className="mt-6 hidden sm:block">
                <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={0}
                  max={5000} // Adjust max based on your product prices
                  step={10}
                  value={priceRange}
                  onValueChange={(val: [number, number]) => setPriceRange(val)}
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-3 text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={minPriceInput}
                      onChange={handleMinPriceInputChange}
                      className="w-32 text-center"
                      min={0}
                    />
                  </div>
                  <span>to</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={maxPriceInput}
                      onChange={handleMaxPriceInputChange}
                      className="w-32 text-center"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Listing */}
          {(isLoading || isFetching) ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading amazing products...</p>
            </div>
          ) : products && products.length > 0 ? ( 
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
              {products.map(product => ( 
                viewMode === 'grid'
                  ? <EnhancedProductCard key={product.id} product={product} />
                  : <EnhancedProductListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
              <p className="text-md text-gray-600 mb-8">
                {searchTerm || selectedCategory !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 5000
                  ? 'No products match your current search and filter criteria. Try adjusting them!'
                  : 'It looks a bit empty here! Products will be added soon. Check back later!'}
              </p>
              <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-700 shadow-md flex items-center gap-2">
                <Filter className="h-5 w-5" /> Clear All Filters
              </Button>
            </div>
          )}
        </div>

        <ProductQuickView
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onAddToCart={handleAddToCartCallback}
          onAddToWishlist={handleAddToWishlistCallback}
        />
      </div>
    </MainLayout>
  );
};

export default Shop;