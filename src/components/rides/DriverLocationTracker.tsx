
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MapPin, Navigation, Clock, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { useDriverLocationTracking } from '@/hooks/useDriverLocationTracking';
import { useAuth } from '@/contexts/AuthContext';

const DriverLocationTracker: React.FC = () => {
  const { user } = useAuth();
  const {
    isTracking,
    lastLocation,
    startTracking,
    stopTracking,
    checkDriverStatus
  } = useDriverLocationTracking();

  const [isDriver, setIsDriver] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<'high' | 'medium' | 'low'>('medium');

  // Check driver status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const driverStatus = await checkDriverStatus();
      setIsDriver(driverStatus);
    };

    if (user) {
      checkStatus();
    }
  }, [user, checkDriverStatus]);

  // Update location accuracy indicator
  useEffect(() => {
    if (lastLocation?.accuracy) {
      if (lastLocation.accuracy < 20) {
        setLocationAccuracy('high');
      } else if (lastLocation.accuracy < 50) {
        setLocationAccuracy('medium');
      } else {
        setLocationAccuracy('low');
      }
    }
  }, [lastLocation]);

  const handleTrackingToggle = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  const getAccuracyColor = () => {
    switch (locationAccuracy) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAccuracyText = () => {
    switch (locationAccuracy) {
      case 'high':
        return 'High accuracy';
      case 'medium':
        return 'Medium accuracy';
      case 'low':
        return 'Low accuracy';
      default:
        return 'Unknown';
    }
  };

  if (!isDriver) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">
            This feature is only available for verified drivers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-orange-500" />
          Driver Location Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={isTracking ? 'bg-green-500' : 'bg-gray-500'}>
              {isTracking ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {isTracking ? 'Online' : 'Offline'}
            </Badge>
            {isTracking && (
              <Zap className="h-4 w-4 text-green-500 animate-pulse" />
            )}
          </div>
          <Switch
            checked={isTracking}
            onCheckedChange={handleTrackingToggle}
          />
        </div>

        {/* Location Info */}
        {lastLocation && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-sm text-gray-600">
                  {lastLocation.lat.toFixed(6)}, {lastLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getAccuracyColor()}`} />
              <div>
                <p className="text-sm font-medium">GPS Accuracy</p>
                <p className="text-sm text-gray-600">
                  {getAccuracyText()} ({lastLocation.accuracy?.toFixed(0)}m)
                </p>
              </div>
            </div>

            {lastLocation.speed && (
              <div className="flex items-center gap-3">
                <Navigation className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Speed</p>
                  <p className="text-sm text-gray-600">
                    {(lastLocation.speed * 3.6).toFixed(1)} km/h
                  </p>
                </div>
              </div>
            )}

            {lastLocation.heading && (
              <div className="flex items-center gap-3">
                <Navigation className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Heading</p>
                  <p className="text-sm text-gray-600">
                    {lastLocation.heading.toFixed(0)}°
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">How it works:</p>
              <ul className="text-blue-700 mt-1 space-y-1">
                <li>• Turn on tracking to receive ride requests</li>
                <li>• Your location updates every 5 seconds</li>
                <li>• Riders can see your approximate distance</li>
                <li>• Turn off when you're done driving</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTrackingToggle}
            className="flex-1"
            disabled={!isDriver}
          >
            {isTracking ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverLocationTracker;
