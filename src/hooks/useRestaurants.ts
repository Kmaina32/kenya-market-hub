import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/pages/FoodDelivery'; // Import the Restaurant interface

// Define the interface for the parameters that the hook accepts
interface UseRestaurantsParams {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
  deliveryFeeRange?: [number, number];
  minDeliveryTime?: number;
}

export const useRestaurants = (params?: UseRestaurantsParams) => { // Accept optional params
  return useQuery<Restaurant[]>({
    queryKey: ['restaurants', params], // Include params in query key for caching
    queryFn: async () => {
      let query = supabase.from('restaurants').select('*'); // Adjust select as needed

      // Example of applying filters from params:
      if (params?.searchTerm) {
        query = query.or(`business_name.ilike.%${params.searchTerm}%,category.ilike.%${params.searchTerm}%`);
      }
      if (params?.category && params.category !== 'All') {
        query = query.eq('category', params.category);
      }
      if (params?.deliveryFeeRange) {
          query = query.lte('delivery_fee', params.deliveryFeeRange[1]);
      }
      if (params?.minDeliveryTime && params.minDeliveryTime > 0) {
          query = query.lte('delivery_time_max', params.minDeliveryTime); // Assuming delivery_time_max exists
      }
      // Add sorting logic based on params.sortBy
      switch (params?.sortBy) {
        case 'rating_desc': query = query.order('average_rating', { ascending: false, nullsFirst: true }); break;
        case 'delivery_time_asc': query = query.order('delivery_time_min', { ascending: true, nullsFirst: true }); break;
        case 'min_order_asc': query = query.order('min_order_value', { ascending: true, nullsFirst: true }); break;
        default: query = query.order('business_name', { ascending: true }); // Default sort
      }


      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });
};