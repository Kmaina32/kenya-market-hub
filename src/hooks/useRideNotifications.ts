
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useRideNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Listen for ride status updates
    const channel = supabase
      .channel('ride-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newRide = payload.new as any;
          const oldRide = payload.old as any;

          if (newRide.status !== oldRide.status) {
            switch (newRide.status) {
              case 'driver_assigned':
                toast({
                  title: "Driver Assigned! 🚗",
                  description: "Your driver is on the way to pick you up.",
                });
                break;
              case 'driver_arrived':
                toast({
                  title: "Driver Arrived! 📍",
                  description: "Your driver has arrived at the pickup location.",
                });
                break;
              case 'in_progress':
                toast({
                  title: "Trip Started! 🛣️",
                  description: "Your ride is now in progress.",
                });
                break;
              case 'completed':
                toast({
                  title: "Trip Completed! ✅",
                  description: "Thank you for riding with us!",
                });
                break;
              case 'cancelled':
                toast({
                  title: "Trip Cancelled",
                  description: "Your ride has been cancelled.",
                  variant: "destructive"
                });
                break;
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
};
