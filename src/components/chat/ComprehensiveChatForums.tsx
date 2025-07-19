import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageCircle,
  Plus,
  Search,
  Heart,
  MessageSquare,
  Eye,
  Clock,
  Pin,
  User,
  Menu // Using Menu icon for mobile drawer trigger
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'; // Import Sheet for mobile sidebar

const ComprehensiveChatForums = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category_id: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch forum categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('post_count', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch forum posts (adjusted for activeTab)
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['forum-posts', searchTerm, selectedCategory, activeTab],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles!author_id(full_name, email, avatar_url),
          category:forum_categories!category_id(name),
          reactions:forum_post_reactions(id, reaction_type, user_id),
          replies:forum_post_replies(id)
        `);

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (activeTab === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (activeTab === 'trending') {
        // For 'trending', we'll sort by view_count primarily, then creation date as a tie-breaker
        query = query.order('view_count', { ascending: false }).order('created_at', { ascending: false });
      } else if (activeTab === 'top_liked') {
        // This sorting assumes 'likesCount' is directly available in the DB or computed server-side.
        // Since it's client-side computed currently, for real 'top_liked' you'd need a way to order by it in Supabase.
        // For now, it will use view_count as a proxy or rely on client-side sorting if needed.
        query = query.order('view_count', { ascending: false }); // Fallback to views if true likes count is not in DB
      }

      const { data, error } = await query;
      if (error) throw error;

      // Client-side processing to attach derived data (likesCount, hasLiked, reply_count)
      return data?.map(post => ({
        ...post,
        hasLiked: post.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === 'like') || false,
        likesCount: post.reactions?.filter((r: any) => r.reaction_type === 'like').length || 0,
        reply_count: post.replies?.length || 0
      })) || [];
    }
  });

  // Create post mutation
  const createPost = useMutation({
    mutationFn: async (postData: any) => {
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          ...postData,
          author_id: user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] }); // Invalidate categories to update post_count
      toast.success('Post created successfully');
      setNewPost({ title: '', content: '', category_id: '' });
      setIsCreatePostOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    }
  });

  // Create category mutation
  const createCategory = useMutation({
    mutationFn: async (categoryData: any) => {
      const { error } = await supabase
        .from('forum_categories')
        .insert(categoryData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] });
      toast.success('Category created successfully');
      setNewCategory({ name: '', description: '' });
      setIsCreateCategoryOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${error.message}`);
    }
  });

  // Toggle like mutation (with optimistic update)
  const toggleLike = useMutation({
    mutationFn: async ({ postId, hasLiked }: { postId: string; hasLiked: boolean }) => {
      if (!user?.id) {
        toast.error('You must be logged in to like posts.');
        throw new Error('Not authenticated');
      }

      if (hasLiked) {
        const { error } = await supabase
          .from('forum_post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('reaction_type', 'like');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('forum_post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like'
          });
        if (error) throw error;
      }
    },
    // Optimistic Update
    onMutate: async ({ postId, hasLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['forum-posts'] });
      const previousPosts = queryClient.getQueryData(['forum-posts', searchTerm, selectedCategory, activeTab]);

      queryClient.setQueryData(['forum-posts', searchTerm, selectedCategory, activeTab], (oldPosts: any) => {
        return oldPosts?.map((post: any) => {
          if (post.id === postId) {
            return {
              ...post,
              hasLiked: !hasLiked,
              likesCount: hasLiked ? post.likesCount - 1 : post.likesCount + 1,
            };
          }
          return post;
        });
      });
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      toast.error(`Failed to toggle like: ${err.message}`);
      queryClient.setQueryData(['forum-posts', searchTerm, selectedCategory, activeTab], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts', searchTerm, selectedCategory, activeTab] });
    }
  });


  // Increment view count (client-side increment, then async RPC call)
  const incrementViews = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_post_views', { post_id: postId });
      if (error) throw error;
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['forum-posts'] });
      const previousPosts = queryClient.getQueryData(['forum-posts', searchTerm, selectedCategory, activeTab]);
      queryClient.setQueryData(['forum-posts', searchTerm, selectedCategory, activeTab], (oldPosts: any) => {
        return oldPosts?.map((post: any) => {
          if (post.id === postId) {
            return {
              ...post,
              view_count: (post.view_count || 0) + 1,
            };
          }
          return post;
        });
      });
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      console.error("Failed to increment views:", err);
      queryClient.setQueryData(['forum-posts', searchTerm, selectedCategory, activeTab], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    }
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category_id) {
      toast.error('Please fill in all fields');
      return;
    }
    createPost.mutate(newPost);
  };

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    createCategory.mutate(newCategory);
  };

  const handlePostClick = (post: any) => {
    incrementViews.mutate(post.id);
    // In a real application, you'd navigate to the post detail page:
    // navigate(`/forum/posts/${post.id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50"> {/* Added a light background color */}
      {/* Left Sidebar for Categories (Desktop/Tablet) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-gray-200 bg-white p-4 sticky top-0 h-screen overflow-y-auto shadow-sm"> {/* Added subtle shadow */}
        <Card className="shadow-none border-0 bg-transparent"> {/* Ensure card blends with aside */}
          <CardHeader className="pb-3 pt-0"> {/* Adjusted padding */}
            <CardTitle className="text-xl font-bold text-gray-800">Categories</CardTitle> {/* Increased font size */}
          </CardHeader>
          <CardContent className="space-y-1.5"> {/* Adjusted tighter spacing */}
            <Button
              variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
              className={`w-full justify-start text-base font-medium ${selectedCategory === 'all' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'hover:bg-gray-100'}`} // Applied Sokko Sasa colors
              onClick={() => setSelectedCategory('all')}
            >
              All Discussions
            </Button>
            {categoriesLoading ? (
              <div className="space-y-1.5">
                {[...Array(5)].map((_, i) => (
                  // Slightly larger pulse
                  <div key={i} className="h-9 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                  className={`w-full justify-between text-base font-medium ${selectedCategory === category.id ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'hover:bg-gray-100'}`} // Applied Sokko Sasa colors
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <Badge variant="outline" className="min-w-[2.2rem] text-center text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-300">{category.post_count || 0}</Badge> {/* Refined badge */}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
        <div className="mt-6 px-4"> {/* Increased margin and padding */}
          <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-400 transition-colors">
                <Plus className="h-4 w-4 mr-2" /> New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Category</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Category name" value={newCategory.name} onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))} />
                <Textarea placeholder="Category description" value={newCategory.description} onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))} />
                <Button onClick={handleCreateCategory} disabled={createCategory.isPending} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  {createCategory.isPending ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {/* Main Content Area (Feed) */}
      <main className="flex-1 flex flex-col max-w-full md:max-w-[calc(100%-16rem)] lg:max-w-[calc(100%-18rem)]"> {/* Removed border-l here as it's not needed with aside border-r */}

        {/* --- Mobile Header & Search (visible only on small screens) --- */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 md:hidden shadow-sm"> {/* Added shadow */}
          <div className="flex items-center justify-between mb-3"> {/* Adjusted margin-bottom */}
            <div className="flex items-center">
              {/* Mobile Drawer for Categories */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6 text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 sm:w-72 p-4"> {/* Adjusted width for sheet */}
                  <SheetHeader className="mb-4">
                    <SheetTitle className="text-xl font-bold">Categories</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-1.5"> {/* Reused category list styling */}
                    <Button
                      variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
                      className={`w-full justify-start text-base font-medium ${selectedCategory === 'all' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Discussions
                    </Button>
                    {categoriesLoading ? (
                      <div className="space-y-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-9 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      categories?.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                          className={`w-full justify-between text-base font-medium ${selectedCategory === category.id ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'hover:bg-gray-100'}`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <span>{category.name}</span>
                          <Badge variant="outline" className="min-w-[2.2rem] text-center text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-300">{category.post_count || 0}</Badge>
                        </Button>
                      ))
                    )}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-400 transition-colors">
                            <Plus className="h-4 w-4 mr-2" /> New Category
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Create New Category</DialogTitle></DialogHeader>
                          <div className="space-y-4">
                            <Input placeholder="Category name" value={newCategory.name} onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))} />
                            <Textarea placeholder="Category description" value={newCategory.description} onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))} />
                            <Button onClick={handleCreateCategory} disabled={createCategory.isPending} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                              {createCategory.isPending ? 'Creating...' : 'Create Category'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-1 text-orange-600" />
                Sokko Forums
              </h1>
            </div>
            {/* Consolidated mobile action button */}
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Plus className="h-4 w-4 mr-1" /> Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Create New Post</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Post title" value={newPost.title} onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))} />
                  <Select value={newPost.category_id} onValueChange={(value) => setNewPost(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (<SelectItem value="loading" disabled>Loading categories...</SelectItem>) : (
                        <>
                          <SelectItem value="" disabled>Select a category</SelectItem>
                          {categories?.map((category) => (<SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Write your post content here..." value={newPost.content} onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))} rows={6} />
                  <Button onClick={handleCreatePost} disabled={createPost.isPending} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                    {createPost.isPending ? 'Creating...' : 'Create Post'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search discussions..."
              className="pl-10 w-full text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content Area: Tabs and Posts */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8"> {/* Consistent padding */}
          {/* Tabs for Post Filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1"> {/* Styled tab list */}
              <TabsTrigger
                value="latest"
                className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all text-base font-medium"
              >
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all text-base font-medium"
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="top_liked"
                className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all text-base font-medium"
              >
                Top Liked
              </TabsTrigger>
            </TabsList>
            {/* TabsContent are just containers, actual posts rendered below */}
            <TabsContent value="latest" className="mt-4 hidden"></TabsContent>
            <TabsContent value="trending" className="mt-4 hidden"></TabsContent>
            <TabsContent value="top_liked" className="mt-4 hidden"></TabsContent>
          </Tabs>

          {/* Posts List */}
          <div className="space-y-4"> {/* Consistent space between cards */}
            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse shadow-sm border border-gray-200">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out cursor-pointer group"> {/* Added group for hover effects */}
                  <CardContent className="p-4 sm:p-6" onClick={() => handlePostClick(post)}>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border-2 border-gray-200 group-hover:border-orange-400 transition-colors"> {/* Avatar border on hover */}
                        <AvatarImage src={post.author?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-5 w-5 sm:h-6 w-6 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        {/* Post Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 mb-1">
                              {post.is_pinned && <Pin className="h-4 w-4 text-orange-500 flex-shrink-0" />}
                              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 leading-tight group-hover:text-orange-700 transition-colors truncate">
                                {post.title}
                              </h3>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-2 text-sm text-gray-500"> {/* Increased font for meta */}
                              <span className="font-medium text-gray-600">{post.author?.full_name}</span>
                              <span className="text-gray-400">•</span>
                              <Badge variant="secondary" className="px-2.5 py-0.5 text-xs bg-orange-100 text-orange-700 border-orange-200">
                                {post.category?.name}
                              </Badge>
                              <span className="text-gray-400">•</span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content Preview */}
                        <p className="text-gray-700 text-base line-clamp-3 leading-relaxed">
                          {post.content}
                        </p>

                        {/* Stats and Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4 text-gray-500" />
                              <span>{post.view_count || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              <span>{post.reply_count || 0}</span>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike.mutate({ postId: post.id, hasLiked: post.hasLiked });
                              }}
                              className={`
                                ${post.hasLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}
                                flex items-center px-2 py-1 rounded-md transition-colors duration-200
                              `}
                              disabled={toggleLike.isPending && toggleLike.variables?.postId === post.id}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${post.hasLiked ? 'fill-current' : ''}`} />
                              <span className="text-sm">{post.likesCount}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-sm border-gray-200 bg-white">
                <CardContent className="p-8 sm:p-12 text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions found</h3>
                  <p className="text-gray-600 text-base mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
                  </p>
                  <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader><DialogTitle>Create New Post</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Post title" value={newPost.title} onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))} />
                        <Select value={newPost.category_id} onValueChange={(value) => setNewPost(prev => ({ ...prev, category_id: value }))}>
                          <SelectTrigger className="w-full"><SelectValue placeholder="Select a category" /></SelectTrigger>
                          <SelectContent>
                            {categoriesLoading ? (<SelectItem value="loading" disabled>Loading categories...</SelectItem>) : (
                              <>
                                <SelectItem value="" disabled>Select a category</SelectItem>
                                {categories?.map((category) => (<SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <Textarea placeholder="Write your post content here..." value={newPost.content} onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))} rows={6} />
                        <Button onClick={handleCreatePost} disabled={createPost.isPending} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                          {createPost.isPending ? 'Creating...' : 'Create Post'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComprehensiveChatForums;