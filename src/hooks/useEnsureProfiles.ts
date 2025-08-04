
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook to ensure all users have profiles - useful for admin monitoring
export const useEnsureProfiles = () => {
  return useQuery({
    queryKey: ['missing-profiles'],
    queryFn: async () => {
      // Check for users without profiles
      const { data: usersWithoutProfiles, error } = await supabase
        .from('profiles')
        .select('id')
        .is('full_name', null);

      if (error) {
        console.error('Error checking profiles:', error);
        return { missingCount: 0, hasIssues: false };
      }

      return {
        missingCount: usersWithoutProfiles?.length || 0,
        hasIssues: (usersWithoutProfiles?.length || 0) > 0
      };
    },
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
