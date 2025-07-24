
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Phone, Clock, AlertTriangle, Share2 } from 'lucide-react';
import { useSafetyFeatures } from '@/hooks/useSafetyFeatures';

interface RideSafetyTrackerProps {
  rideId: string;
  driverInfo: {
    name: string;
    phone: string;
    licensePlate: string;
    rating: number;
  };
  estimatedArrival?: Date;
  currentLocation?: { lat: number; lng: number };
}

const RideSafetyTracker: React.FC<RideSafetyTrackerProps> = ({
  rideId,
  driverInfo,
  estimatedArrival,
  currentLocation
}) => {
  const { shareRideWithContacts, emergencyContacts } = useSafetyFeatures();
  const [isShared, setIsShared] = useState(false);
  const [tripDuration, setTripDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTripDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleShareRide = async () => {
    await shareRideWithContacts(rideId);
    setIsShared(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSafetyStatus = () => {
    if (driverInfo.rating < 4.0) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    }
    return { status: 'safe', color: 'bg-green-100 text-green-800', icon: Shield };
  };

  const safetyStatus = getSafetyStatus();
  const StatusIcon = safetyStatus.icon;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Safety Tracker</span>
          </div>
          <Badge className={safetyStatus.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {safetyStatus.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Driver Safety Info */}
        <div className="bg-white p-3 rounded-lg">
          <h4 className="font-medium mb-2">Driver Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">{driverInfo.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Rating:</span>
              <p className="font-medium">{driverInfo.rating}/5.0</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-medium">{driverInfo.phone}</p>
            </div>
            <div>
              <span className="text-gray-600">License:</span>
              <p className="font-medium">{driverInfo.licensePlate}</p>
            </div>
          </div>
        </div>

        {/* Trip Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-gray-600" />
            <p className="text-xs text-gray-600">Trip Duration</p>
            <p className="font-bold">{formatDuration(tripDuration)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <MapPin className="h-4 w-4 mx-auto mb-1 text-gray-600" />
            <p className="text-xs text-gray-600">ETA</p>
            <p className="font-bold">
              {estimatedArrival ? estimatedArrival.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Safety Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleShareRide}
            disabled={isShared || emergencyContacts.length === 0}
            className="w-full"
            variant="outline"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {isShared ? 'Ride Shared' : 'Share Ride with Contacts'}
          </Button>
          
          <Button
            onClick={() => window.open(`tel:${driverInfo.phone}`)}
            className="w-full"
            variant="outline"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Driver
          </Button>
        </div>

        {/* Safety Tips */}
        <div className="bg-white p-3 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Safety Tips</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Share your ride with trusted contacts</li>
            <li>• Verify driver and vehicle details</li>
            <li>• Use SOS button if you feel unsafe</li>
            <li>• Stay alert and trust your instincts</li>
          </ul>
        </div>

        {emergencyContacts.length === 0 && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Add emergency contacts to enhance your safety
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideSafetyTracker;
