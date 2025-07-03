
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/types/restaurant';

// Define the interface for the parameters that the hook accepts
interface UseRestaurantsParams {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
  deliveryFeeRange?: [number, number];
  minDeliveryTime?: number;
}

export const useRestaurants = (params?: UseRestaurantsParams) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: async (): Promise<Restaurant[]> => {
      let query = supabase.from('restaurants').select('*');

      if (params?.searchTerm) {
        query = query.or(`name.ilike.%${params.searchTerm}%,cuisine_type.ilike.%${params.searchTerm}%`);
      }
      if (params?.category && params.category !== 'All') {
        query = query.eq('cuisine_type', params.category);
      }
      if (params?.deliveryFeeRange) {
          query = query.lte('delivery_fee', params.deliveryFeeRange[1]);
      }
      if (params?.minDeliveryTime && params.minDeliveryTime > 0) {
          query = query.lte('delivery_time_minutes', params.minDeliveryTime);
      }
      
      switch (params?.sortBy) {
        case 'rating_desc': 
          query = query.order('rating', { ascending: false, nullsFirst: true }); 
          break;
        case 'delivery_time_asc': 
          query = query.order('delivery_time_minutes', { ascending: true, nullsFirst: true }); 
          break;
        case 'min_order_asc': 
          query = query.order('minimum_order', { ascending: true, nullsFirst: true }); 
          break;
        default: 
          query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Restaurant[];
    }
  });
};
