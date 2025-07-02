import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, ShoppingBag, Filter, Grid, List, Heart, Eye, ShoppingCart } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProductQuickView from '@/components/shop/ProductQuickView';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartOperations } from '@/hooks/useCartOperations';
import { QuantitySelector } from '@/components/shop/QuantitySelector';
import { toast } from 'sonner';

const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const { addToWishlist, isInWishlist } = useWishlist();
  const { getQuantity, setQuantity, handleAddToCart } = useCartOperations();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, sortBy],
    queryFn: async () => {
      let query = supabase.from('products').select(`*, vendors ( business_name, logo_url )`).eq('in_stock', true);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      switch (sortBy) {
        case 'price_low': query = query.order('price', { ascending: true }); break;
        case 'price_high': query = query.order('price', { ascending: false }); break;
        case 'rating': query = query.order('rating', { ascending: false }); break;
        case 'name': query = query.order('name', { ascending: true }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty'];

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToWishlist = (product: any) => {
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  const EnhancedProductCard = ({ product }: { product: any }) => (
    <Card className="w-full max-w-[300px] mx-auto group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-300 bg-white rounded-2xl overflow-hidden">
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="p-2 rounded-full bg-white/90 hover:bg-white" onClick={() => handleQuickView(product)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className={`p-2 rounded-full bg-white/90 hover:bg-white ${isInWishlist(product.id) ? 'text-red-500' : ''}`} onClick={() => handleAddToWishlist(product)}>
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs">{product.category}</Badge>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">{product.name}</h3>
          {product.vendors && (<p className="text-xs text-gray-500">by {product.vendors.business_name}</p>)}
          <p className="text-lg font-bold text-orange-600">KSh {product.price.toLocaleString()}</p>
          <div className="flex items-center justify-between pt-2">
            <QuantitySelector quantity={getQuantity(product.id)} onQuantityChange={(qty) => setQuantity(product.id, qty)} size="sm" />
          </div>
          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" onClick={() => handleAddToCart(product)} disabled={!product.in_stock}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Shop Everything</h1>
              <p className="text-lg text-orange-100 mb-6">Discover amazing products from trusted vendors across Kenya</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (products?.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]' : 'grid-cols-1'}`}>
              {products.map(product => (<EnhancedProductCard key={product.id} product={product} />))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' ? 'No products match your current search criteria.' : 'Products will be added soon. Check back later!'}
              </p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">Clear Filters</Button>
            </div>
          ))}
        </div>

        <ProductQuickView product={selectedProduct} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />
      </div>
    </MainLayout>
  );
};

export default Shop;
