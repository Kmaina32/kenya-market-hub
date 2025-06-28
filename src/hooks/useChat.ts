
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ChatConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
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

// Get user's conversations
export const useConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching conversations...');
      
      // Get conversations where user is a participant
      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      if (!conversations || conversations.length === 0) return [];

      // Get unique participant IDs (excluding current user)
      const participantIds = new Set<string>();
      conversations.forEach(conv => {
        if (conv.participant1_id !== user.id) participantIds.add(conv.participant1_id);
        if (conv.participant2_id !== user.id) participantIds.add(conv.participant2_id);
      });

      // Fetch participant profiles
      let participantProfiles: any[] = [];
      if (participantIds.size > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .in('id', Array.from(participantIds));
        participantProfiles = profiles || [];
      }

      // Combine the data
      return conversations.map(conv => ({
        ...conv,
        participant1: participantProfiles.find(p => p.id === conv.participant1_id),
        participant2: participantProfiles.find(p => p.id === conv.participant2_id)
      })) as ChatConversation[];
    },
    enabled: !!user,
  });
};

// Create a new conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (otherUserId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`)
        .single();

      if (existing) {
        return existing;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: otherUserId
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
      console.error('Conversation creation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
