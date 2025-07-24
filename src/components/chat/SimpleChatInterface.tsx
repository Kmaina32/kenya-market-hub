
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useForumPosts, useCreateForumPost } from '@/hooks/useForumPosts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  MessageCircle,
  Send,
  Search,
  Plus,
  Hash,
  Heart,
  MessageSquare,
  Eye,
  User,
  Menu,
  X
} from 'lucide-react';

const SimpleChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: posts, isLoading: postsLoading } = useForumPosts();
  const createPostMutation = useCreateForumPost();

  // Fetch categories
  const { data: categories } = useQuery({
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

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !selectedCategory) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    createPostMutation.mutate({
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      categoryId: selectedCategory,
    }, {
      onSuccess: () => {
        setNewPostTitle('');
        setNewPostContent('');
        setSelectedCategory('');
        setShowNewPost(false);
      }
    });
  };

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPostData = posts?.find(post => post.id === selectedPost);

  if (!user) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
            <p className="text-gray-600 mb-4">Please log in to access forums</p>
            <Button className="bg-orange-500 hover:bg-orange-600">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Panel - Posts List */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 md:z-0 w-80 md:w-1/3 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Community</h1>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => setShowNewPost(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-y-auto">
          {postsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            filteredPosts?.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPost === post.id ? 'bg-orange-50 border-orange-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={post.author_profile?.avatar_url} />
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      {post.author_profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {post.author_profile?.full_name || 'Anonymous'}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {post.category?.name}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.like_count}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {post.reply_count}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.view_count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Selected Post */}
      <div className="flex-1 flex flex-col">
        {selectedPostData ? (
          <>
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-gray-200 bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4 mr-2" />
                Back to Posts
              </Button>
            </div>

            {/* Post Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedPostData.author_profile?.avatar_url} />
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    {selectedPostData.author_profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {selectedPostData.author_profile?.full_name || 'Anonymous'}
                    </span>
                    <Badge variant="secondary">
                      {selectedPostData.category?.name}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedPostData.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedPostData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {selectedPostData.content}
                </p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                  <Heart className="h-4 w-4 mr-2" />
                  Like ({selectedPostData.like_count})
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply ({selectedPostData.reply_count})
                </Button>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {selectedPostData.view_count} views
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden mb-4"
              >
                <Menu className="h-4 w-4 mr-2" />
                View Posts
              </Button>
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a discussion
              </h3>
              <p className="text-gray-600">
                Choose a post from the sidebar to view the conversation
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <textarea
                placeholder="Write your post content here..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {createPostMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleChatInterface;
