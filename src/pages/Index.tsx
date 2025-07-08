import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Navigation, Clock, Star, Phone, User, Wallet, Locate } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { geocodeAddress, getRouteDetails, loadGoogleMapsScript } from '@/integrations/googlemaps/googleMapsLoader';
import MapBox from '@/components/MapBox';
import SEOManager from '@/components/seo/SEOManager';

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
  icon: React.ComponentType<any>;
  pricePerKm: number;
  description: string;
}

const VEHICLE_TYPES: VehicleType[] = [
  { id: 'taxi', name: 'Taxi/Car', icon: Car, pricePerKm: 80, description: '4 seats, Air conditioning, Comfortable ride' },
  { id: 'motorbike', name: 'Boda Boda', icon: ({ className, size }) => (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4l1.5 3h4l-1 2h-2.5l2 4h3v2h-3.5l-2-4H9.5l-2 4H4v-2h3l2-4H6.5l-1-2h4L12 4z"/>
      <circle cx="6" cy="17" r="2"/>
      <circle cx="18" cy="17" r="2"/>
      <path d="M8 17h8"/>
    </svg>
  ), pricePerKm: 50, description: 'Quick & affordable, Navigate traffic easily' }
];

const Rides: React.FC = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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
        eta_minutes: Math.floor(Math.random() * 15) + 5
      })) as Driver[];
    },
    refetchInterval: 30 * 1000,
    staleTime: 20 * 1000,
  });

  // GPS Location Handler
  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const googleMaps = await loadGoogleMapsScript();
          if (!googleMaps) {
            throw new Error('Google Maps not available');
          }

          const geocoder = new google.maps.Geocoder();
          const latLng = { lat: position.coords.latitude, lng: position.coords.longitude };

          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const address = results[0].formatted_address;
              setPickup(address);
              setPickupLocation({
                name: address,
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              toast.success('Current location detected!');
            } else {
              toast.error('Could not determine your address');
            }
            setIsLoadingLocation(false);
          });
        } catch (error) {
          console.error('Error getting location:', error);
          toast.error('Error getting your location');
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Unable to access your location. Please check permissions.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    const calculateFareAndRoute = async () => {
      const googleMaps = await loadGoogleMapsScript();
      if (!googleMaps) {
        console.error('Google Maps API not available for geocoding.');
        return;
      }

      if (pickup && destination) {
        try {
          const selectedVehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicleType);
          if (!selectedVehicle) return;

          const pickupCoords = await geocodeAddress(pickup);
          const destinationCoords = await geocodeAddress(destination);

          if (pickupCoords && destinationCoords) {
            setPickupLocation({ name: pickupCoords.formattedAddress, lat: pickupCoords.lat, lng: pickupCoords.lng });
            setDestinationLocation({ name: destinationCoords.formattedAddress, lat: destinationCoords.lat, lng: destinationCoords.lng });

            const routeDetails = await getRouteDetails(
              { lat: pickupCoords.lat, lng: pickupCoords.lng },
              { lat: destinationCoords.lat, lng: destinationCoords.lng }
            );

            if (routeDetails) {
              const fare = routeDetails.distanceKm * selectedVehicle.pricePerKm;
              setEstimatedFare(fare);
              setTripDetails({ distance: routeDetails.distanceKm, eta: routeDetails.etaMinutes });
              setRoutePath(routeDetails.path);
            } else {
              setEstimatedFare(null);
              setTripDetails(null);
              setRoutePath(null);
            }
          } else {
            setEstimatedFare(null);
            setTripDetails(null);
            setRoutePath(null);
            setPickupLocation(null);
            setDestinationLocation(null);
          }
        } catch (error) {
          console.error('Error calculating fare or geocoding:', error);
          setEstimatedFare(null);
          setTripDetails(null);
          setRoutePath(null);
          setPickupLocation(null);
          setDestinationLocation(null);
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
    }, 800);

    return () => clearTimeout(debounceCalculate);
  }, [pickup, destination, selectedVehicleType]);

  const handleBookRide = useCallback(async (driverId: string) => {
    if (!pickupLocation || !destinationLocation) {
      toast.error("Please ensure both pickup and destination locations are valid.");
      return;
    }
    if (estimatedFare === null) {
      toast.error("Fare not calculated. Please ensure valid locations.");
      return;
    }

    try {
      toast.info(`Booking ride with driver ${driverId}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Ride booked successfully! Driver is on their way.');
      setIsBookingDialogOpen(false);
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book ride. Please try again.");
    }
  }, [pickupLocation, destinationLocation, estimatedFare]);

  const defaultMapCenter = useMemo(() => {
    return { lat: -1.286389, lng: 36.817223 };
  }, []);

  const mapMarkers = useMemo(() => {
    const markers = [];
    if (pickupLocation) {
      markers.push({ id: 'pickup', position: pickupLocation, title: pickupLocation.name, color: '#10b981' });
    }
    if (destinationLocation) {
      markers.push({ id: 'destination', position: destinationLocation, title: destinationLocation.name, color: '#ef4444' });
    }
    return markers;
  }, [pickupLocation, destinationLocation]);

  const mapRoute = useMemo(() => {
    if (routePath && pickupLocation && destinationLocation) {
      return { start: pickupLocation, end: destinationLocation, path: routePath };
    }
    return undefined;
  }, [routePath, pickupLocation, destinationLocation]);

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
            <Card key={driver.id} className="hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden">
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
                    className={`${driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} px-3 py-1 text-xs rounded-full`}
                  >
                    {driver.status === 'available' ? 'Available' : 'Busy'}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Car className="h-4 w-4 text-orange-500" />
                    <span>{driver.vehicle_make} {driver.vehicle_model} ({driver.vehicle_year})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-700 rounded-lg">
                      {driver.license_plate}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize font-medium bg-orange-50 text-orange-700 rounded-lg">
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
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl"
                        disabled={!pickupLocation || !destinationLocation || estimatedFare === null}
                      >
                        Book Ride
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
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
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl">
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
        <Button onClick={() => refetch()} disabled={isRefetching} variant="outline" className="flex items-center gap-2 rounded-xl">
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
    <FrontendLayout>
      <SEOManager
        title="Book Taxi & Cab in Kenya | Affordable Transport | Sokko Sasa Rides"
        description="Find and book reliable taxis, cabs, and transport services across Kenya, including Nairobi. Quick, safe, and affordable rideshare options on Sokko Sasa."
        keywords="taxi Kenya, cab Kenya, transport Kenya, rideshare Kenya, book a ride Nairobi, cheap taxi Nairobi, Sokko Sasa, ride booking app"
        url={`${window.location.origin}/rides`}
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section - Removed orange-red gradients */}
        <div className="relative h-64 overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80" /* Increased opacity for better contrast */
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
          {/* Removed the second overlay div entirely as it was for the gradient */}
          
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Navigation className="h-16 w-16 mx-auto mb-4 text-white" /> {/* Changed icon color to white */}
              <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">Book Your Ride</h1>
              <p className="text-lg text-white font-light leading-relaxed"> {/* Changed text color to white */}
                Safe, reliable, and convenient transportation across Kenya.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Booking Form */}
          <Card className="mb-8 p-6 shadow-xl border border-gray-100 rounded-3xl">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                <MapPin className="h-6 w-6 text-orange-500" />
                Plan Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="pickup-location" className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="pickup-location"
                        placeholder="Enter pickup address or use GPS"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="pl-10 pr-4 py-3 border rounded-xl focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <Button
                      onClick={handleGetCurrentLocation}
                      disabled={isLoadingLocation}
                      variant="outline"
                      size="sm"
                      className="px-3 py-3 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl"
                    >
                      {isLoadingLocation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600" />
                      ) : (
                        <Locate className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="destination-location" className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="destination-location"
                      placeholder="Where are you going?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10 pr-4 py-3 border rounded-xl focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Type Selection */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-4">Select Vehicle Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {VEHICLE_TYPES.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out flex items-center gap-4 min-h-[120px] ${
                        selectedVehicleType === vehicle.id
                          ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedVehicleType(vehicle.id)}
                    >
                      <div className={`p-4 rounded-2xl ${selectedVehicleType === vehicle.id ? 'bg-orange-100' : 'bg-gray-100'}`}>
                        <vehicle.icon className={`h-8 w-8 ${selectedVehicleType === vehicle.id ? 'text-orange-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">{vehicle.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">{vehicle.description}</p>
                        <p className="text-base font-bold text-orange-600">KSh {vehicle.pricePerKm}/km</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fare and Trip Details */}
              {estimatedFare !== null && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-6 w-6 text-blue-600" />
                      <p className="text-lg font-bold text-blue-800">Estimated Fare:</p>
                    </div>
                    <p className="text-3xl font-extrabold text-blue-800">
                      KSh {estimatedFare.toFixed(2)}
                    </p>
                  </div>
                  {tripDetails && (
                    <div className="flex justify-between items-center text-sm text-blue-700 pt-2 border-t border-blue-200">
                      <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {tripDetails.distance.toFixed(1)} km</p>
                      <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {tripDetails.eta} mins</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map Display */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-orange-500" /> {mapRoute ? 'Your Route' : 'Explore Area'}
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-100">
              <MapBox
                center={mapMarkers.length > 0 ? mapMarkers[0].position : defaultMapCenter}
                zoom={mapRoute ? 12 : 12}
                markers={mapMarkers}
                showRoute={mapRoute}
                className="w-full h-96"
              />
            </div>
          </div>

          {/* Available Drivers */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Car className="h-7 w-7 text-orange-500" /> Available Drivers
            </h2>
            <p className="text-gray-600 mb-6">These drivers are available near your pickup location for the selected vehicle type.</p>

            {MemoizedDriverList}
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Rides;