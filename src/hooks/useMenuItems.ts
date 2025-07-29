
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  restaurant_id: string;
}

export const useMenuItems = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu-items', restaurantId],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurantId
  });
};
