
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Heart, MessageCircle, Eye, Share2, Plus } from 'lucide-react';
import { useForumPosts, useCreateForumPost, useTogglePostLike, useIncrementPostViews } from '@/hooks/useForumPosts';
import { useForumCategories } from '@/hooks/useChatForums';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ForumsListProps {
  searchTerm: string;
}

const ForumsList: React.FC<ForumsListProps> = ({ searchTerm }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    categoryId: ''
  });

  const { user } = useAuth();
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality can be implemented here
  };

  return (
    <div className="space-y-6">
      {/* Post Composer */}
      <Card className="shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <div className="w-full bg-gray-50 rounded-full px-4 py-3 text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
                    What's on your mind?
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
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
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                      >
                        {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
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

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Card className="shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to start a discussion!'}
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="shadow-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => handlePostClick(post.id)}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {post.author_profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {post.author_profile?.full_name || 'Anonymous'}
                        </span>
                        {post.category && (
                          <Badge 
                            style={{ backgroundColor: post.category.color }}
                            className="text-white text-xs px-2 py-0.5 rounded-full"
                          >
                            {post.category.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  {/* View Count */}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{post.view_count}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {post.content}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                    disabled={toggleLikeMutation.isPending}
                  >
                    <Heart className={`w-5 h-5 ${post.has_liked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm font-medium">{post.like_count}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.reply_count}</span>
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
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
