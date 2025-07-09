import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  MessageCircle,
  Bell,
  Users,
  TrendingUp,
  Plus,
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
  // Note: unreadNotifications here is a mock. In a real app, this would come from a global state
  // or context, likely updated by the NotificationCenter itself or an API poll.
  const [unreadNotifications] = useState(3);

  const isMessagesTab = currentTab === 'messages';
  // Define padding for content when a bottom nav is present
  const bottomNavHeightPx = 64; // h-16 in Tailwind is 4rem = 64px
  const bottomNavPaddingClass = `pb-[${bottomNavHeightPx / 16}rem]`; // Convert px to rem for Tailwind JIT

  // Define width classes for the fixed bottom navigation bar's container
  // Full width on small screens by default (w-full)
  // On large screens, if it's the messages tab, constrain to 2/3 and center.
  // Otherwise (for other tabs on large screens), it remains w-full within its context.
  const navBarWidthClasses = isMessagesTab
    ? 'w-full lg:max-w-[calc(66.666667%_-_1.5rem)] lg:mx-auto'
    : 'w-full'; // Default to full width for consistency if it's always visible


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* The main Tabs component. It's now a flex column to push content up and nav down */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full flex-grow flex flex-col">

        {/* Main Content Area - This will take up most of the space and be scrollable */}
        {/* Conditional padding is applied to ensure content doesn't hide behind the fixed bottom nav */}
        <div className={`flex-grow overflow-y-auto ${bottomNavPaddingClass}`}>
          <div className="container mx-auto px-4 py-6">

            {/* TabsContent for FYP */}
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

            {/* TabsContent for Following */}
            <TabsContent value="following" className="mt-0">
              <FollowingFeed />
            </TabsContent>

            {/* TabsContent for Messages */}
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

            {/* TabsContent for Notifications */}
            <TabsContent value="notifications" className="mt-0">
              <NotificationCenter />
            </TabsContent>

            {/* TabsContent for Trending */}
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
          </div> {/* End of container for content */}
        </div> {/* End of flex-grow overflow-y-auto */}


        {/* Navigation Tabs - Fixed at the bottom and always rendered */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-lg ${navBarWidthClasses}`}
        >
          <div className="container mx-auto px-4">
            <TabsList className="grid w-full grid-cols-5 h-16 bg-transparent p-0"> {/* Increased height slightly for better tap target */}

              <TabsTrigger
                value="fyp"
                className="flex flex-col items-center justify-center gap-1 h-full
                           data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600
                           data-[state=active]:border-t-2 data-[state=active]:border-orange-600 data-[state=active]:border-b-0
                           text-gray-600 hover:text-orange-500 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium">For You</span>
              </TabsTrigger>

              <TabsTrigger
                value="following"
                className="flex flex-col items-center justify-center gap-1 h-full
                           data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600
                           data-[state=active]:border-t-2 data-[state=active]:border-orange-600 data-[state=active]:border-b-0
                           text-gray-600 hover:text-orange-500 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="text-xs font-medium">Following</span>
              </TabsTrigger>

              <TabsTrigger
                value="messages"
                className="flex flex-col items-center justify-center gap-1 h-full
                           data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600
                           data-[state=active]:border-t-2 data-[state=active]:border-orange-600 data-[state=active]:border-b-0
                           relative text-gray-600 hover:text-orange-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-medium">Messages</span>
                {unreadNotifications > 0 && (
                  <Badge className="absolute top-1 right-3 w-4 h-4 p-0 text-xs bg-red-500 hover:bg-red-600 flex items-center justify-center">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="flex flex-col items-center justify-center gap-1 h-full
                           data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600
                           data-[state=active]:border-t-2 data-[state=active]:border-orange-600 data-[state=active]:border-b-0
                           relative text-gray-600 hover:text-orange-500 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="text-xs font-medium">Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge className="absolute top-1 right-3 w-4 h-4 p-0 text-xs bg-red-500 hover:bg-red-600 flex items-center justify-center">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="trending"
                className="flex flex-col items-center justify-center gap-1 h-full
                           data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600
                           data-[state=active]:border-t-2 data-[state=active]:border-orange-600 data-[state=active]:border-b-0
                           text-gray-600 hover:text-orange-500 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-medium">Trending</span>
              </TabsTrigger>
            </TabsList>
          </div> {/* End of container for nav */}
        </div> {/* End of fixed div for nav */}

      </Tabs> {/* End of Tabs component */}
    </div> // End of main div
  );
};

// Trending Sidebar Component (remains unchanged)
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

// Suggested Users Component (remains unchanged)
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