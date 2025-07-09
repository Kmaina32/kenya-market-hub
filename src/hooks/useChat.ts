
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChatConversation } from '@/types/chat';

export type { ChatConversation };

export const useConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match ChatConversation interface
      const conversations = (data || []).map(conv => ({
        ...conv,
        participant1: { full_name: 'User 1', avatar_url: null },
        participant2: { full_name: 'User 2', avatar_url: null }
      }));
      
      return conversations as ChatConversation[];
    },
    enabled: !!user
  });
};

export const useCreateConversation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('chat_conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${targetUserId}),and(participant1_id.eq.${targetUserId},participant2_id.eq.${user.id})`)
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: targetUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    }
  });
};
