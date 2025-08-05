
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useServiceProviderApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveServiceProvider = useMutation({
    mutationFn: async ({ providerId }: { providerId: string }) => {
      // First check if this is an application ID or provider profile ID
      // For new system, we'll use the application approval function
      const { data, error } = await supabase.rpc('approve_service_provider_application', {
        p_application_id: providerId
      });

      if (error) {
        // Fallback to old system if it's a provider profile ID
        const { data: provider, error: fetchError } = await supabase
          .from('service_provider_profiles')
          .select('user_id, provider_type, business_name')
          .eq('id', providerId)
          .single();

        if (fetchError) throw fetchError;

        // Update the provider status
        const { error: updateError } = await supabase
          .from('service_provider_profiles')
          .update({ 
            verification_status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('id', providerId);

        if (updateError) throw updateError;

        // Create approval notification manually
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: provider.user_id,
            title: 'Service Provider Application Approved',
            message: 'Congratulations! Your Service Provider application has been approved. You can now access your dashboard.',
            type: 'success',
            action_url: '/services-app',
            metadata: {
              application_type: 'Service Provider',
              status: 'approved'
            }
          });

        if (notifError) {
          console.warn('Failed to create notification:', notifError);
        }

        return provider;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['all-service-provider-profiles'] });
      toast({
        title: 'Provider Approved',
        description: 'Service provider has been approved and notified.'
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

  const rejectServiceProvider = useMutation({
    mutationFn: async ({ providerId, notes }: { providerId: string; notes: string }) => {
      // Try new application rejection function first
      const { error } = await supabase.rpc('reject_service_provider_application', {
        p_application_id: providerId,
        p_admin_notes: notes
      });

      if (error) {
        // Fallback to old system if it's a provider profile ID
        const { data: provider, error: fetchError } = await supabase
          .from('service_provider_profiles')
          .select('user_id, provider_type, business_name')
          .eq('id', providerId)
          .single();

        if (fetchError) throw fetchError;

        // Update the provider status
        const { error: updateError } = await supabase
          .from('service_provider_profiles')
          .update({ 
            verification_status: 'rejected',
            updated_at: new Date().toISOString()
          })
          .eq('id', providerId);

        if (updateError) throw updateError;

        // Create rejection notification manually
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: provider.user_id,
            title: 'Service Provider Application Rejected',
            message: 'Unfortunately, your Service Provider application has been rejected. Please contact support for more information.',
            type: 'error',
            metadata: {
              application_type: 'Service Provider',
              status: 'rejected',
              notes: notes
            }
          });

        if (notifError) {
          console.warn('Failed to create notification:', notifError);
        }

        return provider;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['all-service-provider-profiles'] });
      toast({
        title: 'Provider Rejected',
        description: 'Service provider has been rejected and notified.'
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

  return {
    approveServiceProvider,
    rejectServiceProvider
  };
};
