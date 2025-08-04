
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Valid profile fields that can be updated (based on actual database schema)
const VALID_PROFILE_FIELDS = ['full_name', 'phone', 'avatar_url'] as const;
type ValidProfileField = typeof VALID_PROFILE_FIELDS[number];

// Function to sanitize profile updates to only include valid fields
const sanitizeProfileUpdate = (updates: any): Partial<Pick<Profile, ValidProfileField>> => {
  const sanitized: any = {};
  
  // Only include valid fields that exist in the database
  VALID_PROFILE_FIELDS.forEach(field => {
    if (updates[field] !== undefined) {
      sanitized[field] = updates[field];
    }
  });
  
  // Always add updated_at timestamp
  sanitized.updated_at = new Date().toISOString();
  
  return sanitized;
};

// Hook to get the current user's profile
export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const query = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data as Profile | null;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Sanitize updates to only include valid database fields
      const validUpdates = sanitizeProfileUpdate(updates);

      console.log('Sanitized profile update:', validUpdates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(validUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      // also update user metadata in auth context if full_name changes
      if (data.full_name) {
          await supabase.auth.updateUser({ data: { full_name: data.full_name } });
      }
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    ...query,
    updateProfile
  };
};

// Hook to update the user's profile (keeping for backward compatibility)
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Sanitize updates to only include valid database fields
      const validUpdates = sanitizeProfileUpdate(updates);

      console.log('Sanitized profile update:', validUpdates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(validUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      // also update user metadata in auth context if full_name changes
      if (data.full_name) {
          await supabase.auth.updateUser({ data: { full_name: data.full_name } });
      }
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
