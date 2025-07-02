
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data as Product[];
    }
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product with ID:', id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      return data as Product;
    },
    enabled: !!id
  });
};

export const useCreateProduct = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating product:', productData);
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      console.log('Product created successfully:', data);
      return data as Product;
    },
    onSuccess: () => {
      toast({
        title: 'Product Created',
        description: 'Your product has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Product> & { id: string }) => {
      console.log('Updating product:', id, updateData);
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      console.log('Product updated successfully:', data);
      return data as Product;
    },
    onSuccess: () => {
      toast({
        title: 'Product Updated',
        description: 'Your product has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product:', id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      console.log('Product deleted successfully');
    },
    onSuccess: () => {
      toast({
        title: 'Product Deleted',
        description: 'Your product has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useIncrementProductViews = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.rpc('increment_product_views', {
        product_id: productId
      });

      if (error) {
        console.error('Error incrementing product views:', error);
        throw error;
      }
    },
  });
};
