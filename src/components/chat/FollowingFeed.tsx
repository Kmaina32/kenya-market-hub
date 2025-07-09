import React, { useState, useEffect } from 'react';
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
  Loader2 // Import for spinner
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isFollowing: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  category?: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  bio?: string;
}

const FollowingFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'people'>('feed');

  // Initialize with empty arrays and loading/error states
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  // --- Simulate fetching posts from an API ---
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setErrorPosts(null);
      try {
        // --- REPLACE THIS WITH YOUR ACTUAL API CALL FOR POSTS ---
        // Example: const response = await fetch('/api/following/posts');
        // Example: const result = await response.json();
        // Example: setFollowingPosts(result.posts.map(p => ({ ...p, timestamp: new Date(p.timestamp) })));

        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

        // --- Option 1: Simulate successful fetch with NO initial data (truly empty) ---
        setFollowingPosts([]);

        // --- Option 2: Simulate a fetch error (uncomment to test error state) ---
        // throw new Error("Network error: Could not fetch posts.");

      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        setErrorPosts(err.message || "Failed to load posts. Please try again.");
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  // --- Simulate fetching users from an API ---
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        // --- REPLACE THIS WITH YOUR ACTUAL API CALL FOR USERS ---
        // Example: const response = await fetch('/api/following/users');
        // Example: const result = await response.json();
        // Example: setFollowingUsers(result.users);

        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay

        // --- Option 1: Simulate successful fetch with NO initial data (truly empty) ---
        setFollowingUsers([]);

        // --- Option 2: Simulate a fetch error (uncomment to test error state) ---
        // throw new Error("Network error: Could not fetch users.");

      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setErrorUsers(err.message || "Failed to load users. Please try again.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount


  const toggleFollow = (userId: string) => {
    setFollowingUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? {
              ...user,
              isFollowing: !user.isFollowing,
              followers: user.isFollowing ? user.followers - 1 : user.followers + 1,
            }
          : user
      )
    );
    // In a real app, you'd send an API request here to update follow status on the backend
    console.log(`Toggled follow for user: ${userId}`);
  };

  const toggleLike = (postId: string) => {
    setFollowingPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
    // In a real app, you'd send an API request here to update like status on the backend
    console.log(`Toggled like for post: ${postId}`);
  };

  const filteredUsers = followingUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {loadingPosts ? (
            <Card>
              <CardContent className="text-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading posts...</p>
              </CardContent>
            </Card>
          ) : errorPosts ? (
            <Card>
              <CardContent className="text-center py-12 text-red-600">
                <X className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Error loading posts</h3>
                <p>{errorPosts}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
              </CardContent>
            </Card>
          ) : followingPosts.length === 0 ? (
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
            followingPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{post.author.name}</h3>
                          <span className="text-gray-500">@{post.author.username}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">
                            {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                          </span>
                          {post.category && (
                            <Badge variant="secondary" className="ml-2">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-gray-900 mb-4 leading-relaxed">{post.content}</p>

                      <div className="flex items-center gap-6 text-gray-500">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                            post.isLiked ? 'text-red-500' : ''
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>

                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>

                        <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                          <Share className="w-5 h-5" />
                          <span>{post.shares}</span>
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
          {loadingUsers ? (
            <Card>
              <CardContent className="text-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading users...</p>
              </CardContent>
            </Card>
          ) : errorUsers ? (
            <Card>
              <CardContent className="text-center py-12 text-red-600">
                <X className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Error loading users</h3>
                <p>{errorUsers}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
              </CardContent>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'You are not following anyone yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-gray-500">@{user.username}</p>
                          {user.bio && (
                            <p className="text-gray-700 mt-1">{user.bio}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{user.followers.toLocaleString()} followers</span>
                            <span>{user.following.toLocaleString()} following</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.isFollowing ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFollow(user.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Unfollow
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => toggleFollow(user.id)}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Block
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowingFeed;