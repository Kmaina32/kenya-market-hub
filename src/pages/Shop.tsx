
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  Eye,
  Filter,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ViewProductModal from '@/components/ViewProductModal';
import ListingGrid from '@/components/shared/ListingGrid';
import ListingCard from '@/components/shared/ListingCard';

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All Categories', 'Electronics', 'Fashion', 'Home & Garden', 
    'Sports', 'Books', 'Automotive', 'Beauty', 'Toys'
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 3500,
      image: 'photo-1505740420928-5e560c06d30e',
      rating: 4.5,
      reviews: 128,
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      vendor: 'TechStore Kenya'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 8900,
      image: 'photo-1523275335684-37898b6baf30',
      rating: 4.8,
      reviews: 89,
      category: 'Electronics',
      description: 'Advanced fitness tracking with heart rate monitor, GPS, and waterproof design.',
      vendor: 'FitTech Kenya'
    },
    {
      id: 3,
      name: 'Premium Coffee Beans',
      price: 1200,
      image: 'photo-1559056199-641a0ac8b55e',
      rating: 4.3,
      reviews: 67,
      category: 'Food & Beverages',
      description: 'Locally sourced premium coffee beans from the highlands of Kenya.',
      vendor: 'Kenyan Coffee Co.'
    },
    {
      id: 4,
      name: 'Organic Skincare Set',
      price: 2800,
      image: 'photo-1556228453-efd6c1ff04f6',
      rating: 4.7,
      reviews: 145,
      category: 'Beauty',
      description: 'Natural skincare set with moisturizer, cleanser, and serum made from organic ingredients.',
      vendor: 'Natural Beauty Kenya'
    },
    {
      id: 5,
      name: 'Cotton T-Shirt',
      price: 1500,
      image: 'photo-1521572163474-6864f9cf17ab',
      rating: 4.2,
      reviews: 89,
      category: 'Fashion',
      description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
      vendor: 'Fashion Hub Kenya'
    },
    {
      id: 6,
      name: 'Kitchen Blender',
      price: 4500,
      image: 'photo-1570197788417-0e82375c9371',
      rating: 4.6,
      reviews: 112,
      category: 'Home & Garden',
      description: 'Powerful kitchen blender perfect for smoothies, soups, and food preparation.',
      vendor: 'Home Essentials'
    }
  ];

  const filteredProducts = selectedCategory === 'All Categories' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category === selectedCategory);

  // Pagination
  const totalItems = filteredProducts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: `https://images.unsplash.com/${product.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
        vendor: product.vendor
      });
    }

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });

    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 rounded-b-2xl mb-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-4">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Shop Smart, Shop Local</h1>
            <p className="text-base text-orange-100">
              Discover amazing products from verified Kenyan vendors
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-8">
          {/* Categories - Mobile Dropdown, Desktop Pills */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            
            {/* Mobile Dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between rounded-xl border-gray-300 hover:border-orange-300"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {selectedCategory}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white border shadow-lg rounded-xl">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="hover:bg-orange-50 hover:text-orange-700 cursor-pointer"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Pills */}
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm h-10 rounded-xl ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0' 
                      : 'border-gray-300 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid with Pagination */}
          <ListingGrid
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            title={`${selectedCategory} (${totalItems} products)`}
          >
            {currentProducts.map((product) => (
              <ListingCard
                key={product.id}
                id={product.id.toString()}
                title={product.name}
                price={product.price}
                image={`https://images.unsplash.com/${product.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                category={product.category}
                rating={product.rating}
                reviews={product.reviews}
                location={product.vendor}
                badge="New"
                onClick={() => handleViewProduct(product)}
                onView={() => handleViewProduct(product)}
              >
                {/* Quantity Controls */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100 rounded-none"
                      onClick={() => handleQuantityChange(product.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-3 text-sm font-medium min-w-[40px] text-center">
                      {quantities[product.id] || 1}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100 rounded-none"
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm h-10 rounded-xl"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </ListingCard>
            ))}
          </ListingGrid>

          {/* View All Products Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl"
            >
              View All Products
            </Button>
          </div>
        </div>

        {/* Product View Modal */}
        <ViewProductModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          product={selectedProduct}
        />
      </div>
    </FrontendLayout>
  );
};

export default Shop;
