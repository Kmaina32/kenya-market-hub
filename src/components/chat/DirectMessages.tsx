
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
  Pin,
  Loader2,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useConversations } from '@/hooks/useChat';

interface DirectMessagesProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({
  onSelectConversation,
  selectedConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: conversations, isLoading, error } = useConversations();

  const filteredConversations = conversations?.filter(conv =>
    conv.participant1?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant2?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Card className="h-full flex flex-col">
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

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-grow overflow-y-auto">
        <div className="space-y-1">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="w-6 h-6 mx-auto animate-spin mb-2" />
              Loading conversations...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <X className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Error loading conversations</h3>
              <p>Failed to load conversations. Please try again.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">Reload</Button>
            </div>
          ) : filteredConversations.length === 0 ? (
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
            filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participant1 || conversation.participant2;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 group ${
                    selectedConversation === conversation.id
                      ? 'bg-orange-50 border-l-orange-500'
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={otherParticipant?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        {otherParticipant?.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {otherParticipant?.full_name || 'Unknown User'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {conversation.last_message || 'No messages yet'}
                      </p>
                      {conversation.last_message_at && (
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectMessages;
