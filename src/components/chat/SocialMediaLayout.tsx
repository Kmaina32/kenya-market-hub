import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  Bell, 
  Users, 
  TrendingUp,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import ImprovedForumsList from './ImprovedForumsList';
import ChatInterface from './ChatInterface';
import NotificationCenter from './NotificationCenter';
import FollowingFeed from './FollowingFeed';
import DirectMessages from './DirectMessages';

interface SocialMediaLayoutProps {
  activeTab?: string;
}

const SocialMediaLayout: React.FC<SocialMediaLayoutProps> = ({ activeTab = 'fyp' }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [unreadNotifications] = useState(3); // Mock notification count

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        {/* Navigation Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <TabsList className="grid w-full grid-cols-5 h-14 bg-transparent p-0">
              <TabsTrigger 
                value="fyp" 
                className="flex items-center gap-2 h-full data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">For You</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="following" 
                className="flex items-center gap-2 h-full data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Following</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="messages" 
                className="flex items-center gap-2 h-full data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="notifications" 
                className="flex items-center gap-2 h-full data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 hover:bg-red-600">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="trending" 
                className="flex items-center gap-2 h-full data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-6">
          <TabsContent value="fyp" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Home className="w-6 h-6 text-orange-600" />
                        For You Page
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                          <Plus className="w-4 h-4 mr-2" />
                          New Post
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ImprovedForumsList />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <TrendingSidebar />
                <SuggestedUsers />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-0">
            <FollowingFeed />
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <DirectMessages 
                  onSelectConversation={setSelectedConversation}
                  selectedConversation={selectedConversation}
                />
              </div>
              <div className="lg:col-span-2">
                <ChatInterface 
                  selectedConversationId={selectedConversation}
                  onBack={() => setSelectedConversation(null)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImprovedForumsList />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// Trending Sidebar Component
const TrendingSidebar: React.FC = () => {
  const trendingTopics = [
    { tag: '#SokkoSasa', posts: 1234 },
    { tag: '#TechKenya', posts: 856 },
    { tag: '#StartupLife', posts: 634 },
    { tag: '#Nairobi', posts: 523 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trending Now</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
            <div>
              <p className="font-medium text-orange-600">{topic.tag}</p>
              <p className="text-sm text-gray-500">{topic.posts.toLocaleString()} posts</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Suggested Users Component
const SuggestedUsers: React.FC = () => {
  const suggestedUsers = [
    { name: 'John Doe', username: '@johndoe', avatar: null },
    { name: 'Jane Smith', username: '@janesmith', avatar: null },
    { name: 'Tech Guru', username: '@techguru', avatar: null },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggested for You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SocialMediaLayout;