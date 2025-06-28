
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
      return data || [];
    },
  });
};

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
