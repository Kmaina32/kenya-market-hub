// In src/pages/ChatForums.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/MainLayout';
import { MessageCircle } from 'lucide-react';
// Note: Using a broader type for chat list as the component might show different chat types
// import { Forum } from '@/types/chat'; // Might be used later if forums are reintroduced
import { ChatInterface } from '@/components/chat/ChatInterface'; // Import the main chat component

function ChatForums() {
  const { data: forums, isLoading, error } = useQuery<Forum[], Error>({
    queryKey: ['chatForums'],
    queryFn: async () => {
      const { data, error: supabaseError } = await supabase
        .from('forums')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Error fetching chat forums:', supabaseError.message);
        throw supabaseError;
      }
      return data as Forum[];
    },
    // Keeping stale and gc times for potential future forum list display
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-red-800 mb-6 flex items-center">
          <MessageCircle className="w-10 h-10 mr-3 text-orange-600" />
          Chat Forums
        </h1>

        {/* Render the main ChatInterface component */}
        <div className="h-[calc(100vh-200px)]"> {/* Adjust height as needed */}
          <ChatInterface selectedConversationId={null} /> {/* Pass null initially as no conversation is selected */}
        </div>
      </div>
    </MainLayout>
  );
}

export default ChatForums;