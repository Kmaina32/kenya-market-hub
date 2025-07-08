
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Eye, Search, Plus, Loader2 } from 'lucide-react';
import { useForumPosts, useTogglePostLike, useIncrementPostViews } from '@/hooks/useForumPosts';
import { useForumCategories } from '@/hooks/useChatForums';
import { formatDistanceToNow } from 'date-fns';
import CreatePostModal from './CreatePostModal';
import { ForumPost } from '@/types/chat';

const ImprovedForumsList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useForumCategories();
  const { data: posts = [], isLoading: postsLoading } = useForumPosts(selectedCategory === 'all' ? undefined : selectedCategory);
  const toggleLikeMutation = useTogglePostLike();
  const incrementViewsMutation = useIncrementPostViews();

  const filteredPosts = posts.filter((post: ForumPost) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (categoriesLoading || postsLoading) {
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

        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
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
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500"
              onClick={() => handlePostClick(post.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author_profile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        {post.author_profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg hover:text-orange-600 transition-colors">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{post.author_profile?.full_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  {post.category && (
                    <Badge 
                      style={{ backgroundColor: post.category.color || '#f59e0b' }}
                      className="text-white"
                    >
                      {post.category.name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-700 mb-4 line-clamp-3">
                  {post.content}
                </CardDescription>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                      post.has_liked ? 'text-red-500' : ''
                    }`}
                    disabled={toggleLikeMutation.isPending}
                  >
                    {toggleLikeMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className={`w-4 h-4 ${post.has_liked ? 'fill-current' : ''}`} />
                    )}
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

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default ImprovedForumsList;
