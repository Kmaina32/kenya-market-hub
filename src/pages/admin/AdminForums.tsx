
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Users, Eye, ThumbsUp, Plus, Edit, Trash2, Pin, Lock } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

const AdminForums = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#3b82f6' });

  // Fetch forum categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch forum posts with author information
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          forum_categories(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get author information separately
      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', post.author_id)
            .single();
          
          return {
            ...post,
            author_name: profile?.full_name || 'Unknown'
          };
        })
      );
      
      return postsWithAuthors;
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: typeof newCategory) => {
      const { data, error } = await supabase
        .from('forum_categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] });
      toast({ title: "Category created successfully" });
      setIsCreateDialogOpen(false);
      setNewCategory({ name: '', description: '', color: '#3b82f6' });
    },
    onError: (error) => {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Pin/Unpin post mutation
  const togglePinMutation = useMutation({
    mutationFn: async ({ postId, isPinned }: { postId: string; isPinned: boolean }) => {
      const { error } = await supabase
        .from('forum_posts')
        .update({ is_pinned: !isPinned })
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast({ title: "Post updated successfully" });
    },
  });

  // Lock/Unlock post mutation
  const toggleLockMutation = useMutation({
    mutationFn: async ({ postId, isLocked }: { postId: string; isLocked: boolean }) => {
      const { error } = await supabase
        .from('forum_posts')
        .update({ is_locked: !isLocked })
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast({ title: "Post updated successfully" });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    createCategoryMutation.mutate(newCategory);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Forum Management</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Enter category description"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryColor">Color</Label>
                  <Input
                    id="categoryColor"
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handleCreateCategory}
                  disabled={createCategoryMutation.isPending}
                  className="w-full"
                >
                  Create Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesLoading ? (
            <div className="col-span-full text-center">Loading categories...</div>
          ) : (
            categories?.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </CardTitle>
                    <Badge variant="secondary">
                      {category.post_count || 0} posts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{category.post_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{category.member_count || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : (
              <div className="space-y-4">
                {posts?.slice(0, 10).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{post.title}</h3>
                        {post.is_pinned && <Pin className="h-4 w-4 text-orange-500" />}
                        {post.is_locked && <Lock className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>By: {post.author_name}</span>
                        <span>Category: {post.forum_categories?.name || 'Uncategorized'}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{post.like_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{post.reply_count || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePinMutation.mutate({ postId: post.id, isPinned: post.is_pinned })}
                      >
                        {post.is_pinned ? 'Unpin' : 'Pin'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleLockMutation.mutate({ postId: post.id, isLocked: post.is_locked })}
                      >
                        {post.is_locked ? 'Unlock' : 'Lock'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminForums;
