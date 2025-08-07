
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ServiceProviderApplication {
  id: string;
  user_id: string;
  service_type: string;
  business_name: string;
  business_description?: string;
  business_address?: string;
  business_phone: string;
  business_email: string;
  license_number?: string;
  experience_years?: number;
  specialization?: string;
  service_areas?: string[];
  documents?: any;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    profiles?: {
      full_name?: string;
    };
  };
}

// Get all applications (admin only)
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

// Get user's own applications
export const useMyServiceProviderApplications = () => {
  return useQuery({
    queryKey: ['my-service-provider-applications'],
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

// Get applications by category
export const useServiceProviderApplicationsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['service-provider-applications', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_applications')
        .select(`
          *,
          user:user_id (
            email,
            profiles (
              full_name
            )
          )
        `)
        .eq('service_type', category)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as ServiceProviderApplication[];
    },
    enabled: !!category
  });
};

// Approve application
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
      queryClient.invalidateQueries({ queryKey: ['my-service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-service-providers'] });
      toast({
        title: 'Application Approved',
        description: 'Service provider application has been approved successfully.'
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

// Reject application
export const useRejectServiceProviderApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      const { error } = await supabase.rpc('reject_service_provider_application', {
        p_application_id: applicationId,
        p_admin_notes: notes || null
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-service-provider-applications'] });
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

// Create application
export const useCreateServiceProviderApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      service_type: string;
      business_name: string;
      business_description?: string;
      business_address?: string;
      business_phone: string;
      business_email: string;
      license_number?: string | null;
      experience_years?: number | null;
      specialization?: string | null;
      service_areas?: string[] | null;
      documents?: any;
    }) => {
      const { error } = await (supabase as any)
        .from('service_provider_applications' as any)
        .insert([{ ...payload }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-applications'] });
      toast({ title: 'Application Submitted', description: 'Your application is under review.' });
    },
    onError: (error: any) => {
      toast({ title: 'Submission Failed', description: error.message, variant: 'destructive' });
    }
  });
};

// Get application statistics
export const useServiceProviderApplicationStats = () => {
return useQuery({
  queryKey: ['service-provider-application-stats'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('service_provider_applications')
      .select('status, service_type');

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter((app: any) => app.status === 'pending').length,
      approved: data.filter((app: any) => app.status === 'approved').length,
      rejected: data.filter((app: any) => app.status === 'rejected').length,
      byCategory: (data as any[]).reduce((acc: any, app: any) => {
        acc[app.service_type] = (acc[app.service_type] || 0) + 1;
        return acc;
      }, {})
    };

    return stats;
  }
});
};
