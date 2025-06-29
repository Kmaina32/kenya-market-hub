
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');

      if (error) throw error;

      // Convert array of settings to object for easier use
      const settings = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>) || {};

      return settings;
    }
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Record<string, any>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update each setting individually
      const updates = Object.entries(settings).map(([key, value]) =>
        supabase
          .from('admin_settings')
          .upsert({
            setting_key: key,
            setting_value: value,
            updated_by: user.id
          }, { onConflict: 'setting_key' })
      );

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error('Failed to update some settings');
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update settings: ${error.message}`);
    }
  });
};
