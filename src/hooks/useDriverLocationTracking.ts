
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export const useDriverLocationTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState<LocationData | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Check if user is a driver
  const checkDriverStatus = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('id, is_active, is_verified')
        .eq('user_id', user.id)
        .single();

      if (error) return false;
      return data && data.is_active && data.is_verified;
    } catch {
      return false;
    }
  };

  // Update driver location in database
  const updateDriverLocation = async (location: LocationData) => {
    if (!user) return;

    try {
      const { data: driver } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!driver) return;

      // Update driver_locations table
      await supabase
        .from('driver_locations')
        .upsert({
          driver_id: driver.id,
          location: `(${location.lat},${location.lng})`,
          accuracy: location.accuracy,
          heading: location.heading,
          speed: location.speed,
          timestamp: new Date().toISOString(),
          is_active: true
        });

      // Update driver availability status
      await supabase
        .from('drivers')
        .update({
          last_location_update: new Date().toISOString(),
          availability_status: 'online'
        })
        .eq('id', driver.id);

      setLastLocation(location);
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  // Start location tracking
  const startTracking = async () => {
    const isDriver = await checkDriverStatus();
    if (!isDriver) {
      toast({
        title: "Access Denied",
        description: "Only verified drivers can use location tracking.",
        variant: "destructive"
      });
      return;
    }

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Available",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined
        };

        updateDriverLocation(location);
      },
      (error) => {
        console.error('Location tracking error:', error);
        toast({
          title: "Location Error",
          description: "Unable to track your location. Please check permissions.",
          variant: "destructive"
        });
      },
      options
    );

    setWatchId(id);
    setIsTracking(true);
    
    toast({
      title: "Location Tracking Started",
      description: "Your location is now being tracked for ride requests.",
    });
  };

  // Stop location tracking
  const stopTracking = async () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    setIsTracking(false);
    setLastLocation(null);

    // Update driver status to offline
    if (user) {
      try {
        const { data: driver } = await supabase
          .from('drivers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (driver) {
          await supabase
            .from('drivers')
            .update({ availability_status: 'offline' })
            .eq('id', driver.id);

          await supabase
            .from('driver_locations')
            .update({ is_active: false })
            .eq('driver_id', driver.id);
        }
      } catch (error) {
        console.error('Error updating offline status:', error);
      }
    }

    toast({
      title: "Location Tracking Stopped",
      description: "You are now offline and won't receive ride requests.",
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    isTracking,
    lastLocation,
    startTracking,
    stopTracking,
    checkDriverStatus
  };
};
