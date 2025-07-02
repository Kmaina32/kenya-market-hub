
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Navigation, Clock, Star, Phone } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Rides = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('sedan');

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['available-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('status', 'available')
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const vehicleTypes = [
    { id: 'sedan', name: 'Sedan', icon: '🚗', price: 'KSh 15/km', description: '4 seats, Standard comfort' },
    { id: 'suv', name: 'SUV', icon: '🚙', price: 'KSh 25/km', description: '7 seats, Premium comfort' },
    { id: 'van', name: 'Van', icon: '🚐', price: 'KSh 35/km', description: '12+ seats, Group travel' },
    { id: 'motorcycle', name: 'Boda Boda', icon: '🏍️', price: 'KSh 8/km', description: 'Quick & affordable' }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Background Image - Added proper padding and rounded borders */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Car className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Ride</h1>
              <p className="text-lg text-blue-100 mb-6">
                Safe, reliable transportation across Kenya with verified drivers
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Booking Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-orange-500" />
                Book a Ride
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Enter pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Vehicle Type</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {vehicleTypes.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedVehicleType === vehicle.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedVehicleType(vehicle.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{vehicle.icon}</div>
                        <h3 className="font-semibold text-sm">{vehicle.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{vehicle.description}</p>
                        <p className="text-sm font-medium text-orange-600">{vehicle.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                disabled={!pickup || !destination}
              >
                Find Available Drivers
              </Button>
            </CardContent>
          </Card>

          {/* Available Drivers */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Available Drivers</h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Finding available drivers...</p>
              </div>
            ) : drivers && drivers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                  <Card key={driver.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Driver #{driver.id.slice(0, 6)}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{driver.rating || 4.5}</span>
                            <span className="text-sm text-gray-500">({driver.total_rides || 0} rides)</span>
                          </div>
                        </div>
                        <Badge 
                          variant={driver.status === 'available' ? 'default' : 'secondary'}
                          className={driver.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {driver.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="h-4 w-4 text-orange-500" />
                          <span>{driver.vehicle_make} {driver.vehicle_model} ({driver.vehicle_year})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {driver.license_plate}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {driver.vehicle_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span>~5 mins away</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                          Book Ride
                        </Button>
                        <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Drivers Available</h3>
                <p className="text-gray-600 mb-6">
                  No drivers are currently available in your area. Please try again later.
                </p>
                <Button variant="outline">
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rides;
