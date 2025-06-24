
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderWithProfile {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  coupon_id: string;
  discount_amount: number;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    total_price: number;
    products: {
      name: string;
      image_url: string;
    };
  }>;
  profiles: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async (): Promise<OrderWithProfile[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            quantity,
            unit_price,
            total_price,
            products(name, image_url)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch user profiles separately to avoid relation issues
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(order => order.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        // Add profile data to orders
        return data.map(order => ({
          ...order,
          profiles: profiles?.find(p => p.id === order.user_id) || null
        })) as OrderWithProfile[];
      }
      
      return data as OrderWithProfile[] || [];
    }
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update order status: ${error.message}`);
    }
  });
};
