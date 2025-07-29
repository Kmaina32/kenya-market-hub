
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Clock, Star, Phone, Car, Navigation, Users, Zap } from 'lucide-react';
import { useRealTimeDriverMatching } from '@/hooks/useRealTimeDriverMatching';
import { useToast } from '@/hooks/use-toast';

interface RealTimeDriverMatchingProps {
  rideRequest: {
    rideId: string;
    pickupLat: number;
    pickupLng: number;
    vehicleType: 'taxi' | 'motorbike';
    pickupAddress: string;
    destinationAddress: string;
  };
  onDriverAssigned: (driver: any) => void;
  onCancel: () => void;
}

const RealTimeDriverMatching: React.FC<RealTimeDriverMatchingProps> = ({
  rideRequest,
  onDriverAssigned,
  onCancel
}) => {
  const { toast } = useToast();
  const {
    startDriverMatching,
    stopMatching,
    matchingStatus,
    assignedDriver,
    currentRotation,
    nearbyDriversLocation
  } = useRealTimeDriverMatching();

  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Start matching when component mounts
  useEffect(() => {
    startDriverMatching({
      rideId: rideRequest.rideId,
      pickupLat: rideRequest.pickupLat,
      pickupLng: rideRequest.pickupLng,
      vehicleType: rideRequest.vehicleType,
      urgency: 'normal'
    });

    return () => {
      stopMatching();
    };
  }, [rideRequest.rideId]);

  // Progress tracking
  useEffect(() => {
    if (matchingStatus === 'searching') {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setProgress(prev => Math.min(prev + 1, 95));
      }, 1000);

      return () => clearInterval(interval);
    } else if (matchingStatus === 'found') {
      setProgress(100);
    }
  }, [matchingStatus]);

  // Handle driver assignment
  useEffect(() => {
    if (assignedDriver && matchingStatus === 'found') {
      onDriverAssigned(assignedDriver);
    }
  }, [assignedDriver, matchingStatus, onDriverAssigned]);

  const handleCancel = () => {
    stopMatching();
    onCancel();
  };

  const getStatusMessage = () => {
    switch (matchingStatus) {
      case 'searching':
        return `Searching for ${rideRequest.vehicleType} drivers... (${timeElapsed}s)`;
      case 'found':
        return 'Driver found! Preparing your ride...';
      case 'timeout':
        return 'No drivers available. Please try again.';
      default:
        return 'Initializing...';
    }
  };

  const getStatusColor = () => {
    switch (matchingStatus) {
      case 'searching':
        return 'bg-orange-500';
      case 'found':
        return 'bg-green-500';
      case 'timeout':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-orange-500" />
          Finding Your Driver
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor()} text-white`}>
              {matchingStatus === 'searching' && (
                <Zap className="h-3 w-3 mr-1 animate-pulse" />
              )}
              {matchingStatus.charAt(0).toUpperCase() + matchingStatus.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">
              Rotation {currentRotation}/3
            </span>
          </div>
          <p className="text-sm text-gray-600">{getStatusMessage()}</p>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Trip Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-sm text-gray-600">{rideRequest.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Navigation className="h-4 w-4 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Destination</p>
              <p className="text-sm text-gray-600">{rideRequest.destinationAddress}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Car className="h-5 w-5 text-orange-500" />
          <div>
            <p className="font-medium capitalize">{rideRequest.vehicleType}</p>
            <p className="text-sm text-gray-600">
              {rideRequest.vehicleType === 'taxi' ? 'Comfortable ride' : 'Quick & affordable'}
            </p>
          </div>
        </div>

        {/* Nearby Drivers Count */}
        {nearbyDriversLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{nearbyDriversLocation.length} drivers nearby</span>
          </div>
        )}

        {/* Driver Found */}
        {assignedDriver && matchingStatus === 'found' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Car className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Driver Found!</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{assignedDriver.rating?.toFixed(1) || 'N/A'}</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>{assignedDriver.estimated_pickup_minutes} min</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{assignedDriver.vehicle_make} {assignedDriver.vehicle_model}</p>
              <p>{assignedDriver.license_plate}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={matchingStatus === 'found'}
            className="flex-1"
          >
            Cancel
          </Button>
          {matchingStatus === 'timeout' && (
            <Button
              onClick={() => {
                setProgress(0);
                setTimeElapsed(0);
                startDriverMatching({
                  rideId: rideRequest.rideId,
                  pickupLat: rideRequest.pickupLat,
                  pickupLng: rideRequest.pickupLng,
                  vehicleType: rideRequest.vehicleType,
                  urgency: 'normal'
                });
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeDriverMatching;
