import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Navigation, Clock, Star, Phone, User, CalendarDays, Wallet } from 'lucide-react'; // Added more icons
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner'; // For notifications (assuming you have sonner installed)
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // For booking confirmation modal

// --- Interfaces for better type safety and clarity ---
interface Driver {
  id: string; // Changed to string for UUIDs
  user_id: string; // Assuming a link to a user table
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  license_plate: string;
  vehicle_type: 'sedan' | 'suv' | 'van' | 'motorcycle';
  rating: number;
  total_rides: number;
  status: 'available' | 'on_trip' | 'offline';
  current_lat: number; // For real-time location
  current_lon: number; // For real-time location
  phone_number: string; // Added phone number
  eta_minutes?: number; // Estimated time of arrival
}

interface VehicleType {
  id: 'sedan' | 'suv' | 'van' | 'motorcycle';
  name: string;
  icon: string;
  pricePerKm: number; // Changed to number for calculations
  description: string;
}

// --- Mock Data for demonstration (replace with actual API calls/real-time data) ---
const VEHICLE_TYPES: VehicleType[] = [
  { id: 'sedan', name: 'Sedan', icon: '🚗', pricePerKm: 80, description: '4 seats, Standard comfort' },
  { id: 'suv', name: 'SUV', icon: '🚙', pricePerKm: 160, description: '7 seats, Premium comfort' },
  { id: 'van', name: 'Van', icon: '🚐', pricePerKm: 100, description: '12+ seats, Group travel' },
  { id: 'motorcycle', name: 'Boda Boda', icon: '🏍️', pricePerKm: 50, description: 'Quick & affordable' }
];

// In a real app, `calculateDistanceAndEta` would use a mapping API (e.g., Google Maps API)
const calculateDistanceAndEta = async (pickup: string, destination: string, driverLat: number, driverLon: number) => {
  // Mocking API call for distance and ETA calculation
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  // Dummy values based on current location and destination.
  // In a real app, this would involve complex geospatial calculations or API calls.
  const distanceKm = Math.random() * 20 + 5; // 5-25 km
  const etaMinutes = Math.floor(distanceKm * (Math.random() * 1.5 + 2)); // 2-3.5 mins per km
  const driverEta = Math.floor(Math.random() * 10) + 2; // Driver is 2-12 mins away

  return { distanceKm, etaMinutes, driverEta };
};

const Rides: React.FC = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType['id']>('sedan');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [tripDetails, setTripDetails] = useState<{ distance: number; eta: number; } | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false); // State for booking confirmation modal

  const { data: drivers, isLoading, refetch, isRefetching } = useQuery<Driver[]>({
    queryKey: ['available-drivers', selectedVehicleType], // Add vehicle type to query key
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('status', 'available')
        .eq('vehicle_type', selectedVehicleType) // Filter by selected vehicle type
        .limit(10); // Still limiting for performance

      if (error) {
        console.error('Error fetching drivers:', error.message);
        toast.error('Failed to fetch drivers. Please try again.');
        throw error;
      }
      return data || [];
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds to keep driver list fresh
    staleTime: 20 * 1000, // Data considered fresh for 20 seconds
  });

  // Effect to calculate fare when pickup, destination, or vehicle type changes
  useEffect(() => {
    const calculateFare = async () => {
      if (pickup && destination) {
        try {
          const selectedVehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicleType);
          if (!selectedVehicle) return;

          // In a real app, you'd pass actual coordinates for pickup/destination
          // For now, use dummy driver location
          const { distanceKm, etaMinutes } = await calculateDistanceAndEta(pickup, destination, 0, 0); // Lat/Lon dummy
          const fare = distanceKm * selectedVehicle.pricePerKm;
          setEstimatedFare(fare);
          setTripDetails({ distance: distanceKm, eta: etaMinutes });
        } catch (error) {
          console.error('Error calculating fare:', error);
          setEstimatedFare(null);
          setTripDetails(null);
        }
      } else {
        setEstimatedFare(null);
        setTripDetails(null);
      }
    };

    const debounceCalculate = setTimeout(() => {
      calculateFare();
    }, 500); // Debounce to prevent excessive API calls on input change

    return () => clearTimeout(debounceCalculate);
  }, [pickup, destination, selectedVehicleType]);

  // Handle booking a ride
  const handleBookRide = useCallback(async (driverId: string) => {
    if (!pickup || !destination) {
      toast.error("Please enter both pickup and destination locations.");
      return;
    }
    if (!estimatedFare) {
      toast.error("Could not calculate fare. Please check locations.");
      return;
    }

    try {
      // Simulate booking process
      toast.info(`Booking ride with driver ${driverId}...`);
      // In a real app, you would insert a new 'ride' record into your database
      // await supabase.from('rides').insert({...});
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      toast.success('Ride booked successfully! Driver is on their way.');
      setIsBookingDialogOpen(false); // Close modal on success
      // Potentially navigate to a live tracking page or update UI
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book ride. Please try again.");
    }
  }, [pickup, destination, estimatedFare]);

  // Memoize the available drivers section to avoid re-renders if nothing changes
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
                      <span className="text-sm font-medium text-gray-700">{driver.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({driver.total_rides} rides)</span>
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
                        disabled={!pickup || !destination || !estimatedFare}
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
                          <p className="text-base font-medium">From: <span className="font-semibold">{pickup}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Navigation className="h-5 w-5 text-gray-500" />
                          <p className="text-base font-medium">To: <span className="font-semibold">{destination}</span></p>
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
  }, [isLoading, drivers, selectedVehicleType, pickup, destination, estimatedFare, tripDetails, handleBookRide, isBookingDialogOpen, isRefetching, refetch]);

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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

              <Button
                className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md transition-all duration-200"
                disabled={!pickup || !destination || isLoading || estimatedFare === null}
                onClick={() => { /* This button just triggers driver search/fare calculation now. Actual booking is per driver */ }}
              >
                {isLoading ? 'Searching...' : 'Find Drivers & Estimate Fare'}
              </Button>
            </CardContent>
          </Card>

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