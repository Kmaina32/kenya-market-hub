
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  date: string;
  end_date?: string;
  location: string;
  image_url?: string;
  price: number;
  max_attendees?: number;
  current_attendees: number;
  organizer_id?: string;
  is_active: boolean;
  created_at: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .gte('date', new Date().toISOString())
        .order('date');

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getEventsByType = (eventType: string) => {
    return events.filter(event => event.event_type.toLowerCase() === eventType.toLowerCase());
  };

  const getUpcomingEvents = (limit?: number) => {
    const upcoming = events.filter(event => new Date(event.date) > new Date());
    return limit ? upcoming.slice(0, limit) : upcoming;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    getEventsByType,
    getUpcomingEvents,
    refetch: fetchEvents
  };
};
