// In src/pages/ChatForums.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Forum } from '@/types/chat';
import MainLayout from '@/components/MainLayout';
import { MessageCircle, Loader2 } from 'lucide-react';

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

        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-lg text-gray-600 ml-3">Loading forums...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-48">
            <p className="text-lg text-red-600">Error loading forums: {error.message}</p>
          </div>
        )}

        {!isLoading && !error && forums && forums.length > 0 ? (
          <div className="space-y-4">
            {forums.map(forum => (
              <div key={forum.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{forum.name}</h2>
                <p className="text-gray-700">{forum.description || 'No description available for this forum.'}</p>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && !error && ( // This condition now means: if not loading, no error, and no forums found
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-700 font-medium mb-4">No forums found.</p>
              <p className="text-md text-gray-500">It looks like there are no chat forums available right now.</p>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}

export default ChatForums;