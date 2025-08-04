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
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Join the Community</h3>
            <p className="text-gray-600 mb-6">Sign in to share your thoughts and connect with others</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left side - View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={selectedView === 'posts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedView('posts')}
              className={`text-sm px-2 sm:px-3 py-1.5 rounded-md ${
                selectedView === 'posts' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              <Users className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Forums</span>
            </Button>
            <Button
              variant={selectedView === 'messages' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedView('messages')}
              className={`text-sm px-2 sm:px-3 py-1.5 rounded-md ${
                selectedView === 'messages' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              <MessageSquare className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Messages</span>
            </Button>
          </div>

          {/* Right side - Search and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!showMobileChat && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={selectedView === 'posts' ? 'Search posts...' : 'Search conversations...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-32 sm:w-64 bg-gray-50 border-gray-300 focus:bg-white focus:ring-orange-500 focus:border-orange-500 rounded-lg"
                />
              </div>
            )}
            
            {selectedView === 'messages' && !showMobileChat && (
              <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-4 py-2 rounded-lg"
                  >
                    <Plus className="h-4 w-4 sm:mr-1.5" />
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
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {userSearchTerm && searchResults.filter(u => u.id !== user?.id).map((searchUser) => (
                        <div
                          key={searchUser.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
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
        </div>
      </header>

      {/* Content */}
      <div className="flex overflow-hidden">
        {/* Forums Content */}
        {selectedView === 'posts' && (
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
              <ForumsList searchTerm={searchTerm} />
            </div>
          </main>
        )}

        {/* Messages Content */}
        {selectedView === 'messages' && (
          <>
            {/* Conversations List */}
            <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} ${showMobileChat ? 'w-80 border-r border-gray-200' : 'flex-1'} bg-white flex-col`}>
              {!showMobileChat && (
                <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {conversationsLoading ? (
                      <div className="text-center py-16">
                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading conversations...</p>
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="text-center py-16 px-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">No conversations yet</h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                          Start chatting with other users to see your conversations here
                        </p>
                        <Button 
                          onClick={() => setIsNewChatOpen(true)}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Start New Chat
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredConversations.map((conversation) => {
                          const otherParticipant = conversation.participant1_id === user?.id ? 
                            conversation.participant2 : conversation.participant1;
                          
                          return (
                            <div
                              key={conversation.id} 
                              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleConversationSelect(conversation.id)}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                                  {otherParticipant?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900 truncate">
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
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Desktop Sidebar for Chat */}
              {showMobileChat && (
                <div className="hidden md:flex flex-col h-full bg-white">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Conversations</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conversation) => {
                      const otherParticipant = conversation.participant1_id === user?.id ? 
                        conversation.participant2 : conversation.participant1;
                      
                      return (
                        <div
                          key={conversation.id}
                          className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                            selectedConversationId === conversation.id 
                              ? 'bg-orange-50 border-orange-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleConversationSelect(conversation.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {otherParticipant?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
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
              <div className="flex-1 flex md:min-w-0 bg-white">
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
  );
};

export default SocialMediaChatInterface;
