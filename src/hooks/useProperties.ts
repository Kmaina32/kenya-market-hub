
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Property {
  id: string;
  owner_id: string;
  agent_id?: string;
  title: string;
  description?: string;
  property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'office';
  listing_type: 'sale' | 'rent';
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  location_address: string;
  location_coordinates?: any;
  county?: string;
  city?: string;
  amenities?: string[];
  features?: string[];
  images?: string[];
  virtual_tour_url?: string;
  contact_phone?: string;
  contact_email?: string;
  status: 'available' | 'sold' | 'rented' | 'draft' | 'pending';
  is_featured: boolean;
  views_count: number;
  available_from?: string;
  created_at: string;
  updated_at: string;
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

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
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
      listing_type: 'sale' | 'rent';
      city: string;
      county: string;
      is_featured?: boolean;
      amenities?: string[];
      images?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          owner_id: user?.id || '',
          status: 'available',
          views_count: 0
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

export const useCreatePropertyInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiryData: {
      property_id: string;
      inquirer_name: string;
      inquirer_email: string;
      inquirer_phone?: string;
      message: string;
    }) => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert(inquiryData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-inquiries'] });
      toast.success('Inquiry sent successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to send inquiry: ' + error.message);
    }
  });
};
