
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location_address: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'office';
  image_url?: string;
  is_featured?: boolean;
  amenities?: string[];
  agent_id?: string;
  listing_type: string;
  city: string;
  county: string;
  created_at?: string;
  updated_at?: string;
}

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyData: {
      title: string;
      description?: string;
      price: number;
      location_address: string;
      bedrooms?: number;
      bathrooms?: number;
      area_sqm?: number;
      property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'office';
      image_url?: string;
      is_featured?: boolean;
      amenities?: string[];
      listing_type: string;
      city: string;
      county: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          agent_id: user?.id || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to create property: ' + error.message);
    }
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      const { data: updatedProperty, error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property updated successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to update property: ' + error.message);
    }
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete property: ' + error.message);
    }
  });
};
