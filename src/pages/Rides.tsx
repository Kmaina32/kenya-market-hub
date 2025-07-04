import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Navigation, Clock, Star, Phone, User, Wallet } from 'lucide-react'; 
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner'; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; 

// Import Google Maps utilities and the refactored MapBox component
import { geocodeAddress, getRouteDetails } from '@/integrations/googlemaps/googleMapsLoader';
import MapBox from '@/components/MapBox'; 

// --- Interfaces for better type safety and clarity ---
interface Driver {
  id: string; 
  user_id: string; 
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  license_plate: string;
  vehicle_type: 'taxi' | 'motorbike'; 
  rating?: number;
  total_rides?: number;
  status: 'available' | 'on_trip' | 'offline';
  phone_number: string; 
  is_active: boolean;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
  eta_minutes?: number; 
}

interface VehicleType {
  id: 'taxi' | 'motorbike'; 
  name: string;
  icon: string;
  pricePerKm: number; 
  description: string;
}

const VEHICLE_TYPES: VehicleType[] = [
  { id: 'taxi', name: 'Taxi', icon: '🚗', pricePerKm: 80, description: '4 seats, Standard comfort' },
  { id: 'motorbike', name: 'Boda Boda', icon: '🏍️', pricePerKm: 50, description: 'Quick & affordable' }
];

const Rides: React.FC = () => {
  const [pickup, setPickup] = useState(''); // User input string for pickup
  const [destination, setDestination] = useState(''); // User input string for destination
  
  // New state to store geocoded coordinates and route path
  const [pickupLocation, setPickupLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[] | null>(null);

  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType['id']>('taxi');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [tripDetails, setTripDetails] = useState<{ distance: number; eta: number; } | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false); 

  const { data: drivers, isLoading, refetch, isRefetching } = useQuery<Driver[]>({
    queryKey: ['available-drivers', selectedVehicleType], 
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('status', 'available')
        .eq('vehicle_type', selectedVehicleType)
        .limit(10); 

      if (error) {
        console.error('Error fetching drivers:', error.message);
        toast.error('Failed to fetch drivers. Please try again.');
        throw error;
      }
      
      return (data || []).map(driver => ({
        ...driver,
        eta_minutes: Math.floor(Math.random() * 15) + 5 // Keep mock ETA for driver distance from user for now
      })) as Driver[];
    },
    refetchInterval: 30 * 1000, 
    staleTime: 20 * 1000, 
  });

  // Effect to calculate fare and route when pickup, destination, or vehicle type changes
  useEffect(() => {
    const calculateFareAndRoute = async () => {
      if (pickup && destination) {
        try {
          const selectedVehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicleType);
          if (!selectedVehicle) return;

          // Geocode pickup and destination addresses
          const pickupCoords = await geocodeAddress(pickup);
          const destinationCoords = await geocodeAddress(destination);

          if (pickupCoords && destinationCoords) {
            setPickupLocation(pickupCoords);
            setDestinationLocation(destinationCoords);

            // Get route details (distance, ETA, and path) using Google Maps Directions Service
            const routeDetails = await getRouteDetails(
              { lat: pickupCoords.lat, lng: pickupCoords.lng },
              { lat: destinationCoords.lat, lng: destinationCoords.lng }
            );

            if (routeDetails) {
              const fare = routeDetails.distanceKm * selectedVehicle.pricePerKm;
              setEstimatedFare(fare);
              setTripDetails({ distance: routeDetails.distanceKm, eta: routeDetails.etaMinutes });
              setRoutePath(routeDetails.path); // Set the path for the map component
            } else {
              setEstimatedFare(null);
              setTripDetails(null);
              setRoutePath(null);
              toast.error("Could not calculate route details. Please check locations again.");
            }
          } else {
            setEstimatedFare(null);
            setTripDetails(null);
            setRoutePath(null);
            toast.error("Could not find coordinates for one or both locations. Please be more specific.");
          }
        } catch (error) {
          console.error('Error calculating fare or geocoding:', error);
          setEstimatedFare(null);
          setTripDetails(null);
          setRoutePath(null);
          toast.error("An error occurred during location lookup or fare calculation.");
        }
      } else {
        setEstimatedFare(null);
        setTripDetails(null);
        setRoutePath(null);
        setPickupLocation(null);
        setDestinationLocation(null);
      }
    };

    const debounceCalculate = setTimeout(() => {
      calculateFareAndRoute();
    }, 800); // Debounce to prevent excessive API calls on input change

    return () => clearTimeout(debounceCalculate);
  }, [pickup, destination, selectedVehicleType]);

  // Handle booking a ride
  const handleBookRide = useCallback(async (driverId: string) => {
    if (!pickupLocation || !destinationLocation) { // Check for geocoded locations
      toast.error("Please ensure both pickup and destination locations are valid.");
      return;
    }
    if (estimatedFare === null) {
      toast.error("Fare not calculated. Please ensure valid locations.");
      return;
    }

    try {
      toast.info(`Booking ride with driver ${driverId}...`);
      // In a real app, you would send pickupLocation, destinationLocation,
      // selectedVehicleType, and estimatedFare to your backend to create a ride.
      // e.g., await supabase.from('rides').insert({
      //   pickup_lat: pickupLocation.lat,
      //   pickup_lng: pickupLocation.lng,
      //   destination_lat: destinationLocation.lat,
      //   destination_lng: destinationLocation.lng,
      //   vehicle_type: selectedVehicleType,
      //   estimated_fare: estimatedFare,
      //   driver_id: driverId,
      //   status: 'pending',
      // });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      toast.success('Ride booked successfully! Driver is on their way.');
      setIsBookingDialogOpen(false); 
      // Further steps: navigate to a live tracking page, update UI with ride status etc.
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book ride. Please try again.");
    }
  }, [pickupLocation, destinationLocation, estimatedFare]);

  // Memoize the available drivers section
  const MemoizedDriverList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding available drivers for {selectedVehicleType}...</p>
        </div>
      );
    }

    if (drivers && drivers.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Driver #{driver.id.slice(0, 6)}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{(driver.rating || 0).toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({driver.total_rides || 0} rides)</span>
                    </div>
                  </div>
                  <Badge
                    variant={driver.status === 'available' ? 'default' : 'secondary'}
                    className={`${driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} px-3 py-1 text-xs`}
                  >
                    {driver.status === 'available' ? 'Available' : 'Busy'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Car className="h-4 w-4 text-orange-500" />
                    <span>{driver.vehicle_make} {driver.vehicle_model} ({driver.vehicle_year})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-700">
                      {driver.license_plate}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize font-medium bg-orange-50 text-orange-700">
                      {driver.vehicle_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>{driver.eta_minutes ? `~${driver.eta_minutes} mins away` : 'Calculating ETA...'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        disabled={!pickupLocation || !destinationLocation || estimatedFare === null} // Use geocoded locations
                      >
                        Book Ride
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Your Ride</DialogTitle>
                        <DialogDescription>
                          Please review the details before confirming your booking.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <p className="text-base font-medium">From: <span className="font-semibold">{pickupLocation?.name || pickup}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Navigation className="h-5 w-5 text-gray-500" />
                          <p className="text-base font-medium">To: <span className="font-semibold">{destinationLocation?.name || destination}</span></p>
                        </div>
                        {tripDetails && (
                          <>
                            <div className="flex items-center gap-3">
                              <Car className="h-5 w-5 text-gray-500" />
                              <p className="text-base font-medium">Vehicle: <span className="font-semibold capitalize">{selectedVehicleType}</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-gray-500" />
                              <p className="text-base font-medium">Est. Duration: <span className="font-semibold">{tripDetails.eta} mins</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-gray-500" />
                              <p className="text-base font-medium">Est. Distance: <span className="font-semibold">{tripDetails.distance.toFixed(1)} km</span></p>
                            </div>
                          </>
                        )}
                        {estimatedFare !== null && (
                          <div className="flex items-center gap-3 border-t pt-4 mt-4">
                            <Wallet className="h-6 w-6 text-orange-600" />
                            <p className="text-lg font-bold text-orange-600">Estimated Fare: <span className="text-2xl">KSh {estimatedFare.toFixed(2)}</span></p>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                           <User className="h-5 w-5 text-gray-500" />
                           <p className="text-base font-medium">Driver: <span className="font-semibold">Driver #{driver.id.slice(0, 6)}</span></p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleBookRide(driver.id)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    <Phone className="h-4 w-4 mr-2" /> Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Drivers Available for {selectedVehicleType}</h3>
        <p className="text-gray-600 mb-6">
          Please try a different vehicle type or refresh to check for new drivers.
        </p>
        <Button onClick={() => refetch()} disabled={isRefetching} variant="outline" className="flex items-center gap-2">
          {isRefetching ? (
            <span className="animate-spin text-lg">⚙️</span>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>
    );
  }, [isLoading, drivers, selectedVehicleType, pickup, destination, estimatedFare, tripDetails, handleBookRide, isBookingDialogOpen, isRefetching, refetch, pickupLocation, destinationLocation]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div
          className="relative h-64 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Car className="h-16 w-16 mx-auto mb-4 text-blue-100" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Book Your Ride</h1>
              <p className="text-lg text-blue-100 font-light leading-relaxed">
                Safe, reliable, and convenient transportation across Kenya.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Booking Form */}
          <Card className="mb-8 p-6 shadow-lg border border-gray-100">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                <Navigation className="h-6 w-6 text-orange-500" />
                Plan Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pickup-location" className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="pickup-location"
                      placeholder="e.g., Moi Avenue, Nairobi"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                      aria-label="Pickup Location"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="destination-location" className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="destination-location"
                      placeholder="e.g., Jomo Kenyatta International Airport"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                      aria-label="Destination Location"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Type Selection */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">Select Vehicle Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {VEHICLE_TYPES.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-between text-center min-h-[120px] ${
                        selectedVehicleType === vehicle.id
                          ? 'border-orange-500 bg-orange-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedVehicleType(vehicle.id)}
                      role="radio"
                      aria-checked={selectedVehicleType === vehicle.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedVehicleType(vehicle.id);
                        }
                      }}
                    >
                      <div className="text-3xl mb-2">{vehicle.icon}</div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">{vehicle.name}</h3>
                      <p className="text-xs text-gray-600 mb-1 leading-tight">{vehicle.description}</p>
                      <p className="text-sm font-bold text-orange-600 mt-auto">KSh {vehicle.pricePerKm}/km</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Fare Display */}
              {estimatedFare !== null && (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-blue-600" />
                    <p className="text-lg font-bold text-blue-800">Estimated Fare:</p>
                  </div>
                  <p className="text-2xl font-extrabold text-blue-800">
                    KSh {estimatedFare.toFixed(2)}
                  </p>
                </div>
              )}
               {tripDetails && (
                <div className="flex justify-between items-center text-sm text-gray-600 px-2">
                    <p className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-500" /> {tripDetails.distance.toFixed(1)} km</p>
                    <p className="flex items-center gap-1"><Clock className="h-4 w-4 text-gray-500" /> {tripDetails.eta} mins</p>
                </div>
              )}

              {/* This button will trigger the updated fare calculation logic via useEffect debounce */}
              <Button
                className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md transition-all duration-200"
                disabled={!pickup || !destination || isLoading || estimatedFare === null}
                onClick={() => { /* No direct action here, useEffect handles it */ }}
              >
                {isLoading ? 'Searching...' : 'Find Drivers & Estimate Fare'}
              </Button>
            </CardContent>
          </Card>

          {/* Map Display Section - Added the MapBox component here */}
          {(pickupLocation && destinationLocation) && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-orange-500" /> Your Route
              </h2>
              <MapBox
                center={pickupLocation} // Center map on pickup location initially
                zoom={12}
                markers={[
                  { id: 'pickup', position: pickupLocation, title: pickupLocation.name, color: '#3b82f6' },
                  { id: 'destination', position: destinationLocation, title: destinationLocation.name, color: '#ef4444' },
                ]}
                showRoute={routePath ? { start: pickupLocation, end: destinationLocation, path: routePath } : undefined}
                className="rounded-lg shadow-md border-2 border-gray-100"
              />
            </div>
          )}

          {/* Available Drivers Section */}
          <div className="space-y-6 pt-4">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Car className="h-7 w-7 text-orange-500" /> Available Drivers
            </h2>
            <p className="text-gray-600 mb-6">These drivers are available near your pickup location for the selected vehicle type.</p>

            {MemoizedDriverList}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rides;