
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MedicalApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  provider_type: string;
  license_number: string;
  documents: any;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  specialization?: {
    name: string;
  };
}

export interface MedicalProvider {
  id: string;
  user_id: string;
  full_name: string;
  provider_type: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  created_at: string;
  specialization?: {
    name: string;
  };
}

export const useMedicalApplications = () => {
  return useQuery({
    queryKey: ['medical-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_provider_applications')
        .select(`
          *,
          specialization:medical_specializations(name)
        `);

      if (error) throw error;
      return data as MedicalApplication[];
    },
  });
};

export const useMedicalProviders = () => {
  return useQuery({
    queryKey: ['medical-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_providers')
        .select(`
          *,
          specialization:medical_specializations(name)
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data as MedicalProvider[];
    },
  });
};

export const useMedicalApplicationStatus = () => {
  return useQuery({
    queryKey: ['my-medical-application'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('medical_provider_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useMyMedicalProviderProfile = () => {
  return useQuery({
    queryKey: ['my-medical-provider-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('medical_providers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useApproveMedicalApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase
        .from('medical_provider_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      queryClient.invalidateQueries({ queryKey: ['medical-providers'] });
      toast({
        title: "Application Approved",
        description: "Medical provider has been approved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve application",
        variant: "destructive"
      });
    }
  });
};

export const useRejectMedicalApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes: string }) => {
      const { error } = await supabase
        .from('medical_provider_applications')
        .update({ 
          status: 'rejected',
          admin_notes: notes 
        })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      queryClient.invalidateQueries({ queryKey: ['medical-providers'] });
      toast({
        title: "Application Rejected",
        description: "Medical provider application has been rejected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject application",
        variant: "destructive"
      });
    }
  });
};
