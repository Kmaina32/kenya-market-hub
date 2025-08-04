
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
      
      if (!data || data.length === 0) return [];

      // Get all unique participant IDs
      const participantIds = new Set<string>();
      data.forEach(conv => {
        participantIds.add(conv.participant1_id);
        participantIds.add(conv.participant2_id);
      });

      // Fetch profiles for all participants
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', Array.from(participantIds));

      // Create a map for quick profile lookup
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      // Transform conversations with proper participant data
      const conversations = data.map(conv => ({
        ...conv,
        participant1: profileMap.get(conv.participant1_id) || {
          id: conv.participant1_id,
          full_name: 'Unknown User',
          avatar_url: null
        },
        participant2: profileMap.get(conv.participant2_id) || {
          id: conv.participant2_id,
          full_name: 'Unknown User', 
          avatar_url: null
        }
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
      toast({
        title: 'Success',
        description: 'Conversation started successfully.',
      });
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
