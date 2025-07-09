import React, { useState, useEffect } from 'react';
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
  Loader2, // Import for spinner
  X // Import for error icon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Interface for a single conversation
interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageAt: Date; // Keep as Date for direct usage with date-fns
  unreadCount: number;
  isPinned: boolean;
}

// --- Modified useConversations hook to fetch from a real (placeholder) API ---
// You will need to replace this with your actual API endpoint and fetching logic (e.g., using fetch or axios)
const useConversations = () => {
  const [data, setData] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- REPLACE THIS WITH YOUR ACTUAL API CALL ---
        // Example: const response = await fetch('/api/conversations');
        // Example: const result = await response.json();
        // Example: setData(result.conversations.map(c => ({ ...c, lastMessageAt: new Date(c.lastMessageAt) })));

        // FOR DEMONSTRATION: Simulating an API call that returns empty data or an error
        // In a real app, this would fetch from your backend.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency

        // --- Option 1: Simulate successful fetch with NO initial data (truly empty) ---
        setData([]);

        // --- Option 2: Simulate a fetch error (uncomment to test error state) ---
        // throw new Error("Network error: Could not connect to conversations API.");

      } catch (err: any) {
        console.error("Error fetching conversations:", err);
        setError(err.message || "Failed to load conversations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, []); // Empty dependency array means this runs once on component mount

  // Return data, loading, error, and a setter function for local updates (e.g., pin/unpin)
  // In a real app, `setConversations` would ideally trigger an API update too.
  return { data, isLoading, error, setData };
};

// End of `useConversations` hook

interface DirectMessagesProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({
  onSelectConversation,
  selectedConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Use the actual data, loading, and error states from the hook
  const { data: conversations, isLoading, error, setData: setConversations } = useConversations();

  const togglePin = (conversationId: string) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
    // In a real app, you'd also send an API request here to update the pin status on the backend
    console.log(`Toggled pin for conversation: ${conversationId}`);
  };

  const filteredConversations = conversations.filter(conv =>
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

        {/* Search */}
        <div className="relative mt-4"> {/* Added mt-4 for spacing */}
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
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">Reload</Button>
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
                className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 group ${
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
                      {/* Pin button/icon, toggleable */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-500 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selecting conversation when clicking pin
                          togglePin(conversation.id);
                        }}
                        title={conversation.isPinned ? "Unpin conversation" : "Pin conversation"}
                      >
                         <Pin className={`w-4 h-4 ${conversation.isPinned ? 'fill-orange-500 text-orange-500' : ''}`} />
                      </Button>
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