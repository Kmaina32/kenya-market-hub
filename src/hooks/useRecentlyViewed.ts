
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RecentlyViewedItem {
  id: string;
  product_id: string;
  viewed_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    vendor: string;
    rating: number;
    reviews_count: number;
    category: string;
    in_stock: boolean;
    stock_quantity: number;
  };
}

export const useRecentlyViewed = () => {
  return useQuery({
    queryKey: ['recently-viewed'],
    queryFn: async (): Promise<RecentlyViewedItem[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      console.log('Fetching recently viewed items for user:', user.id);
      
      const { data, error } = await supabase
        .from('recently_viewed')
        .select(`
          id,
          product_id,
          viewed_at,
          products (
            id,
            name,
            price,
            image_url,
            vendor,
            rating,
            reviews_count,
            category,
            in_stock,
            stock_quantity
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching recently viewed:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

export const useAddToRecentlyViewed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      console.log('Adding product to recently viewed:', productId);
      
      // Use the upsert_recently_viewed function
      const { error } = await supabase.rpc('upsert_recently_viewed', {
        p_user_id: user.id,
        p_product_id: productId
      });
      
      if (error) {
        console.error('Error adding to recently viewed:', error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    },
    onError: (error) => {
      console.error('Failed to add to recently viewed:', error);
    }
  });
};
