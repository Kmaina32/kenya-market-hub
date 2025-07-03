import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  participant1?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
  };
  participant2?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
  };
}

export const useConversations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          participant1:profiles!chat_conversations_participant1_id_fkey(id, full_name, avatar_url, email),
          participant2:profiles!chat_conversations_participant2_id_fkey(id, full_name, avatar_url, email)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      
      return data?.map(conv => ({
        ...conv,
        participant1: Array.isArray(conv.participant1) ? conv.participant1[0] : conv.participant1,
        participant2: Array.isArray(conv.participant2) ? conv.participant2[0] : conv.participant2
      })) as Conversation[];
    },
    enabled: !!user
  });
};

export const useCreateConversation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participant2Id: string) => {
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('*')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${participant2Id}),and(participant1_id.eq.${participant2Id},participant2_id.eq.${user.id})`)
        .single();

      if (existingConv) {
        return existingConv;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: participant2Id
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