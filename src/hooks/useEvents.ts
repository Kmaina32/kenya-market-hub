
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  event_type: string;
  date: string;
  end_date?: string;
  price?: number;
  max_attendees?: number;
  current_attendees?: number;
  organizer_id?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    }
  });
};

export const useBookEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;

      if (event.max_attendees && event.current_attendees >= event.max_attendees) {
        throw new Error('Event is fully booked');
      }

      const { error } = await supabase
        .from('events')
        .update({ 
          current_attendees: (event.current_attendees || 0) + 1 
        })
        .eq('id', eventId);

      if (error) throw error;
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event booked successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to book event: ' + error.message);
    }
  });
};
