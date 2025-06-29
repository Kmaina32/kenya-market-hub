
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createNotification } from '@/hooks/useNotifications';

export const useVendorApprovals = () => {
  const queryClient = useQueryClient();

  const approveVendor = useMutation({
    mutationFn: async (vendorId: string) => {
      // Get vendor details first
      const { data: vendor, error: fetchError } = await supabase
        .from('vendors')
        .select('*, profiles(full_name)')
        .eq('id', vendorId)
        .single();
      
      if (fetchError) throw fetchError;

      // Update vendor status
      const { error } = await supabase
        .from('vendors')
        .update({ 
          verification_status: 'approved',
          is_active: true 
        })
        .eq('id', vendorId);
      
      if (error) throw error;

      // Create notification for vendor
      if (vendor.user_id) {
        await createNotification(
          vendor.user_id,
          'Vendor Application Approved! 🎉',
          'Congratulations! Your vendor application has been approved. You can now start selling on our platform.',
          'success',
          '/vendor-dashboard'
        );
      }

      return vendor;
    },
    onSuccess: (vendor) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      toast.success(`Vendor "${vendor.business_name}" approved successfully`);
    },
    onError: (error: any) => {
      toast.error(`Failed to approve vendor: ${error.message}`);
    }
  });

  const rejectVendor = useMutation({
    mutationFn: async ({ vendorId, reason }: { vendorId: string; reason?: string }) => {
      // Get vendor details first
      const { data: vendor, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();
      
      if (fetchError) throw fetchError;

      // Update vendor status
      const { error } = await supabase
        .from('vendors')
        .update({ 
          verification_status: 'rejected',
          is_active: false 
        })
        .eq('id', vendorId);
      
      if (error) throw error;

      // Create notification for vendor
      if (vendor.user_id) {
        await createNotification(
          vendor.user_id,
          'Vendor Application Status Update',
          `Unfortunately, your vendor application has been rejected. ${reason ? `Reason: ${reason}` : 'Please contact support for more information.'}`,
          'error'
        );
      }

      return vendor;
    },
    onSuccess: (vendor) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      toast.success(`Vendor "${vendor.business_name}" rejected`);
    },
    onError: (error: any) => {
      toast.error(`Failed to reject vendor: ${error.message}`);
    }
  });

  return {
    approveVendor,
    rejectVendor
  };
};
