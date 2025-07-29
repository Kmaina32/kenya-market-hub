
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForumComment } from '@/types/chat';

export const useForumComments = (postId: string) => {
  return useQuery({
    queryKey: ['forum-comments', postId],
    queryFn: async () => {
      const { data: comments, error } = await supabase
        .from('forum_post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!comments || comments.length === 0) {
        return [];
      }

      // Get unique author IDs
      const authorIds = [...new Set(comments.map(comment => comment.author_id))];
      
      // Fetch profiles separately
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', authorIds);

      // Combine comments with author profiles
      const commentsWithProfiles = comments.map(comment => {
        const authorProfile = profiles?.find(p => p.id === comment.author_id);
        return {
          ...comment,
          author_profile: authorProfile || { 
            full_name: 'Unknown User', 
            avatar_url: null 
          }
        };
      });

      return commentsWithProfiles as ForumComment[];
    },
    enabled: !!postId
  });
};

export const useCreateForumComment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_post_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['forum-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast({
        title: 'Comment posted',
        description: 'Your comment has been posted successfully.',
      });
    },
    onError: (error: any) => {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    }
  });
};
