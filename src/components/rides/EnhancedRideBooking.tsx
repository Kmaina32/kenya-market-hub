
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Navigation, Clock, DollarSign, Car, Zap, Users, AlertTriangle } from 'lucide-react';
import { useRealTimeDriverMatching } from '@/hooks/useRealTimeDriverMatching';
import RealTimeDriverMatching from './RealTimeDriverMatching';
import { useToast } from '@/hooks/use-toast';

interface VehicleOption {
  type: 'taxi' | 'motorbike';
  name: string;
  description: string;
  baseFare: number;
  perKmRate: number;
  icon: React.ReactNode;
  estimatedTime: string;
  capacity: number;
  features: string[];
}

const EnhancedRideBooking: React.FC = () => {
  const { toast } = useToast();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number>(0);
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  const [showMatching, setShowMatching] = useState(false);
  const [rideRequest, setRideRequest] = useState<any>(null);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [nearbyDriversCount, setNearbyDriversCount] = useState(0);
  
  const { findAvailableDrivers } = useRealTimeDriverMatching();

  const vehicleOptions: VehicleOption[] = [
    {
      type: 'taxi',
      name: 'Taxi',
      description: 'Comfortable ride with AC',
      baseFare: 200,
      perKmRate: 60,
      icon: <Car className="h-5 w-5" />,
      estimatedTime: '5-10 min',
      capacity: 4,
      features: ['Air Conditioning', 'Comfortable Seats', 'Safe & Reliable']
    },
    {
      type: 'motorbike',
      name: 'Boda Boda',
      description: 'Quick & affordable',
      baseFare: 100,
      perKmRate: 40,
      icon: <div className="w-5 h-5">🏍️</div>,
      estimatedTime: '2-5 min',
      capacity: 1,
      features: ['Fast Navigation', 'Beat Traffic', 'Affordable']
    }
  ];

  // Calculate fare estimate
  useEffect(() => {
    if (selectedVehicle && estimatedDistance > 0) {
      const baseFare = selectedVehicle.baseFare;
      const distanceFare = estimatedDistance * selectedVehicle.perKmRate;
      const totalFare = (baseFare + distanceFare) * surgeMultiplier;
      setEstimatedFare(totalFare);
    }
  }, [selectedVehicle, estimatedDistance, surgeMultiplier]);

  // Mock function to get nearby drivers count
  const checkNearbyDrivers = async () => {
    if (!pickup || !selectedVehicle) return;
    
    try {
      // Mock coordinates for demo
      const pickupCoords = { lat: -1.2921, lng: 36.8219 };
      const drivers = await findAvailableDrivers({
        rideId: 'temp',
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        vehicleType: selectedVehicle.type,
        urgency: 'normal'
      });
      
      setNearbyDriversCount(drivers.length);
      
      // Simulate surge pricing based on demand
      if (drivers.length < 2) {
        setSurgeMultiplier(1.5);
      } else if (drivers.length < 5) {
        setSurgeMultiplier(1.2);
      } else {
        setSurgeMultiplier(1.0);
      }
    } catch (error) {
      console.error('Error checking drivers:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkNearbyDrivers, 1000);
    return () => clearTimeout(timer);
  }, [pickup, selectedVehicle]);

  const handleBookRide = async () => {
    if (!pickup || !destination || !selectedVehicle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const rideId = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock coordinates - in real app, use geocoding
    const pickupCoords = { lat: -1.2921, lng: 36.8219 };
    const destinationCoords = { lat: -1.3021, lng: 36.8319 };
    
    setRideRequest({
      rideId,
      pickupLat: pickupCoords.lat,
      pickupLng: pickupCoords.lng,
      vehicleType: selectedVehicle.type,
      pickupAddress: pickup,
      destinationAddress: destination,
      estimatedFare,
      estimatedDistance
    });
    
    setShowMatching(true);
  };

  const handleDriverAssigned = (driver: any) => {
    toast({
      title: "Driver Assigned!",
      description: `Your ${selectedVehicle?.name} driver is on the way.`,
    });
    
    // Reset form
    setPickup('');
    setDestination('');
    setSelectedVehicle(null);
    setShowMatching(false);
    setRideRequest(null);
  };

  const handleCancelMatching = () => {
    setShowMatching(false);
    setRideRequest(null);
  };

  if (showMatching && rideRequest) {
    return (
      <RealTimeDriverMatching
        rideRequest={rideRequest}
        onDriverAssigned={handleDriverAssigned}
        onCancel={handleCancelMatching}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-orange-500" />
          Book a Ride
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
              <Input
                placeholder="Enter pickup address"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <div className="relative">
              <Navigation className="absolute left-3 top-3 h-4 w-4 text-red-500" />
              <Input
                placeholder="Enter destination address"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  // Mock distance calculation
                  setEstimatedDistance(5.2);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Vehicle Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicleOptions.map((vehicle) => (
              <div
                key={vehicle.type}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedVehicle?.type === vehicle.type
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    {vehicle.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">{vehicle.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{vehicle.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{vehicle.capacity} seat{vehicle.capacity > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <p>Base: KSh {vehicle.baseFare} + KSh {vehicle.perKmRate}/km</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fare Estimate */}
        {selectedVehicle && estimatedDistance > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Estimated Fare</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">
                  KSh {estimatedFare.toFixed(0)}
                </p>
                {surgeMultiplier > 1 && (
                  <Badge className="bg-yellow-500 text-white">
                    <Zap className="h-3 w-3 mr-1" />
                    {surgeMultiplier}x Surge
                  </Badge>
                )}
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Base fare</span>
                <span>KSh {selectedVehicle.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance ({estimatedDistance.toFixed(1)} km)</span>
                <span>KSh {(estimatedDistance * selectedVehicle.perKmRate).toFixed(0)}</span>
              </div>
              {surgeMultiplier > 1 && (
                <div className="flex justify-between">
                  <span>Surge multiplier ({surgeMultiplier}x)</span>
                  <span>+KSh {((estimatedFare / surgeMultiplier) * (surgeMultiplier - 1)).toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Driver Availability */}
        {nearbyDriversCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{nearbyDriversCount} {selectedVehicle?.name} drivers nearby</span>
            {surgeMultiplier > 1 && (
              <Badge variant="outline" className="text-yellow-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High demand
              </Badge>
            )}
          </div>
        )}

        {/* Book Button */}
        <Button
          onClick={handleBookRide}
          disabled={!pickup || !destination || !selectedVehicle}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          size="lg"
        >
          Book {selectedVehicle?.name || 'Ride'}
          {estimatedFare > 0 && (
            <span className="ml-2">• KSh {estimatedFare.toFixed(0)}</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedRideBooking;
