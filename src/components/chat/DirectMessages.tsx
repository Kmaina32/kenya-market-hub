import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageCircle, 
  Plus, 
  MoreHorizontal,
  Pin
} from 'lucide-react';
import { useConversations } from '@/hooks/useChat';
import { formatDistanceToNow } from 'date-fns';

interface DirectMessagesProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({
  onSelectConversation,
  selectedConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: conversations, isLoading } = useConversations();

  // Mock data for demonstration
  const mockConversations = [
    {
      id: '1',
      participant: {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        avatar: null,
        isOnline: true,
      },
      lastMessage: 'Hey! How are you doing?',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 2,
      isPinned: false,
    },
    {
      id: '2',
      participant: {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: null,
        isOnline: false,
      },
      lastMessage: 'Thanks for the help with the project!',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      isPinned: true,
    },
    {
      id: '3',
      participant: {
        id: '3',
        name: 'Tech Team',
        username: 'techteam',
        avatar: null,
        isOnline: true,
      },
      lastMessage: 'Meeting scheduled for tomorrow at 10 AM',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      unreadCount: 5,
      isPinned: false,
    },
  ];

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by pinned first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            Messages
          </CardTitle>
          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-1">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading conversations...
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No conversations</h3>
              <p className="text-gray-600 text-sm mb-4">
                {searchTerm ? 'No conversations match your search' : 'Start a new conversation'}
              </p>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>
          ) : (
            sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                  selectedConversation === conversation.id
                    ? 'bg-orange-50 border-l-orange-500'
                    : 'border-l-transparent'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.participant.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                      {conversation.participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participant.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{conversation.participant.name}</h3>
                      {conversation.isPinned && (
                        <Pin className="w-3 h-3 text-orange-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-xs h-5 min-w-5 px-1">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conversation.lastMessage}
                    </p>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectMessages;