
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, MapPin, Clock, Star, Phone, Calendar } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/shared/HeroSection';
import RideBookingModal from '@/components/modals/RideBookingModal';
import { useToast } from '@/hooks/use-toast';

const Rides = () => {
  const [activeTab, setActiveTab] = useState('book-ride');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { toast } = useToast();

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['available-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('availability_status', 'available');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: myRides } = useQuery({
    queryKey: ['my-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleBookRide = () => {
    setShowBookingModal(true);
  };

  const handleQuickBook = (vehicleType: string) => {
    toast({
      title: "Quick Booking",
      description: `Looking for available ${vehicleType} drivers nearby...`,
    });
    setShowBookingModal(true);
  };

  const handleCallDriver = (driver: any) => {
    if (driver.phone_number) {
      window.location.href = `tel:${driver.phone_number}`;
      toast({
        title: "Calling Driver",
        description: "Opening phone dialer...",
      });
    } else {
      toast({
        title: "Contact Information",
        description: "Phone number not available.",
        variant: "destructive"
      });
    }
  };

  const handleTrackRide = (rideId: string) => {
    toast({
      title: "Tracking Ride",
      description: "Opening ride tracking...",
    });
  };

  const handleCancelRide = (rideId: string) => {
    toast({
      title: "Ride Cancelled",
      description: "Your ride has been cancelled successfully.",
    });
  };

  const vehicleTypes = [
    { type: 'sedan', name: 'Sedan', icon: '🚗', passengers: '1-4', price: 'KSh 200-500' },
    { type: 'suv', name: 'SUV', icon: '🚙', passengers: '1-6', price: 'KSh 300-700' },
    { type: 'van', name: 'Van', icon: '🚐', passengers: '1-8', price: 'KSh 400-900' },
    { type: 'motorcycle', name: 'Motorcycle', icon: '🏍️', passengers: '1', price: 'KSh 100-300' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="Ride Services"
          subtitle="Get Around With Ease"
          description="Book reliable rides with verified drivers across Kenya. Safe, affordable, and convenient transportation at your fingertips."
          imageUrl="photo-1449824913935-59a10b8d2000"
          className="mb-8"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="book-ride">Book a Ride</TabsTrigger>
              <TabsTrigger value="my-rides">My Rides</TabsTrigger>
              <TabsTrigger value="drivers">Available Drivers</TabsTrigger>
            </TabsList>

            <TabsContent value="book-ride" className="mt-6">
              <div className="space-y-8">
                {/* Quick Book Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Choose Your Ride
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {vehicleTypes.map((vehicle) => (
                        <Card key={vehicle.type} className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-orange-300">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{vehicle.icon}</div>
                            <h3 className="font-semibold text-gray-900 mb-1">{vehicle.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">{vehicle.passengers} passengers</p>
                            <p className="text-sm font-medium text-orange-600 mb-3">{vehicle.price}</p>
                            <Button 
                              size="sm"
                              onClick={() => handleQuickBook(vehicle.name)}
                              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                              Book Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Booking */}
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Booking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Need a specific type of ride or have special requirements? Use our custom booking form.
                    </p>
                    <Button 
                      onClick={handleBookRide}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Custom Booking
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="my-rides" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Recent Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  {myRides && myRides.length > 0 ? (
                    <div className="space-y-4">
                      {myRides.map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-sm">{ride.pickup_address}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium text-sm">{ride.destination_address}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(ride.created_at).toLocaleDateString()}</span>
                              </div>
                              <Badge variant={ride.status === 'completed' ? 'default' : 'secondary'}>
                                {ride.status}
                              </Badge>
                              {ride.actual_fare && (
                                <span className="font-medium">KSh {ride.actual_fare}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {ride.status === 'in_progress' && (
                              <Button size="sm" variant="outline" onClick={() => handleTrackRide(ride.id)}>
                                Track
                              </Button>
                            )}
                            {ride.status === 'requested' && (
                              <Button size="sm" variant="outline" onClick={() => handleCancelRide(ride.id)}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rides Yet</h3>
                      <p className="text-gray-600 mb-4">Book your first ride to see your history here.</p>
                      <Button onClick={handleBookRide}>Book a Ride</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drivers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Drivers Nearby</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Finding available drivers...</p>
                    </div>
                  ) : drivers && drivers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {drivers.map((driver) => (
                        <Card key={driver.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                  <Car className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">Driver #{driver.id.slice(0, 8)}</p>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{driver.rating || 4.5}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <p><strong>Vehicle:</strong> {driver.vehicle_make} {driver.vehicle_model}</p>
                              <p><strong>Type:</strong> {driver.vehicle_type}</p>
                              <p><strong>Plate:</strong> {driver.license_plate}</p>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                onClick={() => handleCallDriver(driver)}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleBookRide}
                                className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                              >
                                Book
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Drivers Available</h3>
                      <p className="text-gray-600 mb-4">All drivers are currently busy. Please try again shortly.</p>
                      <Button onClick={handleBookRide}>Book a Ride Anyway</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <RideBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      </div>
    </MainLayout>
  );
};

export default Rides;
