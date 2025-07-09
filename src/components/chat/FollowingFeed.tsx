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
  Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isFollowing: true;
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

  const [followingPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        isFollowing: true,
      },
      content: 'Just launched my new startup! Excited to share this journey with the Sokko Sasa community. 🚀 #entrepreneurship #startup',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      category: 'Business',
    },
    {
      id: '2',
      author: {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        isFollowing: true,
      },
      content: 'Amazing tech meetup in Nairobi today! Great to connect with fellow developers and learn about the latest trends in React and TypeScript.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: 45,
      comments: 12,
      shares: 6,
      isLiked: true,
      category: 'Technology',
    },
  ]);

  const [followingUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      followers: 1234,
      following: 567,
      isFollowing: true,
      bio: 'Entrepreneur | Tech enthusiast | Building the future',
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
      followers: 2345,
      following: 789,
      isFollowing: true,
      bio: 'Full-stack developer | React specialist | Open source contributor',
    },
    {
      id: '3',
      name: 'Tech Guru',
      username: 'techguru',
      followers: 5678,
      following: 234,
      isFollowing: true,
      bio: 'Software architect | Startup advisor | Keynote speaker',
    },
  ]);

  const toggleFollow = (userId: string) => {
    // Implementation for follow/unfollow functionality
    console.log('Toggle follow for user:', userId);
  };

  const toggleLike = (postId: string) => {
    // Implementation for like/unlike functionality
    console.log('Toggle like for post:', postId);
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
          {followingPosts.length === 0 ? (
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFollow(user.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </Button>
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

          {filteredUsers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'You are not following anyone yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowingFeed;