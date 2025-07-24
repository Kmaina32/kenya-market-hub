
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useForumPosts, useCreateForumPost, useTogglePostLike, useDeleteForumPost } from '@/hooks/useForumPosts';
import { useForumComments, useCreateForumComment } from '@/hooks/useForumComments';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PostActions from './PostActions';
import PostComments from './PostComments';
import ImageUpload from './ImageUpload';
import DirectMessages from './DirectMessages';
import {
  Eye,
  Search,
  Filter,
  Plus,
  X,
  Send,
  MessageSquare,
  Users
} from 'lucide-react';

const SocialMediaChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComposer, setShowComposer] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState<'posts' | 'messages'>('posts');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<string>('');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: posts, isLoading: postsLoading } = useForumPosts();
  const createPostMutation = useCreateForumPost();
  const toggleLikeMutation = useTogglePostLike();
  const deletePostMutation = useDeleteForumPost();
  const createCommentMutation = useCreateForumComment();

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
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please add both a title and content to your post.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: 'Select a category',
        description: 'Please choose a category for your post.',
        variant: 'destructive',
      });
      return;
    }

    createPostMutation.mutate({
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      categoryId: selectedCategory,
      imageUrl: postImage
    }, {
      onSuccess: () => {
        setNewPostTitle('');
        setNewPostContent('');
        setSelectedCategory('');
        setPostImage('');
        setShowComposer(false);
        toast({
          title: 'Post created!',
          description: 'Your post has been shared with the community.',
        });
      }
    });
  };

  const handleLike = (postId: string) => {
    toggleLikeMutation.mutate(postId);
  };

  const handleComment = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string, content: string) => {
    createCommentMutation.mutate({ postId, content });
  };

  const handleShare = (post: any) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Post link has been copied to your clipboard.',
      });
    }
  };

  const handleBookmark = (postId: string) => {
    toast({
      title: 'Bookmarked!',
      description: 'Post has been saved to your bookmarks.',
    });
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
            <p className="text-gray-600 mb-6">Sign in to share your thoughts and connect with others</p>
            <Button className="bg-orange-500 hover:bg-orange-600">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Direct Messages */}
      {selectedView === 'messages' && (
        <div className="w-80 border-r bg-white">
          <DirectMessages 
            onSelectConversation={setSelectedConversation}
            selectedConversation={selectedConversation}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedView === 'posts' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('posts')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Posts
                </Button>
                <Button
                  variant={selectedView === 'messages' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </div>
              
              {selectedView === 'posts' && (
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm bg-gray-50 border-0 focus:bg-white"
                  />
                </div>
              )}
            </div>
            
            {selectedView === 'posts' && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-600"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setShowComposer(true)}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            )}
          </div>

          {/* Filters */}
          {showFilters && selectedView === 'posts' && (
            <div className="max-w-2xl mx-auto px-4 py-3 border-t border-gray-100">
              <div className="flex items-center space-x-2 overflow-x-auto">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('')}
                >
                  All
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Posts Content */}
        {selectedView === 'posts' && (
          <main className="max-w-2xl mx-auto px-4 py-6">
            {/* Compose Post */}
            {showComposer && (
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="What's the title of your post?"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="text-lg font-medium border-0 px-0 focus:ring-0"
                      />
                      <Textarea
                        ref={textareaRef}
                        placeholder="Share your thoughts with the community..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[100px] resize-none border-0 px-0 focus:ring-0"
                      />
                      
                      <ImageUpload
                        onImageUpload={setPostImage}
                        onRemoveImage={() => setPostImage('')}
                        imageUrl={postImage}
                      />
                      
                      <div className="flex items-center justify-between">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select category</option>
                          {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowComposer(false)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCreatePost}
                            disabled={createPostMutation.isPending}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            {createPostMutation.isPending ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Composer */}
            {!showComposer && (
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="flex-1 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-3 cursor-pointer transition-colors"
                      onClick={() => setShowComposer(true)}
                    >
                      <span className="text-gray-500">What's on your mind?</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Feed */}
            {postsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading posts...</p>
              </div>
            ) : filteredPosts?.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-gray-600">Be the first to share something with the community!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPosts?.map((post) => (
                  <Card key={post.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      {/* Post Header */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarImage src={post.author_profile?.avatar_url} />
                              <AvatarFallback className="bg-orange-100 text-orange-600">
                                {post.author_profile?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900">
                                  {post.author_profile?.full_name || 'Anonymous'}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {post.category?.name}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {formatTimeAgo(post.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{post.view_count}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="px-4 pb-4">
                        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                        {post.image_url && (
                          <div className="mt-3">
                            <img
                              src={post.image_url}
                              alt="Post image"
                              className="w-full max-h-96 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <PostActions
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                        onDelete={handleDeletePost}
                        isLiking={toggleLikeMutation.isPending}
                      />

                      {/* Comments Section */}
                      {showComments[post.id] && (
                        <PostComments
                          postId={post.id}
                          comments={[]}
                          onAddComment={handleAddComment}
                          isAddingComment={createCommentMutation.isPending}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        )}

        {/* Messages Content */}
        {selectedView === 'messages' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaChatInterface;
