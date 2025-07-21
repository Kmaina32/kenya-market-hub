
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  MoreHorizontal
} from 'lucide-react';
import { ChatInterface } from '@/components/chat/ChatInterface';

const SocialMediaLayout = () => {
  const [activeView, setActiveView] = useState('feed');
  const [showNewPost, setShowNewPost] = useState(false);

  const trendingTopics = [
    { tag: 'NairobiTech', posts: 234 },
    { tag: 'KenyanStartups', posts: 189 },
    { tag: 'DigitalKenya', posts: 156 },
    { tag: 'TechJobs', posts: 98 },
    { tag: 'Innovation', posts: 87 }
  ];

  const recentPosts = [
    {
      id: 1,
      author: 'Sarah Mwangi',
      username: '@sarahmwangi',
      time: '2h',
      content: 'Just launched my new tech startup in Nairobi! Looking for feedback from the community. #NairobiTech #StartupLife',
      likes: 45,
      comments: 12,
      shares: 8,
      verified: true
    },
    {
      id: 2,
      author: 'David Kiprotich',
      username: '@davidkip',
      time: '4h',
      content: 'Great networking event at iHub today. The Kenyan tech scene is really growing! Who else was there? #TechCommunity',
      likes: 32,
      comments: 7,
      shares: 5,
      verified: false
    },
    {
      id: 3,
      author: 'Tech Kenya',
      username: '@techkenya',
      time: '6h',
      content: 'New opportunities in fintech emerging across East Africa. Exciting times ahead! What do you think will be the next big breakthrough?',
      likes: 78,
      comments: 23,
      shares: 15,
      verified: true
    }
  ];

  const suggestedUsers = [
    { name: 'Grace Wanjiku', username: '@gracewanjiku', followers: '2.3K', verified: true },
    { name: 'Mike Ochieng', username: '@mikeochieng', followers: '1.8K', verified: false },
    { name: 'Innovation Hub', username: '@innovationhub', followers: '5.2K', verified: true }
  ];

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
                    onClick={() => setActiveView('feed')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Feed
                  </Button>
                  <Button
                    variant={activeView === 'groups' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveView('groups')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Groups
                  </Button>
                  <Button
                    variant={activeView === 'trending' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveView('trending')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </Button>
                  <Button
                    variant={activeView === 'events' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveView('events')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Events
                  </Button>
                  <Button
                    variant={activeView === 'chat' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveView('chat')}
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
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-600">#{topic.tag}</p>
                        <p className="text-sm text-gray-500">{topic.posts} posts</p>
                      </div>
                      <Hash className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {activeView === 'chat' ? (
              <ChatInterface />
            ) : (
              <>
                {/* Create Post */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">U</span>
                      </div>
                      <div className="flex-1">
                        <Textarea
                          placeholder="What's happening in your community?"
                          className="min-h-[80px] resize-none border-0 p-0 text-lg placeholder:text-gray-500 focus:ring-0"
                          onClick={() => setShowNewPost(true)}
                        />
                        {showNewPost && (
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Badge variant="outline"># Add Topic</Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                                Cancel
                              </Button>
                              <Button className="bg-orange-600 hover:bg-orange-700">
                                Post
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {post.author.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{post.author}</h4>
                              {post.verified && (
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                              <span className="text-gray-500">{post.username}</span>
                              <span className="text-gray-500">·</span>
                              <span className="text-gray-500">{post.time}</span>
                            </div>
                            <p className="mt-2 text-gray-900">{post.content}</p>
                            <div className="mt-3 flex items-center space-x-6">
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {post.comments}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                                <Share className="h-4 w-4 mr-1" />
                                {post.shares}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
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
                  {suggestedUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="font-medium text-sm">{user.name}</p>
                            {user.verified && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">✓</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{user.followers} followers</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </Button>
                    </div>
                  ))}
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
                  <p><span className="font-medium">Sarah</span> liked your post</p>
                  <p><span className="font-medium">David</span> started following you</p>
                  <p><span className="font-medium">Mike</span> commented on your post</p>
                  <p>New members joined <span className="font-medium">Kenya Tech</span> group</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaLayout;
