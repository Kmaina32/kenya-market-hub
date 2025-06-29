
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
