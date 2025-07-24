
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, RefreshCw, MapPin, Car, Clock, Star } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import ImprovedRideBooking from '@/components/rides/ImprovedRideBooking';
import EnhancedDriverCard from '@/components/rides/EnhancedDriverCard';
import RideStatusIndicator from '@/components/rides/RideStatusIndicator';
import MapBox from '@/components/MapBox';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEOManager from '@/components/seo/SEOManager';

interface Driver {
  id: string;
  license_number?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  license_plate: string;
  vehicle_type: 'taxi' | 'motorbike';
  rating?: number;
  total_rides?: number;
  status: 'available' | 'on_trip' | 'offline';
  phone_number: string;
  eta_minutes?: number;
}

const ImprovedRides: React.FC = () => {
  const [activeRide, setActiveRide] = useState<any>(null);
  const [showBooking, setShowBooking] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ lat: -1.286389, lng: 36.817223 });

  const { data: drivers, isLoading, refetch, isRefetching } = useQuery<Driver[]>({
    queryKey: ['available-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('status', 'available')
        .limit(10);

      if (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Failed to load drivers');
        throw error;
      }
      
      return (data || []).map(driver => ({
        ...driver,
        eta_minutes: Math.floor(Math.random() * 15) + 5
      })) as Driver[];
    },
    refetchInterval: 30000,
    staleTime: 20000,
  });

  const handleRideBooked = (rideId: string) => {
    setActiveRide({
      id: rideId,
      status: 'requested',
      created_at: new Date().toISOString()
    });
    setShowBooking(false);
    toast.success('Ride booked successfully!');
  };

  const handleBookRide = async (driverId: string) => {
    try {
      toast.loading('Booking ride...');
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setActiveRide({
        id: `ride-${Date.now()}`,
        status: 'accepted',
        driver_id: driverId,
        created_at: new Date().toISOString()
      });
      setShowBooking(false);
      toast.success('Ride booked! Driver is on the way.');
    } catch (error) {
      toast.error('Failed to book ride. Please try again.');
    }
  };

  const handleCallDriver = (driverId: string) => {
    toast.info('Calling driver...');
  };

  const handleNewRide = () => {
    setActiveRide(null);
    setShowBooking(true);
  };

  const mapMarkers = [
    {
      id: 'current',
      position: currentLocation,
      title: 'Your Location',
      color: '#10b981'
    }
  ];

  return (
    <FrontendLayout>
      <SEOManager
        title="Book Your Ride - Sokko Sasa"
        description="Book reliable taxi and motorbike rides across Kenya with real-time tracking"
        keywords="taxi booking, ride sharing, transportation Kenya"
        url={`${window.location.origin}/improved-rides`}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Hero Section */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/60" />
          <div className="relative z-10 flex items-center justify-center h-full px-6">
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Navigation className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Your Ride, Your Way
              </h1>
              <p className="text-xl text-orange-100 font-light leading-relaxed max-w-2xl mx-auto">
                Safe, reliable, and convenient transportation with real-time tracking and verified drivers
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Star className="h-4 w-4 mr-1" />
                  4.8 Rating
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Car className="h-4 w-4 mr-1" />
                  1000+ Drivers
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Clock className="h-4 w-4 mr-1" />
                  24/7 Service
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Ride Status */}
          {activeRide && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Current Ride</h2>
                <Button
                  onClick={handleNewRide}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Book New Ride
                </Button>
              </div>
              <RideStatusIndicator
                status={activeRide.status}
                timeElapsed={Math.floor((Date.now() - new Date(activeRide.created_at).getTime()) / 1000)}
                driverETA={activeRide.status === 'accepted' ? 8 : undefined}
              />
            </div>
          )}

          {/* Booking Section */}
          {showBooking && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <ImprovedRideBooking onRideBooked={handleRideBooked} />
              </div>
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Available Drivers</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {drivers?.length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average ETA</span>
                      <span className="font-semibold">6 mins</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Features */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-green-800">Safety First</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">All drivers verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">Real-time GPS tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">24/7 customer support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">Emergency SOS button</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Map Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeRide ? 'Live Tracking' : 'Your Area'}
              </h2>
              <Button
                onClick={() => refetch()}
                disabled={isRefetching}
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                {isRefetching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-96">
                <MapBox
                  center={currentLocation}
                  zoom={13}
                  markers={mapMarkers}
                  className="w-full h-full"
                />
              </div>
            </Card>
          </div>

          {/* Available Drivers */}
          {showBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Available Drivers</h2>
                <Button
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  variant="outline"
                  size="sm"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  {isRefetching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : drivers && drivers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drivers.map((driver) => (
                    <EnhancedDriverCard
                      key={driver.id}
                      driver={driver}
                      onBookRide={handleBookRide}
                      onCallDriver={handleCallDriver}
                      isBookingEnabled={true}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="text-center py-12">
                    <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Drivers Available
                    </h3>
                    <p className="text-gray-600 mb-6">
                      All drivers are currently busy. Please try again in a few minutes.
                    </p>
                    <Button
                      onClick={() => refetch()}
                      disabled={isRefetching}
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      {isRefetching ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ImprovedRides;
