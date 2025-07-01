
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useServiceProviderProfile = (providerType?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['service-provider-profile', user?.id, providerType],
    queryFn: async () => {
      if (!user) return null;

      let query = supabase
        .from('service_provider_profiles')
        .select('*')
        .eq('user_id', user.id);

      if (providerType) {
        query = query.eq('provider_type', providerType);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching service provider profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!user
  });
};

export const useAllServiceProviderProfiles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-service-provider-profiles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching service provider profiles:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user
  });
};

export const useCreateServiceProviderProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: any) => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      queryClient.invalidateQueries({ queryKey: ['all-service-provider-profiles'] });
      toast({
        title: 'Profile Created',
        description: 'Your service provider profile has been created successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create profile',
        variant: 'destructive'
      });
    }
  });
};
