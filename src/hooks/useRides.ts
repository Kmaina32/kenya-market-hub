
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RideBooking {
  pickupAddress: string;
  destinationAddress: string;
  vehicleType: 'taxi' | 'motorbike';
  pickupLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
}

export interface Ride {
  id: string;
  pickup_address: string;
  destination_address: string;
  vehicle_type: 'taxi' | 'motorbike';
  estimated_fare: number;
  actual_fare?: number;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  driver_id?: string;
}

export const useRides = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: userRides, isLoading } = useQuery({
    queryKey: ['rides', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ride[];
    },
    enabled: !!user,
  });

  const bookRideMutation = useMutation({
    mutationFn: async (booking: RideBooking) => {
      if (!user) throw new Error('User not authenticated');

      // Simple fare calculation based on vehicle type
      const baseFare = booking.vehicleType === 'taxi' ? 100 : 50;
      const estimatedFare = baseFare + 50; // Simple calculation

      const { data, error } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          pickup_address: booking.pickupAddress,
          destination_address: booking.destinationAddress,
          vehicle_type: booking.vehicleType,
          pickup_location: `POINT(${booking.pickupLocation.lng} ${booking.pickupLocation.lat})`,
          destination_location: `POINT(${booking.destinationLocation.lng} ${booking.destinationLocation.lat})`,
          estimated_fare: estimatedFare,
          status: 'requested',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast({
        title: "Ride Booked!",
        description: "Your ride request has been submitted. We're finding a driver for you.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    userRides,
    isLoading,
    bookRide: bookRideMutation.mutate,
    isBookingRide: bookRideMutation.isPending,
  };
};
