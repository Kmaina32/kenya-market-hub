
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Navigation, Car, Bike, Clock, DollarSign } from 'lucide-react';
import MapBox from './MapBox';
import { useCreateRide } from '@/hooks/useCreateRide';

interface EnhancedRideBookingProps {
  onRideBooked?: (rideId: string) => void;
  isModal?: boolean; // New prop to indicate if it's used in a modal
  initialPickupAddress?: string; // Optional initial values for modal
  initialDestinationAddress?: string;
}

const EnhancedRideBooking: React.FC<EnhancedRideBookingProps> = ({
  onRideBooked,
  isModal = false, // Default to false
  initialPickupAddress = '',
  initialDestinationAddress = '',
}) => {
  const [step, setStep] = useState(isModal ? 1 : 1); // Start at step 1 for modal
  const [pickupAddress, setPickupAddress] = useState(initialPickupAddress);
  const [destinationAddress, setDestinationAddress] = useState(initialDestinationAddress);
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [vehicleType, setVehicleType] = useState<'taxi' | 'motorbike'>('taxi');
  const [estimatedFare, setEstimatedFare] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const createRide = useCreateRide();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickupLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // TODO: Use geocoding service to get address from coordinates
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Nairobi center
          setPickupLocation({ lat: -1.2921, lng: 36.8219 });
           // TODO: Use geocoding service to get address from coordinates
        }
      );
    } else {
       // TODO: Use geocoding service to get address from default coordinates
       setPickupLocation({ lat: -1.2921, lng: 36.8219 });
    }

  }, []);

  // Calculate estimated fare when locations change
  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      // Simple distance calculation (in real app, use proper routing API)
      const distance = calculateDistance(pickupLocation, destinationLocation);
      
      // Simple fare calculation
      const baseFare = vehicleType === 'taxi' ? 100 : 60;
      const perKmRate = vehicleType === 'taxi' ? 50 : 30;
      const calculatedFare = baseFare + (distance * perKmRate);
      const minimumFare = vehicleType === 'taxi' ? 150 : 100;
      
      setEstimatedFare(Math.max(calculatedFare, minimumFare));
      setEstimatedTime(Math.round(distance * 2)); // Rough estimate: 2 minutes per km
    }
  }, [pickupLocation, destinationLocation, vehicleType]);

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleMapClick = (coordinates: { lat: number; lng: number }) => {
    if (step === 1) {
      setPickupLocation(coordinates);
      // TODO: Use geocoding service to get address from coordinates and set pickupAddress
    } else if (step === 2) {
      setDestinationLocation(coordinates);
      // TODO: Use geocoding service to get address from coordinates and set destinationAddress
    }
  };

  const handleBookRide = () => {
    if (!pickupLocation || !destinationLocation || !pickupAddress || !destinationAddress) {
      return;
    }

    createRide.mutate({
      pickupAddress,
      destinationAddress,
      pickupLocation,
      destinationLocation,
      vehicleType,
    }, {
      onSuccess: (data) => {
        onRideBooked?.(data.id);
        if (!isModal) { // Only reset steps and form if not in modal
          setStep(1);
          setPickupAddress('');
          setDestinationAddress('');
          setPickupLocation(null);
          setDestinationLocation(null);
        }
      }
    });
  };

  const markers = [];
  if (pickupLocation) {
    markers.push({
      id: 'pickup',
      position: pickupLocation,
      title: 'Pickup Location',
      color: '#10b981'
    });
  }
  if (destinationLocation) {
    markers.push({
      id: 'destination',
      position: destinationLocation,
      title: 'Destination',
      color: '#ef4444'
    });
  }

  const showRoute = pickupLocation && destinationLocation ? {
    start: pickupLocation,
    end: destinationLocation
  } : undefined;

  const renderBookingForm = () => (
    <div className={`space-y-4 ${isModal ? '' : 'card-content'}`}>
      {/* Step 1: Pickup Location */}
      {(step >= 1 && (!isModal || (isModal && step === 1))) && (
        <div className="space-y-2">
          <Label htmlFor="pickup">Pickup Location</Label>
          <div className="flex gap-2">
            <MapPin className="h-4 w-4 mt-3 text-green-600" />
            <Input
              id="pickup"
              placeholder="Enter pickup address"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
             {isModal ? 'Select pickup on the map or enter address' : 'Click on the map to select your pickup location'}
          </p>
          {(!isModal && step === 1) && (
            <Button
              onClick={() => setStep(2)}
              disabled={!pickupLocation || !pickupAddress}
              className="w-full"
            >
              Next: Set Destination
            </Button>
          )}
        </div>
      )}

      {/* Step 2: Destination */}
      {(step >= 2 && !isModal) && ( // Only show as a separate step in non-modal view
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <div className="flex gap-2">
            <MapPin className="h-4 w-4 mt-3 text-red-600" />
            <Input
              id="destination"
              placeholder="Enter destination address"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Click on the map to select your destination
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!destinationLocation || !destinationAddress}
              className="flex-1"
            >
              Next: Choose Vehicle
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Vehicle Selection (or Step 2 in modal) */}
      {((step >= 3 && !isModal) || (isModal && step === 1 && pickupLocation && destinationLocation)) && (
        <div className="space-y-4">
           {!isModal && <Label>Choose Vehicle Type</Label>}
            <RadioGroup value={vehicleType} onValueChange={(value) => setVehicleType(value as 'taxi' | 'motorbike')}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="taxi" id="taxi" />
                <Car className="h-5 w-5" />
                <div className="flex-1">
                  <Label htmlFor="taxi" className="font-medium">Taxi</Label>
                  <p className="text-sm text-muted-foreground">4-seater car</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">KSh {estimatedFare.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{estimatedTime} min
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="motorbike" id="motorbike" />
                <Bike className="h-5 w-5" />
                <div className="flex-1">
                  <Label htmlFor="motorbike" className="font-medium">Motorbike</Label>
                  <p className="text-sm text-muted-foreground">Quick & affordable</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">KSh {Math.round(estimatedFare * 0.6)}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{Math.round(estimatedTime * 0.8)} min
                  </p>
                </div>
              </div>
            </RadioGroup>

          <div className={`flex gap-2 ${isModal ? 'mt-6' : ''}`}>
             {!isModal && (
               <Button variant="outline" onClick={() => setStep(2)}>
                 Back
               </Button>
             )}
            <Button
              onClick={handleBookRide}
              disabled={createRide.isPending || !pickupLocation || !destinationLocation}
              className="flex-1"
            >
              {createRide.isPending ? 'Booking...' : `Book Ride - KSh ${vehicleType === 'taxi' ? estimatedFare.toFixed(0) : Math.round(estimatedFare * 0.6)}`}
            </Button>
          </div>
        </div>
      )}
       {/* In modal view, show destination input after pickup is selected */}
      {(isModal && step === 1 && pickupLocation && !destinationLocation) && (
         <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="flex gap-2">
              <MapPin className="h-4 w-4 mt-3 text-red-600" />
              <Input
                id="destination"
                placeholder="Enter destination address"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Select destination on the map or enter address
            </p>
          </div>
      )}
    </div>
  );


  return (
    <div className={isModal ? '' : 'space-y-6'}>
      {!isModal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Book a Ride
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderBookingForm()}
          </CardContent>
        </Card>
      )}

      {isModal && renderBookingForm()}

      {/* Map */}
      {((!isModal && step <= 2) || isModal) && ( // Show map in modal and in first two steps of non-modal
         <Card className={isModal ? 'mt-4' : ''}>
            <CardContent className="p-4">
              <MapBox
                center={pickupLocation || { lat: -1.2921, lng: 36.8219 }}
                zoom={13}
                markers={markers}
                onMapClick={handleMapClick}
                showRoute={showRoute}
                className="w-full h-96 rounded-lg"
              />
            </CardContent>
          </Card>
      )}
       {/* In modal view, show map until booking is complete */}
       {(isModal && step === 1 && (!pickupLocation || !destinationLocation)) && (
           <Card className='mt-4'>
              <CardContent className="p-4">
                <MapBox
                  center={pickupLocation || { lat: -1.2921, lng: 36.8219 }}
                  zoom={13}
                  markers={markers}
                  onMapClick={handleMapClick}
                  showRoute={showRoute}
                  className="w-full h-96 rounded-lg"
                />
              </CardContent>
            </Card>
       )}
    </div>
  );
};

export default EnhancedRideBooking;
