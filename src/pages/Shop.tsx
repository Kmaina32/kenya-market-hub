
import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import MainLayout from '@/components/MainLayout';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { UnifiedInput } from '@/components/ui/UnifiedForm';
import HeroSection from '@/components/shared/HeroSection';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart,
  MapPin
} from 'lucide-react';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: products = [], isLoading } = useProducts();

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Food & Beverages',
    'Automotive',
    'Health'
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' ||
                           product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(product => product.rating >= 4.5).slice(0, 6);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection
          title="Shop with Confidence"
          subtitle="TukoPlace Marketplace"
          description="Discover quality products from verified vendors across Kenya. From electronics to fashion, find everything you need in one place."
          imageUrl="photo-1556742049-0cfed4f6a45d"
          searchPlaceholder="Search for products..."
          onSearch={setSearchQuery}
          primaryAction={{
            text: 'Browse Categories',
            onClick: () => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }),
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <UnifiedInput
                  label=""
                  name="search"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search products..."
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All Categories' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <UnifiedButton variant="outline" className="lg:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </UnifiedButton>
            </div>
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <UnifiedCard
                    key={product.id}
                    title={product.name}
                    description={product.description}
                    imageUrl={product.image_url}
                    price={product.price}
                    originalPrice={product.original_price}
                    rating={product.rating}
                    reviews={product.reviews_count}
                    location={product.location}
                    badge={product.condition === 'new' ? 'New' : 'Used'}
                    badgeVariant={product.condition === 'new' ? 'default' : 'secondary'}
                    actions={
                      <div className="grid grid-cols-2 gap-2">
                        <UnifiedButton size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </UnifiedButton>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Products */}
          <div id="categories" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory || 'All Products'} 
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredProducts.length} items)
                </span>
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Best Rating</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <UnifiedButton onClick={() => {setSearchQuery(''); setSelectedCategory('');}}>
                  Clear Filters
                </UnifiedButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <UnifiedCard
                    key={product.id}
                    title={product.name}
                    description={product.description}
                    imageUrl={product.image_url}
                    price={product.price}
                    originalPrice={product.original_price}
                    rating={product.rating}
                    reviews={product.reviews_count}
                    location={product.location}
                    badge={!product.in_stock ? 'Out of Stock' : product.condition === 'new' ? 'New' : 'Used'}
                    badgeVariant={!product.in_stock ? 'destructive' : product.condition === 'new' ? 'default' : 'secondary'}
                    className={!product.in_stock ? 'opacity-75' : ''}
                    actions={
                      <div className="grid grid-cols-2 gap-2">
                        <UnifiedButton size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton 
                          size="sm" 
                          disabled={!product.in_stock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {product.in_stock ? 'Add to Cart' : 'Sold Out'}
                        </UnifiedButton>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Shop;
