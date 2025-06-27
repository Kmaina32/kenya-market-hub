import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ServiceBooking {
  id: string;
  customer_id: string;
  provider_id: string;
  service_type: string;
  service_description: string;
  booking_date: string;
  booking_time: string;
  booking_address: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'scheduled' | 'rejected';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: {
    full_name: string;
    email: string;
    phone?: string;
  };
  provider?: {
    full_name: string;
    business_name?: string;
  };
}

// Create service booking with proper provider validation
export const useCreateServiceBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookingData: {
      service_type: string;
      service_description: string;
      booking_date: string;
      booking_time: string;
      booking_address: string;
      total_amount: number;
      provider_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // If no provider_id is provided, create booking without provider
      const booking = {
        customer_id: user.id,
        provider_id: bookingData.provider_id || null,
        service_type: bookingData.service_type,
        service_description: bookingData.service_description,
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        booking_address: bookingData.booking_address,
        total_amount: bookingData.total_amount,
        status: 'pending' as const,
        payment_status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('service_bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast({
        title: 'Booking Created',
        description: 'Your service booking has been created successfully.'
      });
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

// Get user's bookings (as customer)
export const useMyBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: bookings, error } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!bookings) return [];

      // Get provider profiles
      const providerIds = bookings.map(b => b.provider_id).filter(Boolean);
      if (providerIds.length === 0) return bookings.map(booking => ({
        ...booking,
        service_type: booking.service_type || 'General Service',
        service_description: booking.service_description || booking.description || 'No description',
        booking_time: booking.booking_time || '09:00',
        booking_address: booking.booking_address || 'No address provided',
        total_amount: booking.total_amount || 0,
        payment_status: booking.payment_status || 'pending',
        provider: { full_name: '', business_name: undefined }
      }));

      const { data: providers } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', providerIds);

      // Get service provider profiles for business names
      const { data: serviceProviders } = await supabase
        .from('service_provider_profiles')
        .select('user_id, business_name')
        .in('user_id', providerIds);

      return bookings.map(booking => ({
        id: booking.id,
        customer_id: booking.customer_id,
        provider_id: booking.provider_id,
        service_type: booking.service_type || 'General Service',
        service_description: booking.service_description || booking.description || 'No description',
        booking_date: booking.booking_date,
        booking_time: booking.booking_time || '09:00',
        booking_address: booking.booking_address || 'No address provided',
        total_amount: booking.total_amount || 0,
        status: booking.status,
        payment_status: booking.payment_status || 'pending',
        notes: booking.notes,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        provider: {
          full_name: providers?.find(p => p.id === booking.provider_id)?.full_name || '',
          business_name: serviceProviders?.find(sp => sp.user_id === booking.provider_id)?.business_name
        }
      })) as ServiceBooking[];
    },
    enabled: !!user
  });
};

// Get provider's bookings (as service provider)
export const useProviderBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['provider-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: bookings, error } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!bookings) return [];

      // Get customer profiles
      const customerIds = bookings.map(b => b.customer_id).filter(Boolean);
      if (customerIds.length === 0) return bookings.map(booking => ({
        ...booking,
        service_type: booking.service_type || 'General Service',
        service_description: booking.service_description || booking.description || 'No description',
        booking_time: booking.booking_time || '09:00',
        booking_address: booking.booking_address || 'No address provided',
        total_amount: booking.total_amount || 0,
        payment_status: booking.payment_status || 'pending',
        customer: { full_name: '', email: '' }
      }));

      const { data: customers } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', customerIds);

      return bookings.map(booking => ({
        id: booking.id,
        customer_id: booking.customer_id,
        provider_id: booking.provider_id,
        service_type: booking.service_type || 'General Service',
        service_description: booking.service_description || booking.description || 'No description',
        booking_date: booking.booking_date,
        booking_time: booking.booking_time || '09:00',
        booking_address: booking.booking_address || 'No address provided',
        total_amount: booking.total_amount || 0,
        status: booking.status,
        payment_status: booking.payment_status || 'pending',
        notes: booking.notes,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        customer: customers?.find(c => c.id === booking.customer_id) || {
          full_name: '',
          email: ''
        }
      })) as ServiceBooking[];
    },
    enabled: !!user
  });
};

// Update booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, status, notes }: { 
      bookingId: string; 
      status: ServiceBooking['status'];
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('service_bookings')
        .update({ 
          status,
          notes: notes || undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
      toast({
        title: 'Booking Updated',
        description: 'Booking status has been updated successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason?: string }) => {
      const { data, error } = await supabase
        .from('service_bookings')
        .update({ 
          status: 'cancelled',
          notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Cancellation Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
