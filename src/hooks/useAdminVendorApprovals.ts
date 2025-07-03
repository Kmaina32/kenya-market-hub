import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useVendorApplications = () => {
  return useQuery({
    queryKey: ['vendor-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useApproveVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { data, error } = await supabase.rpc('approve_vendor_application', {
        application_id: applicationId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor approved successfully');
    },
    onError: (error) => {
      toast.error(`Failed to approve vendor: ${error.message}`);
    }
  });
};

export const useRejectVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      const { data, error } = await supabase.rpc('reject_vendor_application', {
        application_id: applicationId,
        rejection_notes: notes
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      toast.success('Vendor application rejected');
    },
    onError: (error) => {
      toast.error(`Failed to reject vendor: ${error.message}`);
    }
  });
};

export const useDriverApplications = () => {
  return useQuery({
    queryKey: ['driver-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_applications')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useApproveDriver = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { data, error } = await supabase.rpc('approve_driver_application', {
        application_id: applicationId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-applications'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver approved successfully');
    },
    onError: (error) => {
      toast.error(`Failed to approve driver: ${error.message}`);
    }
  });
};

export const useRejectDriver = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      const { data, error } = await supabase.rpc('reject_driver_application', {
        application_id: applicationId,
        rejection_notes: notes
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-applications'] });
      toast.success('Driver application rejected');
    },
    onError: (error) => {
      toast.error(`Failed to reject driver: ${error.message}`);
    }
  });
};