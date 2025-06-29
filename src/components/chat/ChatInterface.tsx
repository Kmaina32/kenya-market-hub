
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, Search, MessageCircle, Plus, User, Users } from 'lucide-react';
import { useConversations, useCreateConversation } from '@/hooks/useChat';
import { useChatMessages, useSendMessage } from '@/hooks/useChatMessages';
import { useUserSearch } from '@/hooks/useChatForums';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const ChatInterface = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  
  const { user } = useAuth();
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useChatMessages(selectedConversation || '');
  const { data: searchedUsers } = useUserSearch(userSearchTerm);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();

  const filteredConversations = conversations?.filter(conv =>
    conv.participant1?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant2?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage.mutate({
        conversationId: selectedConversation,
        content: newMessage
      }, {
        onSuccess: () => {
          setNewMessage('');
        }
      });
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
      const result = await createConversation.mutateAsync(targetUserId);
      setSelectedConversation(result.id);
      setIsNewChatOpen(false);
      setUserSearchTerm('');
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const selectedConversationData = conversations?.find(c => c.id === selectedConversation);
  const otherParticipant = selectedConversationData ? 
    (selectedConversationData.participant1_id === user?.id ? 
     selectedConversationData.participant2 : 
     selectedConversationData.participant1) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px] max-w-7xl mx-auto">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-orange-600" />
                Messages
              </CardTitle>
              <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Start New Chat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {searchedUsers?.filter(u => u.id !== user?.id).map((searchUser) => (
                        <div
                          key={searchUser.id}
                          onClick={() => handleStartNewChat(searchUser.id)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={searchUser.avatar_url} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{searchUser.full_name}</p>
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
            
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {conversationsLoading ? (
                <div className="p-4 text-center text-gray-500">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start chatting with community members!</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participant1_id === user?.id ? 
                    conversation.participant2 : conversation.participant1;
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-orange-50 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-orange-50 border-orange-200' : ''
                      }`}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={otherParticipant?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {otherParticipant?.full_name || 'Unknown User'}
                          </h4>
                        </div>
                        
                        <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                          {conversation.last_message || 'No messages yet'}
                        </p>
                        
                        {conversation.last_message_at && (
                          <p className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Messages */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
          {selectedConversation && selectedConversationData ? (
            <>
              <CardHeader className="border-b pb-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
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
              
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
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
                </div>
              </CardContent>
              
              <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 shadow-md"
                    disabled={sendMessage.isPending || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600 mb-4">Choose a conversation from the left to start chatting</p>
                <Button 
                  onClick={() => setIsNewChatOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
