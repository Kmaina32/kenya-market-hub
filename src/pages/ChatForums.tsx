/**
 * src/hooks/useChatForums.ts
 *
 * This React Query hook is responsible for fetching a list of chat forums
 * from the Supabase database. It provides data, loading, and error states
 * for displaying the available forums in the UI.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Forum } from '@/types/chat'; // Import the Forum interface

/**
 * Custom hook to fetch all available chat forums.
 * @returns {object} An object containing:
 * - data: An array of Forum objects, or undefined if loading/error.
 * - isLoading: A boolean indicating if the data is currently being fetched.
 * - error: An Error object if the fetch failed.
 * - refetch: A function to manually refetch the forums.
 */
export const useChatForums = () => {
  return useQuery<Forum[], Error>({
    queryKey: ['chatForums'], // Unique key for this query
    queryFn: async () => {
      // Fetch forums from the 'forums' table in Supabase
      // Ensure your 'forums' table exists and has appropriate RLS policies
      const { data, error } = await supabase
        .from('forums')
        .select('*') // Select all columns for the Forum interface
        .order('created_at', { ascending: false }); // Order by creation date, newest first

      if (error) {
        console.error('Error fetching chat forums:', error.message);
        throw error; // Throw the error to be caught by React Query
      }

      // Return the fetched data, ensuring it matches the Forum[] type
      return data as Forum[];
    },
    // Optional: Add staleTime, cacheTime, refetchOnWindowFocus etc. as per your caching strategy
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
  });
};
