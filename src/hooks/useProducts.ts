
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/types/product';

interface UseProductsParams {
  vendorId?: string;
  category?: string;
  searchQuery?: string;
  limit?: number;
}

export const useProducts = (params: UseProductsParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (params.vendorId) {
        query = query.eq('vendor_id', params.vendorId);
      }
      
      if (params.category) {
        query = query.eq('category', params.category);
      }
      
      if (params.searchQuery) {
        query = query.ilike('name', `%${params.searchQuery}%`);
      }
      
      if (params.limit) {
        query = query.limit(params.limit);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include required fields with defaults
      return (data || []).map(item => ({
        ...item,
        rating: item.rating || 4, // Use existing rating or default
        reviews_count: item.reviews_count || 0 // Use existing count or default
      })) as Product[];
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'rating' | 'reviews_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...product,
          vendor_id: product.vendor_id || user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating product: ${error.message}`);
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating product: ${error.message}`);
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting product: ${error.message}`);
    }
  });
};
