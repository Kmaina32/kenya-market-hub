
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, Search, MessageCircle, Plus, User, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { useConversations, useCreateConversation } from '@/hooks/useChat';
import { useChatMessages, useSendMessage } from '@/hooks/useChatMessages';
import { useUserSearch } from '@/hooks/useChatForums';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  selectedConversationId: string | null;
  onBack?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedConversationId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const { user } = useAuth();
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useChatMessages(selectedConversationId || '');
  const { data: searchedUsers } = useUserSearch(userSearchTerm);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();

  // Find the selected conversation data and other participant
  const selectedConversationData = conversations?.find(c => c.id === selectedConversationId);
  const otherParticipant = selectedConversationData ?
    (selectedConversationData.participant1_id === user?.id ?
     selectedConversationData.participant2 :
     selectedConversationData.participant1) : null;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversationId,
        content: newMessage
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartNewChat = async (targetUserId: string) => {
    try {
      await createConversation.mutateAsync(targetUserId);
      setIsNewChatOpen(false);
      setUserSearchTerm('');
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-0 rounded-lg overflow-hidden">
      {selectedConversationId && selectedConversationData ? (
        <>
          {/* Chat Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden text-white hover:bg-white/20">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherParticipant?.avatar_url} />
                <AvatarFallback className="bg-white text-orange-600">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg text-white">
                  {otherParticipant?.full_name || 'Chat'}
                </CardTitle>
                <p className="text-sm text-orange-100">Online</p>
              </div>
            </div>
          </CardHeader>

          {/* Chat Messages Area */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messagesLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-500">Loading messages...</span>
              </div>
            ) : messages?.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium mb-2">No messages yet</h3>
                <p className="text-sm">Start the conversation by sending a message!</p>
              </div>
            ) : (
              messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                      message.sender_id === user?.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender_id === user?.id ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>

          {/* Message Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-gray-200 focus:ring-orange-500 focus:border-orange-500"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 shadow-md"
                disabled={sendMessage.isPending || !newMessage.trim()}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        // No conversation selected view
        <CardContent className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600 mb-4">Choose a conversation from the left to start chatting</p>
            
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Start New Chat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {searchedUsers?.filter(u => u.id !== user?.id).map((searchUser) => (
                      <div
                        key={searchUser.id}
                        onClick={() => handleStartNewChat(searchUser.id)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                      >
                        <Avatar className="h-8 w-8 border border-gray-200">
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

                    {userSearchTerm && searchedUsers?.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No users found</p>
                      </div>
                    )}

                    {!userSearchTerm && (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Type to search for users</p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
