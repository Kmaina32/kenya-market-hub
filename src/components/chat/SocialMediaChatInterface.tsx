
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, MessageSquare, Users, User, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { useConversations, useCreateConversation } from '@/hooks/useChat';
import { useUserSearch } from '@/hooks/useChatForums';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import ForumsList from './ForumsList';

const SocialMediaChatInterface = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState<'posts' | 'messages'>('posts');
  const [showMobileChat, setShowMobileChat] = useState(false);

  const { user } = useAuth();
  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: searchResults = [] } = useUserSearch(userSearchTerm);
  const createConversation = useCreateConversation();

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participant1_id === user?.id ? conv.participant2 : conv.participant1;
    return otherParticipant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
    setShowMobileChat(false);
  };

  const handleStartNewChat = async (targetUserId: string) => {
    try {
      const newConversation = await createConversation.mutateAsync(targetUserId);
      setSelectedConversationId(newConversation.id);
      setShowMobileChat(true);
      setIsNewChatOpen(false);
      setUserSearchTerm('');
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
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
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <Button
                  variant={selectedView === 'posts' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('posts')}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Forums</span>
                </Button>
                <Button
                  variant={selectedView === 'messages' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('messages')}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Messages</span>
                </Button>
              </div>

              {selectedView === 'messages' && !showMobileChat && (
                <div className="relative flex-1 max-w-xs min-w-0">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 sm:pl-10 text-xs sm:text-sm bg-gray-50 border-0 focus:bg-white h-8 sm:h-9"
                  />
                </div>
              )}
            </div>
            
            {selectedView === 'messages' && !showMobileChat && (
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">New Chat</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Start New Chat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search users..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="pl-10 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {userSearchTerm && searchResults.filter(u => u.id !== user?.id).map((searchUser) => (
                          <div
                            key={searchUser.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                            onClick={() => handleStartNewChat(searchUser.id)}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={searchUser.avatar_url} />
                              <AvatarFallback className="bg-gray-200 text-gray-700">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-gray-900">{searchUser.full_name}</p>
                              <p className="text-sm text-gray-500 truncate">{searchUser.email}</p>
                            </div>
                          </div>
                        ))}

                        {userSearchTerm && searchResults.filter(u => u.id !== user?.id).length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">No users found</p>
                            <p className="text-sm">Try searching with a different term</p>
                          </div>
                        )}

                        {!userSearchTerm && (
                          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm font-medium mb-1">Find someone to chat with</p>
                            <p className="text-xs">Type a name or email to search for users</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {showMobileChat && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="md:hidden text-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Forums Content */}
          {selectedView === 'posts' && (
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <ForumsList />
              </div>
            </main>
          )}

          {/* Messages Content */}
          {selectedView === 'messages' && (
            <>
              {/* Conversations List - Desktop Sidebar / Mobile Full Width */}
              <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} ${showMobileChat ? 'w-80 border-r' : 'flex-1'} bg-white flex-col`}>
                {!showMobileChat && (
                  <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
                    {/* Conversations List */}
                    <div className="space-y-3 sm:space-y-4">
                      {conversationsLoading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                          <p className="mt-4 text-gray-500">Loading conversations...</p>
                        </div>
                      ) : filteredConversations.length === 0 ? (
                        <Card className="shadow-sm">
                          <CardContent className="p-8 sm:p-12 text-center">
                            <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-base sm:text-lg font-semibold mb-2">No conversations yet</h3>
                            <p className="text-gray-600 text-sm sm:text-base mb-4">Start chatting with other users to see your conversations here</p>
                            <Button 
                              onClick={() => setIsNewChatOpen(true)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Start New Chat
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        filteredConversations.map((conversation) => {
                          const otherParticipant = conversation.participant1_id === user?.id ? 
                            conversation.participant2 : conversation.participant1;
                          
                          return (
                            <Card 
                              key={conversation.id} 
                              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleConversationSelect(conversation.id)}
                            >
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                    <AvatarImage src={otherParticipant?.avatar_url} />
                                    <AvatarFallback className="bg-orange-100 text-orange-600">
                                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                        {otherParticipant?.full_name || 'Unknown User'}
                                      </h4>
                                      {conversation.last_message_at && (
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                                        </span>
                                      )}
                                    </div>
                                    {conversation.last_message && (
                                      <p className="text-sm text-gray-600 truncate">
                                        {conversation.last_message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Mobile Chat List */}
                {showMobileChat && (
                  <div className="hidden md:flex flex-col h-full">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-800">Conversations</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {filteredConversations.map((conversation) => {
                        const otherParticipant = conversation.participant1_id === user?.id ? 
                          conversation.participant2 : conversation.participant1;
                        
                        return (
                          <div
                            key={conversation.id}
                            className={`p-4 border-b cursor-pointer transition-colors ${
                              selectedConversationId === conversation.id 
                                ? 'bg-orange-50 border-orange-200' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleConversationSelect(conversation.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={otherParticipant?.avatar_url} />
                                <AvatarFallback className="bg-gray-200 text-gray-700">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-gray-900 text-sm">
                                  {otherParticipant?.full_name || 'Unknown User'}
                                </p>
                                {conversation.last_message && (
                                  <p className="text-xs text-gray-600 truncate mt-1">
                                    {conversation.last_message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Interface */}
              {showMobileChat && (
                <div className="flex-1 flex md:min-w-0">
                  <ChatInterface 
                    selectedConversationId={selectedConversationId}
                    onBack={handleBackToList}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaChatInterface;
