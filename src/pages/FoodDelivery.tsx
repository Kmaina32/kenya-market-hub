
import React, { useState } from 'react';
import { UtensilsCrossed, Star, Clock, MapPin, Phone, ShoppingCart } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRestaurants } from '@/hooks/useRestaurants';
import RestaurantMenuModal from '@/components/RestaurantMenuModal';
import { toast } from 'sonner';

const FoodDelivery: React.FC = () => {
  const { data: restaurants = [], isLoading } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const handleRestaurantClick = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setIsMenuModalOpen(true);
    toast.success(`Opening menu for ${restaurant.business_name}`);
    console.log('Opening menu for restaurant:', restaurant);
  };

  const handleCallRestaurant = (restaurant: any) => {
    if (restaurant.business_phone) {
      window.location.href = `tel:${restaurant.business_phone}`;
      toast.success('Opening phone dialer...');
    } else {
      toast.error('Phone number not available');
    }
  };

  const handleOrderNow = (restaurant: any) => {
    toast.success(`Starting order from ${restaurant.business_name}`);
    // This would typically redirect to cart/order page
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Background Image - Added proper padding and rounded borders */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <UtensilsCrossed className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Food Delivery & Restaurants</h1>
              <p className="text-lg text-orange-100 mb-6">
                Order from verified restaurants across Kenya and get delicious meals delivered to your doorstep
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading restaurants...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <UtensilsCrossed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Restaurants Available</h3>
              <p className="text-gray-600 mb-6">
                Restaurants will be available soon. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-orange-300 bg-white rounded-2xl overflow-hidden group"
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {restaurant.banner_url ? (
                      <img 
                        src={restaurant.banner_url} 
                        alt={restaurant.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop)` }}
                      >
                        <div className="w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
                          <UtensilsCrossed className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}
                    {restaurant.logo_url && (
                      <div className="absolute bottom-3 left-3 w-14 h-14 rounded-full border-3 border-white overflow-hidden shadow-lg">
                        <img 
                          src={restaurant.logo_url} 
                          alt={`${restaurant.business_name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1">
                      Open
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-900 line-clamp-1 font-semibold">
                      {restaurant.business_name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 text-orange-500" />
                      <span className="truncate">{restaurant.business_address || 'Kenya'}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {restaurant.business_description || 'Delicious food delivered to your doorstep'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">4.5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">25-35 min</span>
                        </div>
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
                        className="flex-1 text-xs bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRestaurantClick(restaurant)}
                        className="flex-1 text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        View Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
