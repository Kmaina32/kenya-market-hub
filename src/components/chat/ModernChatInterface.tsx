
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useForumPosts, useCreateForumPost, useTrendingTopics } from '@/hooks/useForumPosts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  MessageCircle,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Plus,
  Hash,
  Send,
  Heart,
  MessageSquare,
  Eye,
  Clock,
  User,
  Settings,
  Bell,
  Filter,
  MoreHorizontal,
  Edit3,
  Bookmark,
  Share2
} from 'lucide-react';

const ModernChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: posts, isLoading: postsLoading } = useForumPosts();
  const { data: trendingTopics = [] } = useTrendingTopics();
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join the Conversation</h3>
            <p className="text-gray-600 mb-4">Please log in to access community forums</p>
            <Button className="bg-orange-500 hover:bg-orange-600">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-8 w-8 text-orange-500" />
                <h1 className="text-xl font-bold text-gray-900">Community Forums</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowNewPost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant={activeTab === 'recent' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('recent')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Posts
                  </Button>
                  <Button 
                    variant={activeTab === 'trending' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('trending')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </Button>
                  <Button 
                    variant={activeTab === 'categories' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('categories')}
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Categories
                  </Button>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingTopics.length === 0 ? (
                      <p className="text-sm text-gray-500">No trending topics yet</p>
                    ) : (
                      trendingTopics.slice(0, 5).map((topic, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium">#{topic.tag}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">{topic.posts}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories?.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm font-medium">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.post_count || 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {/* Tab Navigation */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button
                        variant={activeTab === 'recent' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('recent')}
                      >
                        Recent
                      </Button>
                      <Button
                        variant={activeTab === 'popular' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('popular')}
                      >
                        Popular
                      </Button>
                      <Button
                        variant={activeTab === 'unanswered' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('unanswered')}
                      >
                        Unanswered
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              {postsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                            </div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts?.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.author_profile?.avatar_url} />
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                              {post.author_profile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900">
                                {post.author_profile?.full_name || 'Anonymous'}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {post.category?.name}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-600 cursor-pointer">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.content}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-6">
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                                  <Heart className="h-4 w-4 mr-1" />
                                  {post.like_count}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  {post.reply_count}
                                </Button>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {post.view_count}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5" />
              <span>Create New Post</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Enter post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Write your post content here... Use #hashtags to join trending topics!"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={6}
              />
            </div>
            
            <Separator />
            
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

export default ModernChatInterface;
