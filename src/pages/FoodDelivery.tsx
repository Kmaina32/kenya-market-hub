import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { UtensilsCrossed, Star, Clock, MapPin, Phone, ShoppingCart, Search, Filter, Loader2, DollarSign, List, Grid } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useRestaurants } from '@/hooks/useRestaurants';
import RestaurantMenuModal from '@/components/RestaurantMenuModal';
import { toast } from 'sonner';
import { Restaurant } from '@/types/restaurant';

// --- Constants for filtering/sorting options ---
const FOOD_CATEGORIES = [
  'All', 'African', 'Italian', 'Asian', 'Fast Food',
  'Desserts', 'Healthy', 'Grill', 'Seafood', 'Pizza', 'Vegetarian'
];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'delivery_time_asc', label: 'Fastest Delivery' },
  { value: 'min_order_asc', label: 'Lowest Minimum Order' },
];

const FoodDelivery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [deliveryFeeRange, setDeliveryFeeRange] = useState<[number, number]>([0, 1000]);
  const [minDeliveryTime, setMinDeliveryTime] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Debounced search term for better performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: restaurants = [], isLoading, isFetching, refetch } = useRestaurants({
    searchTerm: debouncedSearchTerm,
    category: selectedCategory,
    sortBy: sortBy,
    deliveryFeeRange: deliveryFeeRange,
    minDeliveryTime: minDeliveryTime,
  });

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsMenuModalOpen(true);
    toast.success(`Opening menu for ${restaurant.name}`);
    console.log('Opening menu for restaurant:', restaurant);
  }, []);

  const handleCallRestaurant = useCallback((restaurant: Restaurant) => {
    if (restaurant.phone) {
      window.location.href = `tel:${restaurant.phone}`;
      toast.success('Opening phone dialer...');
    } else {
      toast.error('Phone number not available');
    }
  }, []);

  const handleOrderNow = useCallback((restaurant: Restaurant) => {
    toast.success(`Starting order from ${restaurant.name}`);
    // This would typically redirect to cart/order page or open a different modal
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('relevance');
    setDeliveryFeeRange([0, 1000]);
    setMinDeliveryTime(0);
    refetch();
    toast.info("Filters cleared!");
  }, [refetch]);

  // --- Restaurant Card Component (Memoized for performance) ---
  const RestaurantCard = React.memo(({ restaurant }: { restaurant: Restaurant }) => {
    const defaultBanner = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
     
    const displayRating = restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A';
    const displayDeliveryTime = restaurant.delivery_time_minutes ? `${restaurant.delivery_time_minutes} min` : '30-45 min';
    const displayDeliveryFee = restaurant.delivery_fee === 0 ? 'Free' : `KSh ${restaurant.delivery_fee?.toFixed(0) || 'XX'}`;
    const isOpen = restaurant.is_active ?? true;

    return (
      <Card 
        className={`cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${ 
          isOpen ? 'hover:border-orange-300' : 'opacity-70 border-gray-200 cursor-not-allowed' 
        } bg-white rounded-2xl overflow-hidden group`} 
        onClick={() => isOpen && handleRestaurantClick(restaurant)} 
        aria-disabled={!isOpen} 
      >
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          <img 
            src={restaurant.image_url || defaultBanner} 
            alt={restaurant.name} 
            className={`w-full h-full object-cover transition-transform duration-300 ${isOpen ? 'group-hover:scale-105' : ''}`} 
            loading="lazy" 
          />
          {!isOpen && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-3 py-1 animate-pulse">Closed</Badge>
            </div>
          )}
          {isOpen && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 shadow-md">
              Open Now
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-xl text-gray-900 line-clamp-1 font-bold group-hover:text-orange-600 transition-colors">
            {restaurant.name}
          </CardTitle>
          {restaurant.cuisine_type && (
            <Badge variant="secondary" className="text-xs text-gray-700 w-fit">{restaurant.cuisine_type}</Badge>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="truncate font-medium">{restaurant.address || 'Kenya'}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0 px-4 pb-4">
          <p className="text-sm text-gray-700 line-clamp-2">
            {restaurant.description || 'Delicious food delivered to your doorstep.'}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{displayRating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{displayDeliveryTime}</span>
              </div>
            </div>
            <div className="font-bold text-orange-600">
              {displayDeliveryFee}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleCallRestaurant(restaurant); 
              }} 
              className="flex-1 text-sm bg-white border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm" 
              disabled={!restaurant.phone} 
            >
              <Phone className="h-4 w-4 mr-1" />
              Call 
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleRestaurantClick(restaurant)} 
              className="flex-1 text-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md whitespace-nowrap overflow-hidden text-ellipsis" // Added text handling classes
              disabled={!isOpen} 
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isOpen ? 'View Menu' : 'Closed'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  });

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8 shadow-xl" 
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 text-orange-100 drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Delicious Food, Delivered Fast</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Order from your favorite local restaurants across Kenya and enjoy hot meals at your doorstep.
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
                    placeholder="Search restaurants or cuisines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    aria-label="Search restaurants"
                  />
                </div>

                {/* Category Filter (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-select" className="w-full">
                      <SelectValue placeholder="All Cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOD_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
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
                            <UtensilsCrossed className="h-4 w-4" /> Cuisine 
                          </label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="mobile-category-select" className="w-full">
                              <SelectValue placeholder="All Cuisines" />
                            </SelectTrigger>
                            <SelectContent>
                              {FOOD_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
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

                        {/* Mobile Delivery Fee Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> Max Delivery Fee: KSh {deliveryFeeRange[1].toLocaleString()}
                          </label>
                          <Slider
                            min={0}
                            max={500}
                            step={10}
                            value={[deliveryFeeRange[1]]}
                            onValueChange={(val: number[]) => setDeliveryFeeRange([0, val[0]])}
                            className="w-full"
                          />
                        </div>

                        {/* Mobile Min Delivery Time Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Max Delivery Time: {minDeliveryTime === 0 ? 'Any' : `${minDeliveryTime} min`}
                          </label>
                          <Slider
                            min={0}
                            max={60}
                            step={5}
                            value={[minDeliveryTime]}
                            onValueChange={(val: number[]) => setMinDeliveryTime(val[0])}
                            className="w-full"
                          />
                        </div>

                        <Button onClick={handleClearFilters} variant="outline" className="w-full mt-4">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              {/* Desktop Filters below search/sort/view mode */}
              <div className="mt-6 hidden sm:block grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Max Delivery Fee Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" /> Max Delivery Fee: <span className="font-semibold">KSh {deliveryFeeRange[1].toLocaleString()}</span>
                  </label>
                  <Slider
                    min={0}
                    max={500}
                    step={10}
                    value={[deliveryFeeRange[1]]}
                    onValueChange={(val: number[]) => setDeliveryFeeRange([0, val[0]])}
                    className="w-full"
                  />
                </div>

                {/* Max Delivery Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" /> Max Delivery Time: <span className="font-semibold">{minDeliveryTime === 0 ? 'Any' : `${minDeliveryTime} min`}</span>
                  </label>
                  <Slider
                    min={0}
                    max={60}
                    step={5}
                    value={[minDeliveryTime]}
                    onValueChange={(val: number[]) => setMinDeliveryTime(val[0])}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Listing */}
          {(isLoading || isFetching) ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading delicious restaurants...</p>
            </div>
          ) : restaurants && restaurants.length === 0 ? (
            <div className="text-center py-12">
              <UtensilsCrossed className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Restaurants Found</h3>
              <p className="text-md text-gray-600 mb-8">
                {searchTerm || selectedCategory !== 'All' || deliveryFeeRange[1] !== 1000 || minDeliveryTime !== 0 
                  ? 'No restaurants match your current search and filter criteria. Try adjusting them!' 
                  : 'It looks a bit empty here! Restaurants will be added soon. Check back later!'}
              </p>
              <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md flex items-center gap-2">
                <Filter className="h-5 w-5" /> Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {restaurants && restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>

        <RestaurantMenuModal 
          open={isMenuModalOpen} 
          onOpenChange={setIsMenuModalOpen} 
          restaurant={selectedRestaurant} 
        />
      </div>
    </FrontendLayout>
  );
};

export default FoodDelivery;