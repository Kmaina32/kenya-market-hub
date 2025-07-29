
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DirectMessagesProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({
  onSelectConversation,
  selectedConversation
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: conversations } = useQuery({
    queryKey: ['chat-conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get participant profiles
      const participantIds = data?.flatMap(conv => [conv.participant1_id, conv.participant2_id]) || [];
      const uniqueParticipantIds = [...new Set(participantIds)];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', uniqueParticipantIds);

      return data?.map(conv => {
        const otherParticipantId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
        const otherParticipant = profiles?.find(p => p.id === otherParticipantId);
        
        return {
          ...conv,
          other_participant: otherParticipant || { full_name: 'Unknown User', avatar_url: null }
        };
      }) || [];
    },
    enabled: !!user
  });

  const filteredConversations = conversations?.filter(conv =>
    conv.other_participant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-center">No conversations yet</p>
            <p className="text-sm text-center mt-2">Start a new conversation to connect with others</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations?.map((conversation) => (
              <Card 
                key={conversation.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.other_participant?.avatar_url} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {conversation.other_participant?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.other_participant?.full_name || 'Unknown User'}
                        </h3>
                        {conversation.last_message_at && (
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.last_message_at).toLocaleDateString()}
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessages;
