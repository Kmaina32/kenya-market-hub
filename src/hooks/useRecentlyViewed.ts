
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RecentlyViewedItem {
  id: string;
  product_id: string;
  viewed_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    vendor: string;
  };
}

export const useRecentlyViewed = () => {
  return useQuery({
    queryKey: ['recently-viewed'],
    queryFn: async (): Promise<RecentlyViewedItem[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      // Since recently_viewed table doesn't exist, return mock data
      return [
        {
          id: '1',
          product_id: 'prod-1',
          viewed_at: new Date().toISOString(),
          product: {
            id: 'prod-1',
            name: 'Sample Product',
            price: 1500,
            image_url: '/placeholder.svg',
            vendor: 'Sample Vendor'
          }
        }
      ];
    }
  });
};

export const useAddToRecentlyViewed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Mock implementation since table doesn't exist
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    }
  });
};
