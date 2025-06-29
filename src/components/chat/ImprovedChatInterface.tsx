
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Send, Plus, Users, MessageSquare } from 'lucide-react';
import { useConversations, useCreateConversation, ChatConversation } from '@/hooks/useChat';
import { useUserSearch, UserSearchResult } from '@/hooks/useChatForums';
import { useChatMessages, useSendMessage, ChatMessage } from '@/hooks/useChatMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOnlineStatus } from '@/hooks/useOnlineStatus';
import { formatDistanceToNow } from 'date-fns';

const ImprovedChatInterface = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: searchResults = [] } = useUserSearch(userSearchTerm);
  const { data: messages = [] } = useChatMessages(selectedConversationId);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participant1_id === user?.id ? conv.participant2 : conv.participant1;
    return otherParticipant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversationId) {
      sendMessage.mutate({
        conversationId: selectedConversationId,
        content: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  const handleStartConversation = (participant: UserSearchResult) => {
    createConversation.mutate(
      participant.id,
      {
        onSuccess: (data) => {
          setSelectedConversationId(data.id);
          setIsNewChatOpen(false);
          setUserSearchTerm('');
        }
      }
    );
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  if (!user) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <p className="text-gray-500">Please log in to access chat</p>
      </Card>
    );
  }

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Conversations Sidebar */}
      <div className={`w-1/3 border-r flex flex-col ${isMobileView && selectedConversationId ? 'hidden' : ''}`}>
        <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </h3>
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
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
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => handleStartConversation(user)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations found</div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedConversationId ? 'items-center justify-center' : ''}`}>
        {selectedConversationId ? (
          <>
            {/* Chat Header */}
            {selectedConversation && (
              <ChatHeader 
                conversation={selectedConversation}
                onBack={() => setSelectedConversationId('')}
                isMobileView={isMobileView}
                currentUserId={user?.id}
              />
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender_id === user?.id}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessage.isPending}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">Select a conversation to start messaging</p>
            <p className="text-sm">Choose from existing conversations or start a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Conversation Card Component
const ConversationCard = ({ 
  conversation, 
  isSelected, 
  onClick,
  currentUserId
}: { 
  conversation: ChatConversation; 
  isSelected: boolean; 
  onClick: () => void; 
  currentUserId?: string;
}) => {
  const otherParticipant = conversation.participant1_id === currentUserId ? 
    conversation.participant2 : conversation.participant1;
  const { isOnline } = useUserOnlineStatus(otherParticipant?.id || '');

  return (
    <div
      className={`p-4 border-b cursor-pointer transition-colors ${
        isSelected ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipant?.avatar_url} />
            <AvatarFallback>
              {otherParticipant?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium truncate">{otherParticipant?.full_name}</p>
            {conversation.last_message_at && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
              </span>
            )}
          </div>
          {conversation.last_message && (
            <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat Header Component
const ChatHeader = ({ 
  conversation, 
  onBack, 
  isMobileView,
  currentUserId
}: { 
  conversation: ChatConversation; 
  onBack: () => void; 
  isMobileView: boolean; 
  currentUserId?: string;
}) => {
  const otherParticipant = conversation.participant1_id === currentUserId ? 
    conversation.participant2 : conversation.participant1;
  const { isOnline } = useUserOnlineStatus(otherParticipant?.id || '');

  return (
    <div className="border-b p-4 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipant?.avatar_url} />
            <AvatarFallback>
              {otherParticipant?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{otherParticipant?.full_name}</h3>
          <p className="text-sm text-gray-600">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ 
  message, 
  isOwnMessage 
}: { 
  message: ChatMessage; 
  isOwnMessage: boolean; 
}) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-orange-100' : 'text-gray-500'}`}>
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default ImprovedChatInterface;
