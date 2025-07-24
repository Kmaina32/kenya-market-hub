import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

interface DriverMatchingRequest {
  rideId: string;
  pickupLat: number;
  pickupLng: number;
  vehicleType: 'taxi' | 'motorbike';
  urgency: 'normal' | 'high';
  maxWaitTime?: number;
}

interface MatchedDriver {
  id: string;
  user_id: string;
  distance_km: number;
  estimated_pickup_minutes: number;
  rating: number;
  acceptance_rate: number;
  last_active: string;
  vehicle_type: 'taxi' | 'motorbike' | 'delivery';
  vehicle_make: string;
  vehicle_model: string;
  license_plate: string;
  phone_number: string;
  status: 'available' | 'busy' | 'offline';
  current_location: string;
  total_rides: number;
  score: number; // Computed matching score
}

interface DriverResponse {
  request_id: string;
  driver_id: string;
  response: 'accepted' | 'declined';
  response_time: number;
}

export const useRealTimeDriverMatching = () => {
  const [activeMatching, setActiveMatching] = useState<string | null>(null);
  const [assignedDriver, setAssignedDriver] = useState<MatchedDriver | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<'idle' | 'searching' | 'found' | 'timeout'>('idle');
  const [currentRotation, setCurrentRotation] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Calculate driver matching score
  const calculateDriverScore = (driver: any, distance: number, pickupLat: number, pickupLng: number) => {
    const baseScore = 100;
    
    // Distance factor (closer = higher score)
    const distanceScore = Math.max(0, 50 - (distance * 5));
    
    // Rating factor (higher rating = higher score)
    const ratingScore = (driver.rating || 0) * 10;
    
    // Acceptance rate factor
    const acceptanceScore = (driver.acceptance_rate || 0.5) * 20;
    
    // Activity factor (more recently active = higher score)
    const lastActiveMinutes = new Date().getTime() - new Date(driver.last_active || new Date()).getTime();
    const activityScore = Math.max(0, 10 - (lastActiveMinutes / (1000 * 60 * 5))); // 5 min decay
    
    // Experience factor (more rides = higher score)
    const experienceScore = Math.min(10, (driver.total_rides || 0) / 10);
    
    const totalScore = baseScore + distanceScore + ratingScore + acceptanceScore + activityScore + experienceScore;
    
    return Math.max(0, Math.min(200, totalScore));
  };

  // Find and rank available drivers
  const findAvailableDrivers = async ({ pickupLat, pickupLng, vehicleType }: DriverMatchingRequest) => {
    try {
      const { data: nearbyDrivers, error } = await supabase.rpc('find_nearby_drivers', {
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        vehicle_type_param: vehicleType,
        radius_km: 15
      });

      if (error) throw error;

      if (!nearbyDrivers || nearbyDrivers.length === 0) {
        return [];
      }

      // Get additional driver details
      const driverIds = nearbyDrivers.map((d: any) => d.driver_id);
      const { data: driverDetails, error: detailsError } = await supabase
        .from('drivers')
        .select('*')
        .in('id', driverIds)
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('status', 'available');

      if (detailsError) throw detailsError;

      // Merge and calculate scores
      const rankedDrivers = nearbyDrivers.map((nearby: any) => {
        const details = driverDetails?.find(d => d.id === nearby.driver_id);
        if (!details) return null;

        const score = calculateDriverScore(details, nearby.distance_km, pickupLat, pickupLng);
        
        return {
          ...details,
          distance_km: nearby.distance_km,
          estimated_pickup_minutes: nearby.estimated_pickup_minutes,
          score,
          acceptance_rate: 0.85, // Mock data - would come from driver stats
          last_active: details.updated_at || new Date().toISOString(),
          vehicle_make: details.vehicle_make || 'Unknown',
          vehicle_model: details.vehicle_model || 'Unknown',
          license_plate: details.license_plate || 'Unknown'
        };
      }).filter(Boolean).sort((a, b) => b.score - a.score);

      return rankedDrivers;
    } catch (error) {
      console.error('Error finding available drivers:', error);
      return [];
    }
  };

  // Send ride request to driver
  const sendRideRequest = async (rideId: string, driver: MatchedDriver) => {
    try {
      const { error } = await supabase
        .from('driver_ride_requests')
        .insert({
          ride_id: rideId,
          driver_id: driver.id,
          distance_km: driver.distance_km,
          estimated_pickup_minutes: driver.estimated_pickup_minutes,
          expires_at: new Date(Date.now() + 30 * 1000).toISOString(), // 30 seconds
          status: 'pending'
        });

      if (error) throw error;

      // Update driver status to busy temporarily
      await supabase
        .from('drivers')
        .update({ status: 'busy' })
        .eq('id', driver.id);

      return true;
    } catch (error) {
      console.error('Error sending ride request:', error);
      return false;
    }
  };

  // Listen for driver responses
  const listenForDriverResponses = (rideId: string) => {
    const channel = supabase.channel(`ride_requests:${rideId}`);

    channel.on(
      'postgres_changes',
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'driver_ride_requests',
        filter: `ride_id=eq.${rideId}`
      },
      (payload) => {
        const response = payload.new as any;
        
        if (response.status === 'accepted') {
          setMatchingStatus('found');
          setAssignedDriver(prev => prev ? { ...prev, id: response.driver_id } : null);
          setActiveMatching(null);
          
          toast({
            title: "Driver Found!",
            description: `A driver has accepted your ride request. They'll be there in ${response.estimated_pickup_minutes} minutes.`,
          });
        } else if (response.status === 'declined') {
          // Continue to next driver in rotation
          console.log(`Driver ${response.driver_id} declined. Trying next driver...`);
        }
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Main matching function with rotation
  const startDriverMatching = async (request: DriverMatchingRequest) => {
    setMatchingStatus('searching');
    setActiveMatching(request.rideId);
    setCurrentRotation(0);

    try {
      const availableDrivers = await findAvailableDrivers(request);
      
      if (availableDrivers.length === 0) {
        setMatchingStatus('timeout');
        toast({
          title: "No Drivers Available",
          description: "We couldn't find any drivers in your area. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      // Set up real-time listener
      const cleanup = listenForDriverResponses(request.rideId);

      // Start rotation through drivers
      let currentIndex = 0;
      const maxRotations = Math.min(3, availableDrivers.length);
      
      const tryNextDriver = async () => {
        if (currentIndex >= maxRotations || matchingStatus !== 'searching') {
          cleanup();
          return;
        }

        const driver = availableDrivers[currentIndex];
        console.log(`Trying driver ${currentIndex + 1}/${maxRotations}:`, driver);

        const sent = await sendRideRequest(request.rideId, driver);
        
        if (sent) {
          setCurrentRotation(currentIndex + 1);
          
          // Wait 30 seconds for response
          setTimeout(() => {
            if (matchingStatus === 'searching') {
              currentIndex++;
              tryNextDriver();
            }
          }, 30000);
        } else {
          currentIndex++;
          tryNextDriver();
        }
      };

      await tryNextDriver();

      // Final timeout after all rotations
      setTimeout(() => {
        if (matchingStatus === 'searching') {
          setMatchingStatus('timeout');
          setActiveMatching(null);
          cleanup();
          
          toast({
            title: "Matching Timeout",
            description: "We couldn't find an available driver. Please try again.",
            variant: "destructive"
          });
        }
      }, maxRotations * 30000 + 10000);

    } catch (error) {
      console.error('Error in driver matching:', error);
      setMatchingStatus('timeout');
      setActiveMatching(null);
      
      toast({
        title: "Matching Error",
        description: "An error occurred while finding drivers. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Stop matching
  const stopMatching = () => {
    setMatchingStatus('idle');
    setActiveMatching(null);
    setAssignedDriver(null);
    setCurrentRotation(0);
  };

  // Get real-time driver locations
  const { data: nearbyDriversLocation } = useQuery({
    queryKey: ['nearby-drivers-location'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_locations')
        .select(`
          *,
          drivers (
            id,
            user_id,
            vehicle_type,
            vehicle_make,
            vehicle_model,
            license_plate,
            rating,
            status,
            is_active,
            is_verified
          )
        `)
        .eq('is_active', true)
        .eq('drivers.is_active', true)
        .eq('drivers.is_verified', true)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Update every 5 seconds
    enabled: matchingStatus === 'searching'
  });

  return {
    startDriverMatching,
    stopMatching,
    matchingStatus,
    activeMatching,
    assignedDriver,
    currentRotation,
    nearbyDriversLocation,
    findAvailableDrivers
  };
};
