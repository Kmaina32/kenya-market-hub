
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useForumPosts = () => {
  return useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      console.log('Fetching forum posts...');
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles!forum_posts_author_id_fkey(full_name, avatar_url),
          forum_categories!forum_posts_category_id_fkey(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching forum posts:', error);
        throw error;
      }
      return data || [];
    },
    retry: 1,
    staleTime: 30000
  });
};

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
    }
  });
};

export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: {
      title: string;
      content: string;
      category_id: string;
      author_id: string;
    }) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([postData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  });
};
