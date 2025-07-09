
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Search,
  UserMinus,
  UserPlus,
  Shield,
  Loader2,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useForumPosts } from '@/hooks/useForumPosts';

const FollowingFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'people'>('feed');
  const { data: posts, isLoading, error } = useForumPosts();

  // TODO: Replace with actual following users data from Supabase
  const followingUsers: any[] = [];

  const filteredUsers = followingUsers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log('Toggle like for post:', postId);
  };

  const toggleFollow = (userId: string) => {
    // TODO: Implement follow functionality
    console.log('Toggle follow for user:', userId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-600" />
              Following
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'feed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('feed')}
                className={activeTab === 'feed' ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' : ''}
              >
                Feed
              </Button>
              <Button
                variant={activeTab === 'people' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('people')}
                className={activeTab === 'people' ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' : ''}
              >
                People
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content */}
      {activeTab === 'feed' ? (
        <div className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading posts...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-12 text-red-600">
                <X className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Error loading posts</h3>
                <p>Failed to load posts. Please try again.</p>
                <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
              </CardContent>
            </Card>
          ) : !posts || posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts from following</h3>
                <p className="text-gray-600 mb-4">
                  Follow more people to see their posts in your feed
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  Discover People
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        {post.author_id?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Unknown User</h3>
                          <span className="text-gray-500">@user</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
                      <p className="text-gray-900 mb-4 leading-relaxed">{post.content}</p>

                      <div className="flex items-center gap-6 text-gray-500">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span>{post.like_count || 0}</span>
                        </button>

                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.reply_count || 0}</span>
                        </button>

                        <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                          <Share className="w-5 h-5" />
                          <span>0</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search people you follow..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Following List */}
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No following yet</h3>
              <p className="text-gray-600">
                Start following people to see them here
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FollowingFeed;
