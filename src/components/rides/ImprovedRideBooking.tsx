
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Navigation, Clock, Car, Locate, ArrowRight, Zap, Shield } from 'lucide-react';
import { useRides } from '@/hooks/useRides';
import { geocodeAddress, getRouteDetails, loadGoogleMapsScript } from '@/integrations/googlemaps/googleMapsLoader';
import { toast } from 'sonner';

interface ImprovedRideBookingProps {
  onRideBooked: (rideId: string) => void;
}

const VEHICLE_TYPES = [
  {
    id: 'taxi' as const,
    name: 'Taxi',
    icon: Car,
    pricePerKm: 80,
    description: 'Comfortable, air-conditioned ride',
    features: ['AC', '4 seats', 'Safe'],
    eta: '5-10 min',
    color: 'bg-blue-500'
  },
  {
    id: 'motorbike' as const,
    name: 'Boda Boda',
    icon: Zap,
    pricePerKm: 50,
    description: 'Quick and affordable',
    features: ['Fast', 'Beat traffic', 'Budget-friendly'],
    eta: '3-8 min',
    color: 'bg-green-500'
  }
];

const ImprovedRideBooking: React.FC<ImprovedRideBookingProps> = ({ onRideBooked }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<'taxi' | 'motorbike'>('taxi');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [tripDetails, setTripDetails] = useState<{ distance: number; eta: number } | null>(null);
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { bookRide, isBookingRide } = useRides();

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
              setPickupLocation(latLng);
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
      }
    );
  };

  useEffect(() => {
    const calculateFareAndRoute = async () => {
      if (pickup && destination) {
        try {
          const pickupCoords = await geocodeAddress(pickup);
          const destinationCoords = await geocodeAddress(destination);

          if (pickupCoords && destinationCoords) {
            setPickupLocation({ lat: pickupCoords.lat, lng: pickupCoords.lng });
            setDestinationLocation({ lat: destinationCoords.lat, lng: destinationCoords.lng });

            const routeDetails = await getRouteDetails(
              { lat: pickupCoords.lat, lng: pickupCoords.lng },
              { lat: destinationCoords.lat, lng: destinationCoords.lng }
            );

            if (routeDetails) {
              const vehicleType = VEHICLE_TYPES.find(v => v.id === selectedVehicle);
              const fare = routeDetails.distanceKm * (vehicleType?.pricePerKm || 80);
              setEstimatedFare(fare);
              setTripDetails({ distance: routeDetails.distanceKm, eta: routeDetails.etaMinutes });
            }
          }
        } catch (error) {
          console.error('Error calculating fare:', error);
          setEstimatedFare(null);
          setTripDetails(null);
        }
      }
    };

    const debounceTimer = setTimeout(calculateFareAndRoute, 500);
    return () => clearTimeout(debounceTimer);
  }, [pickup, destination, selectedVehicle]);

  const handleBookRide = async () => {
    if (!pickupLocation || !destinationLocation || !estimatedFare) {
      toast.error('Please ensure both pickup and destination are valid');
      return;
    }

    try {
      await bookRide({
        pickupAddress: pickup,
        destinationAddress: destination,
        vehicleType: selectedVehicle,
        pickupLocation,
        destinationLocation
      });
      
      // Reset form
      setPickup('');
      setDestination('');
      setEstimatedFare(null);
      setTripDetails(null);
      setPickupLocation(null);
      setDestinationLocation(null);
      
      onRideBooked('ride-id');
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const selectedVehicleType = VEHICLE_TYPES.find(v => v.id === selectedVehicle);

  return (
    <div className="space-y-6">
      {/* Location Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-orange-500" />
            Where to?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pickup Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Pickup Location
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter pickup address"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-orange-500 rounded-xl"
                />
              </div>
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isLoadingLocation}
                variant="outline"
                size="sm"
                className="h-12 px-4 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                {isLoadingLocation ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600" />
                ) : (
                  <Locate className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Destination
            </div>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 focus:border-orange-500 rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Selection */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Car className="h-5 w-5 text-orange-500" />
            Choose Your Ride
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {VEHICLE_TYPES.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                selectedVehicle === vehicle.id
                  ? 'border-orange-500 bg-orange-50 shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${vehicle.color} text-white`}>
                    <vehicle.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{vehicle.name}</h3>
                    <p className="text-gray-600 text-sm">{vehicle.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {vehicle.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">
                    KSh {vehicle.pricePerKm}/km
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vehicle.eta}
                  </div>
                </div>
              </div>
              
              {selectedVehicle === vehicle.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fare Estimation */}
      {estimatedFare && tripDetails && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  {selectedVehicleType?.icon && <selectedVehicleType.icon className="h-5 w-5 text-blue-600" />}
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Trip Summary</h3>
                  <p className="text-sm text-blue-700">{selectedVehicleType?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  KSh {estimatedFare.toFixed(2)}
                </div>
                <div className="text-sm text-blue-600">Estimated fare</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-blue-900">Distance</div>
                  <div className="text-sm text-blue-700">{tripDetails.distance.toFixed(1)} km</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-blue-900">Duration</div>
                  <div className="text-sm text-blue-700">{tripDetails.eta} mins</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Book Ride Button */}
      <Button
        onClick={handleBookRide}
        disabled={!pickup || !destination || !estimatedFare || isBookingRide}
        className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
      >
        {isBookingRide ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Booking your ride...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Book Ride
            <ArrowRight className="h-5 w-5" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default ImprovedRideBooking;
