import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForumPost } from '@/types/chat';

export const useForumPosts = (categoryId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['forum-posts', categoryId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          author_profile:profiles!author_id(id, full_name, avatar_url),
          category:forum_categories!category_id(id, name, color)
        `)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data: posts, error } = await query;

      if (error) {
        console.error('Error fetching forum posts:', error);
        throw error;
      }

      if (!posts || posts.length === 0) {
        return [];
      }

      // Transform posts and add like status
      const transformedData = await Promise.all(posts.map(async (post) => {
        let has_liked = false;
        
        if (user) {
          const { data: likeData } = await supabase
            .from('forum_post_reactions')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .eq('reaction_type', 'like')
            .maybeSingle();
          
          has_liked = !!likeData;
        }

        // Ensure we have proper author profile with fallback
        const authorProfile = post.author_profile && post.author_profile.full_name 
          ? post.author_profile 
          : { 
              id: post.author_id,
              full_name: 'Anonymous User', 
              avatar_url: null 
            };

        // Ensure we have proper category with fallback
        const category = post.category && post.category.name 
          ? post.category 
          : { 
              id: post.category_id,
              name: 'General', 
              color: '#3b82f6' 
            };

        return {
          ...post,
          has_liked,
          author_profile: authorProfile,
          category: category
        };
      }));

      return transformedData as ForumPost[];
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

export const useCreateForumPost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      categoryId,
      imageUrl
    }: {
      title: string;
      content: string;
      categoryId: string;
      imageUrl?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          title,
          content,
          category_id: categoryId,
          author_id: user.id,
          image_url: imageUrl
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-topics'] });
      toast({
        title: 'Post Created',
        description: 'Your forum post has been created successfully.'
      });
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

export const useDeleteForumPost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast({
        title: 'Post Deleted',
        description: 'Your post has been deleted successfully.'
      });
    },
    onError: (error: any) => {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

export const useTogglePostLike = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Use maybeSingle() instead of single() to avoid 406 errors
      const { data: existingLike } = await supabase
        .from('forum_post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', 'like')
        .maybeSingle();

      if (existingLike) {
        const { error } = await supabase
          .from('forum_post_reactions')
          .delete()
          .eq('id', existingLike.id);
        
        if (error) throw error;
        return { action: 'unliked' };
      } else {
        const { error } = await supabase
          .from('forum_post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like'
          });
        
        if (error) throw error;
        return { action: 'liked' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
    onError: (error: any) => {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_post_views', {
        post_id: postId
      });

      if (error) throw error;
    }
  });
};

export const useTrendingTopics = () => {
  return useQuery({
    queryKey: ['trending-topics'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('forum_posts')
        .select('content')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const hashtagCounts: Record<string, number> = {};
      
      posts?.forEach(post => {
        const hashtags = post.content.match(/#\w+/g) || [];
        hashtags.forEach(tag => {
          const cleanTag = tag.toLowerCase();
          hashtagCounts[cleanTag] = (hashtagCounts[cleanTag] || 0) + 1;
        });
      });

      return Object.entries(hashtagCounts)
        .map(([tag, count]) => ({ tag: tag.substring(1), posts: count }))
        .sort((a, b) => b.posts - a.posts)
        .slice(0, 5);
    }
  });
};
