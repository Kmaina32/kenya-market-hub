import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForumPost, ForumCategory, UserSearchResult } from '@/types/chat';

export type { UserSearchResult };

// Get forum categories
export const useForumCategories = () => {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as ForumCategory[] || [];
    },
  });
};

// Get all forum posts with author and category info
export const useForumPosts = () => {
  return useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      console.log('Fetching forum posts...');
      
      const { data: posts, error: postsError } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author_profile:profiles!author_id(id, full_name, avatar_url),
          category:forum_categories!category_id(id, name, color)
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching forum posts:', postsError);
        throw postsError;
      }

      return (posts || []).map(post => {
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
          author_profile: authorProfile,
          category: category
        };
      }) as ForumPost[];
    },
  });
};

// Create a new forum post
export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ title, content, category_id, author_id }: { 
      title: string; 
      content: string; 
      category_id: string;
      author_id: string;
    }) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title,
          content,
          author_id,
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

// Alias for backward compatibility
export const useChatForums = useForumCategories;
