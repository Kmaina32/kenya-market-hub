import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Heart, MessageCircle, Eye, Search } from 'lucide-react';
import { useForumPosts, useCreateForumPost, useTogglePostLike, useIncrementPostViews } from '@/hooks/useForumPosts';
import { useForumCategories } from '@/hooks/useChatForums';
import { formatDistanceToNow } from 'date-fns';

const ForumsList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    categoryId: ''
  });

  const { data: categories = [] } = useForumCategories();
  const { data: posts = [], isLoading } = useForumPosts(selectedCategory === 'all' ? undefined : selectedCategory);
  const createPostMutation = useCreateForumPost();
  const toggleLikeMutation = useTogglePostLike();
  const incrementViewsMutation = useIncrementPostViews();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.categoryId) return;

    try {
      await createPostMutation.mutateAsync({
        title: newPost.title,
        content: newPost.content,
        categoryId: newPost.categoryId
      });
      
      setNewPost({ title: '', content: '', categoryId: '' });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handlePostClick = (postId: string) => {
    incrementViewsMutation.mutate(postId);
  };

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleLikeMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>Create Post</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newPost.categoryId} onValueChange={(value) => setNewPost(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPostMutation.isPending}
                  className="flex-1"
                >
                  {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts list */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to start a discussion!'}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author_profile?.avatar_url} />
                      <AvatarFallback>
                        {post.author_profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{post.author_profile?.full_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  {post.category && (
                    <Badge 
                      style={{ backgroundColor: post.category.color }}
                      className="text-white"
                    >
                      {post.category.name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-700 mb-4">
                  {post.content}
                </CardDescription>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    disabled={toggleLikeMutation.isPending}
                  >
                    <Heart className={`w-4 h-4 ${post.has_liked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.like_count}</span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.reply_count}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.view_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumsList;
