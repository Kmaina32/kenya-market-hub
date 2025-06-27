
import React, { useState } from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/shared/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Clock, MapPin } from 'lucide-react';

const Food = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const restaurants = [
    {
      id: 1,
      name: "Mama's Kitchen",
      cuisine: "Kenyan",
      rating: 4.8,
      deliveryTime: "25-35 min",
      deliveryFee: 150,
      image: "restaurant-1",
      featured: true
    },
    {
      id: 2,
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: 4.6,
      deliveryTime: "30-45 min",
      deliveryFee: 200,
      image: "restaurant-2",
      featured: false
    }
  ];

  const cuisines = ["Kenyan", "Italian", "Chinese", "Indian", "Fast Food"];

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <HeroSection
          title="Delicious Food Delivered"
          subtitle="Order from your favorite restaurants"
          description="Fresh meals delivered hot to your doorstep in 30 minutes or less"
          imageUrl="photo-1565299624946-b28f40a0ca4b"
          className="mb-8"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search restaurants or dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="Cuisine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  {cuisines.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <p className="text-gray-500">Restaurant Image</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                      {restaurant.featured && (
                        <Badge className="bg-orange-100 text-orange-800">Featured</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>KSh {restaurant.deliveryFee} delivery</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="mb-4">{restaurant.cuisine}</Badge>
                    
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      View Menu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Food;
