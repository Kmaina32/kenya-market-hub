
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
            vendors (
              business_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        viewed_at: item.viewed_at,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image_url: item.products.image_url,
          vendor: item.products.vendors?.business_name || 'Unknown Vendor'
        } : undefined
      }));
    }
  });
};

export const useAddToRecentlyViewed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase.rpc('upsert_recently_viewed', {
        p_user_id: user.id,
        p_product_id: productId
      });
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    }
  });
};
