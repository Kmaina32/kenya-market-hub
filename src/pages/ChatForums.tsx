// src/pages/ChatForums.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Forum } from '@/types/chat'; // Import the Forum interface
import MainLayout from '@/components/MainLayout'; // Import MainLayout for consistent page structure
import { MessageCircle } from 'lucide-react'; // Example icon for visual appeal

function ChatForums() {
  const { data: forums, isLoading, error } = useQuery<Forum[], Error>({
    queryKey: ['chatForums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat forums:', error.message);
        throw error;
      }
      return data as Forum[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <MainLayout> {/* Wrap the content with MainLayout */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-red-800 mb-6 flex items-center"> {/* Changed to red-800 */}
          <MessageCircle className="w-10 h-10 mr-3 text-orange-600" /> {/* Changed to orange-600 */}
          Chat Forums
        </h1>

        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <p className="text-lg text-gray-600">Loading forums...</p>
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
                <p className="text-gray-700">{forum.description || 'No description available.'}</p>
                {/* You can add more forum details here, like created_at, number of posts, etc. */}
              </div>
            ))}
          </div>
        ) : (
          !isLoading && !error && (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-xl text-red-700 font-medium mb-4">No forums available.</p> {/* Changed to red-700 */}
              <p className="text-md text-red-500"> {/* Changed to red-500 */}
                It looks like there are no chat forums yet.
              </p>
              <p className="text-md text-red-500"> {/* Changed to red-500 */}
                You can add new forums from your Supabase dashboard.
              </p>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}

export default ChatForums;