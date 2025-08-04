
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, MessageSquare, Users, User } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { useConversations, useCreateConversation } from '@/hooks/useChat';
import { useUserSearch } from '@/hooks/useChatForums';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const SocialMediaChatInterface = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
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

  return (
    <div className="h-[calc(100vh-2rem)] flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-80 border-r flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </h2>
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Plus className="h-4 w-4" />
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

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-sm text-gray-500 mb-4">Start chatting with other users</p>
              <Button 
                onClick={() => setIsNewChatOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
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
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherParticipant?.avatar_url} />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate text-gray-900">
                          {otherParticipant?.full_name || 'Unknown User'}
                        </p>
                        {conversation.last_message_at && (
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      {conversation.last_message && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.last_message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        <ChatInterface 
          selectedConversationId={selectedConversationId}
          onBack={handleBackToList}
        />
      </div>
    </div>
  );
};

export default SocialMediaChatInterface;
