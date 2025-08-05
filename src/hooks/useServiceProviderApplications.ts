
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ServiceProviderApplication {
  id: string;
  user_id: string;
  service_type: string;
  business_name: string;
  business_description: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  license_number?: string;
  experience_years?: number;
  service_areas?: string[];
  documents?: any;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useServiceProviderApplications = () => {
  return useQuery({
    queryKey: ['service-provider-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as ServiceProviderApplication[];
    }
  });
};

export const useMyServiceProviderApplication = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-service-provider-application', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('service_provider_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as ServiceProviderApplication | null;
    },
    enabled: !!user
  });
};

export const useCreateServiceProviderApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (applicationData: Omit<ServiceProviderApplication, 'id' | 'user_id' | 'status' | 'submitted_at' | 'reviewed_at' | 'reviewed_by' | 'admin_notes' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('service_provider_applications')
        .insert({
          ...applicationData,
          user_id: user.id,
          status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-service-provider-application'] });
      queryClient.invalidateQueries({ queryKey: ['all-service-provider-profiles'] });
      toast({
        title: 'Application Submitted Successfully!',
        description: 'Your service provider application has been submitted for review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
    },
  });
};

export const useApproveServiceProviderApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { data, error } = await supabase.rpc('approve_service_provider_application', {
        p_application_id: applicationId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['service-providers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      toast({
        title: 'Application Approved',
        description: 'Service provider application has been approved and provider account created.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useRejectServiceProviderApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      const { error } = await supabase.rpc('reject_service_provider_application', {
        p_application_id: applicationId,
        p_admin_notes: notes
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-applications'] });
      toast({
        title: 'Application Rejected',
        description: 'Service provider application has been rejected.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
