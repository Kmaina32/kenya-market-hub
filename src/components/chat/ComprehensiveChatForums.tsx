import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Plus,
  Hash,
  UserPlus,
  MessageSquare,
  Heart,
  Share,
  MoreHorizontal,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Pin,
  Lock,
  Filter,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForumPosts, useCreateForumPost, useTrendingTopics } from '@/hooks/useForumPosts';

// Define interfaces
interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category_id: string;
  author_id: string;
  like_count: number;
  reply_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  author_profile: {
    full_name: string;
    avatar_url: string | null;
  };
  category: {
    name: string;
    color: string;
  };
  has_liked: boolean;
}

const ComprehensiveChatForums = () => {
  const [activeView, setActiveView] = useState('feed');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as ForumCategory[];
    },
  });

  // Create post mutation
  const createPostMutation = useCreateForumPost();

  const { data: posts, isLoading: postsLoading } = useForumPosts(selectedCategory);

  // Fetch suggested users from profiles (actual usernames)
  const { data: suggestedUsers } = useQuery({
    queryKey: ['suggested-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch recent activity from notifications
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('title, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch trending topics dynamically
  const { data: trendingTopics = [] } = useTrendingTopics();

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: 'Error',
        description: 'Title and content are required.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'Please select a category for your post.',
        variant: 'destructive',
      });
      return;
    }

    createPostMutation.mutate({
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      categoryId: selectedCategory,
    });
  };

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigation = (view: string) => {
    setActiveView(view);
    
    // Handle navigation to different pages for specific views
    switch (view) {
      case 'chat':
        navigate('/chat');
        break;
      case 'events':
        navigate('/events');
        break;
      case 'groups':
        // You can navigate to groups page when available
        toast({
          title: 'Coming Soon',
          description: 'Groups feature is coming soon!',
        });
        break;
      default:
        setActiveView(view);
    }
  };

  const handleCreatePostSuccess = () => {
    setNewPostTitle('');
    setNewPostContent('');
    setSelectedCategory('');
    setShowNewPost(false);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'trending':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Trending Topics</h2>
            {trendingTopics.length === 0 ? (
              <p className="text-gray-600">No trending topics yet. Be the first to use hashtags!</p>
            ) : (
              trendingTopics.map((topic, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-orange-600">#{topic.tag}</h3>
                        <p className="text-sm text-gray-500">{topic.posts} posts</p>
                      </div>
                      <Hash className="h-6 w-6 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );
      case 'events':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upcoming Events</h2>
            <p className="text-gray-600">Events feature coming soon...</p>
          </div>
        );
      case 'groups':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Discussion Groups</h2>
            <p className="text-gray-600">Groups feature coming soon...</p>
          </div>
        );
      default:
        return (
          <>
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
                    <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's happening in your community? Use #hashtags to join trending topics!"
                      className="min-h-[80px] resize-none border-0 p-0 text-lg placeholder:text-gray-500 focus:ring-0"
                      onClick={() => setShowNewPost(true)}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    {showNewPost && (
                      <div className="mt-3 space-y-2">
                        <Input
                          placeholder="Post Title"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                        <Select onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoriesLoading ? (
                              <SelectItem value="">Loading categories...</SelectItem>
                            ) : (
                              categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Badge variant="outline"># Add hashtags in your content</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setShowNewPost(false)}>
                              Cancel
                            </Button>
                            <Button
                              className="bg-orange-600 hover:bg-orange-700"
                              onClick={handleCreatePost}
                              disabled={createPostMutation.isPending}
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {postsLoading ? (
                <div className="text-center py-8">Loading posts...</div>
              ) : filteredPosts?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No posts found</div>
              ) : (
                filteredPosts?.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author_profile.avatar_url || "https://github.com/shadcn.png"} alt={post.author_profile.full_name} />
                          <AvatarFallback>{post.author_profile.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{post.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {post.category.name}
                            </Badge>
                            <span className="text-gray-500">
                              {post.author_profile.full_name}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-900">{post.content}</p>
                          <div className="mt-3 flex items-center space-x-6">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                              <Heart className="h-4 w-4 mr-1" />
                              {post.like_count}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.reply_count}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                              <Share className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Navigation */}
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeView === 'feed' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleNavigation('feed')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Feed
                  </Button>
                  <Button
                    variant={activeView === 'groups' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleNavigation('groups')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Groups
                  </Button>
                  <Button
                    variant={activeView === 'trending' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleNavigation('trending')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </Button>
                  <Button
                    variant={activeView === 'events' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleNavigation('events')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Events
                  </Button>
                  <Button
                    variant={activeView === 'chat' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleNavigation('chat')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Direct Messages
                  </Button>
                </nav>
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
                    trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-orange-600">#{topic.tag}</p>
                          <p className="text-sm text-gray-500">{topic.posts} posts</p>
                        </div>
                        <Hash className="h-4 w-4 text-gray-400" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {renderMainContent()}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search posts, people, topics..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedUsers?.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="font-medium text-sm">{user.full_name || user.email}</p>
                          </div>
                          <p className="text-xs text-gray-500">@{user.full_name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </Button>
                    </div>
                  ))}
                  {(!suggestedUsers || suggestedUsers.length === 0) && (
                    <p className="text-sm text-gray-500">No suggestions available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {recentActivity?.map((activity, index) => (
                    <div key={index}>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-gray-600">{activity.message}</p>
                      <p className="text-xs text-gray-400">{new Date(activity.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {(!recentActivity || recentActivity.length === 0) && (
                    <p className="text-gray-500">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveChatForums;
