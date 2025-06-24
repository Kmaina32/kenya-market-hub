
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Globe, Plus } from 'lucide-react';
import ImprovedForumsList from '@/components/chat/ImprovedForumsList';
import ChatInterface from '@/components/chat/ChatInterface';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const ChatForums: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const { isOnline } = useOnlineStatus();

  // Mock business directory for smaller screens
  const businessDirectory = [
    { id: 1, name: "Nairobi Electronics", category: "Electronics", rating: 4.5, verified: true },
    { id: 2, name: "Mombasa Foods", category: "Food & Beverage", rating: 4.8, verified: true },
    { id: 3, name: "Kisumu Auto Parts", category: "Automotive", rating: 4.2, verified: false },
    { id: 4, name: "Nakuru Fashion", category: "Clothing", rating: 4.6, verified: true },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Community Hub
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Connect with other users, share ideas, and build relationships in our vibrant community.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs sm:text-sm text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Community Features */}
          <Tabs defaultValue="forums" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="forums" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Forums</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Direct Chat</span>
              </TabsTrigger>
              <TabsTrigger value="directory" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Directory</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forums" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    Community Forums
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <ImprovedForumsList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    Direct Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatInterface />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="directory" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    Business Directory
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid gap-3 sm:gap-4">
                    {businessDirectory.map((business) => (
                      <div key={business.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                              {business.name}
                            </h3>
                            {business.verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">{business.category}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-xs sm:text-sm text-gray-600">{business.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={() => setSelectedConversationId(`business-${business.id}`)}
                          >
                            Chat
                          </button>
                          <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatForums;
