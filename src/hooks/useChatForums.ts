
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  author_profile?: {
    full_name: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
  };
}

export interface UserSearchResult {
  id: string;
  full_name: string;
  avatar_url?: string;
  email: string;
}

export interface ChatConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  other_participant?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
  };
}

// Get all forum posts with author and category info
export const useForumPosts = () => {
  return useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      console.log('Fetching forum posts...');
      
      // First get the posts
      const { data: posts, error: postsError } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching forum posts:', postsError);
        throw postsError;
      }

      if (!posts) return [];

      // Get unique author IDs and category IDs
      const authorIds = [...new Set(posts.map(p => p.author_id))];
      const categoryIds = [...new Set(posts.map(p => p.category_id))];

      // Fetch author profiles
      let authorProfiles: any[] = [];
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', authorIds);
        authorProfiles = profiles || [];
      }

      // Fetch categories
      let categories: any[] = [];
      if (categoryIds.length > 0) {
        const { data: cats } = await supabase
          .from('forum_categories')
          .select('id, name')
          .in('id', categoryIds);
        categories = cats || [];
      }

      // Combine the data
      return posts.map(post => ({
        ...post,
        author_profile: authorProfiles.find(p => p.id === post.author_id),
        category: categories.find(c => c.id === post.category_id)
      })) as ForumPost[];
    },
  });
};

// Get forum categories - renamed from useChatForums to avoid confusion
export const useForumCategories = () => {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};

// Alias for backward compatibility
export const useChatForums = useForumCategories;

// Create a new forum post
export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ title, content, category_id }: { 
      title: string; 
      content: string; 
      category_id: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title,
          content,
          author_id: user.id,
          category_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast({
        title: 'Post Created',
        description: 'Your forum post has been created successfully.',
      });
    },
    onError: (error: any) => {
      console.error('Forum post creation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

// Increment post view count
export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_post_views', {
        post_id: postId
      });
      if (error) throw error;
    },
  });
};

// User search functionality
export const useUserSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['user-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      return data as UserSearchResult[];
    },
    enabled: !!searchTerm.trim(),
  });
};

// Chat conversations (moved from useChat.ts)
export const useChatConversations = () => {
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

      // Combine the data and add other_participant info
      return conversations.map(conv => {
        const otherParticipantId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
        const otherParticipant = participantProfiles.find(p => p.id === otherParticipantId);
        
        return {
          ...conv,
          unread_count: 0, // TODO: Implement unread count logic
          other_participant: otherParticipant,
          participant1: participantProfiles.find(p => p.id === conv.participant1_id),
          participant2: participantProfiles.find(p => p.id === conv.participant2_id)
        };
      }) as ChatConversation[];
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
    mutationFn: async ({ participantId }: { participantId: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${participantId}),and(participant1_id.eq.${participantId},participant2_id.eq.${user.id})`)
        .single();

      if (existing) {
        return { conversationId: existing.id };
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: participantId
        })
        .select()
        .single();

      if (error) throw error;
      return { conversationId: data.id };
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

// Start business conversation
export const useStartBusinessConversation = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ businessId, initialMessage }: { businessId: string; initialMessage: string }) => {
      // This is a placeholder - you would implement business conversation logic here
      console.log('Starting conversation with business:', businessId, initialMessage);
      
      // For now, just show a success message
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the business.',
      });
    },
    onError: (error: any) => {
      console.error('Business conversation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
