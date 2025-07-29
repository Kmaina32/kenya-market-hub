import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Search,
  ShoppingBag,
  Filter,
  Grid,
  List,
  Heart,
  ShoppingCart,
  DollarSign,
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
import SEOManager from '@/components/seo/SEOManager';
import ProductDetailModal from '@/components/ProductDetailModal';

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const { addToWishlist, isInWishlist } = useWishlist();
  const { getQuantity, setQuantity, handleAddToCart } = useCartOperations();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: products, isLoading, isFetching } = useQuery<Product[]>({
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

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  }, []);

  const ProductCard = React.memo(({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
      <div 
        className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
        onClick={() => handleProductClick(product)}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* Sale badge if applicable */}
        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1">
          SALE
        </Badge>

        {/* Wishlist button */}
        <Button 
          size="sm" 
          variant="secondary" 
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleAddToWishlistCallback(product)}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 
            className="font-medium text-gray-900 line-clamp-2 text-sm leading-5 cursor-pointer hover:text-orange-600"
            onClick={() => handleProductClick(product)}
          >
            {product.name}
          </h3>
          
          <p className="text-xs text-gray-600">
            {product.vendors?.business_name || 'Sokko Sasa'}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating || 4) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.total_reviews || Math.floor(Math.random() * 50000) + 1000})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900">
                KSH {product.price.toLocaleString()}
              </span>
              {/* Original price if on sale */}
              <span className="text-xs text-gray-500 line-through">
                KSH {Math.floor(product.price * 1.2).toLocaleString()}
              </span>
            </div>
            
            <Button 
              size="sm"
              onClick={() => handleAddToCartCallback(product)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 text-xs font-medium"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <MainLayout>
      <SEOManager
        title="Shop Products Online in Kenya | Electronics, Fashion & More | Sokko Sasa"
        description="Discover and shop a wide range of products online in Kenya. From electronics to fashion, find the best deals from trusted vendors."
        keywords="shop online Kenya, buy products Kenya, e-commerce Kenya, electronics fashion Kenya"
        url={`${window.location.origin}/shop`}
        type="website"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">Discover amazing products from trusted vendors across Kenya</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
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

            {/* Sort */}
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
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
            </label>
            <Slider
              min={0}
              max={5000}
              step={10}
              value={priceRange}
              onValueChange={(val: [number, number]) => setPriceRange(val)}
              className="w-full"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading || isFetching ? (
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No products match your search criteria. Try adjusting your filters.'
                : 'No products available at the moment.'}
            </p>
          </div>
        )}

        <ProductQuickView
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onAddToCart={handleAddToCartCallback}
          onAddToWishlist={handleAddToWishlistCallback}
        />

        <ProductDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          product={selectedProduct}
        />
      </div>
    </MainLayout>
  );
};

export default Shop;
