
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
  contact_email: string;
  contact_phone: string;
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
          ),
          profiles(id, full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data as OrderWithProfile[]) || [];
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
