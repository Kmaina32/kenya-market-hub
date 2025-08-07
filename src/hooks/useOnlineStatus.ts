
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSeen, setLastSeen] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const updateUserStatus = async (status: 'online' | 'offline') => {
      try {
        const updates: any = {
          updated_at: new Date().toISOString()
        };
        
        // No-op: we only update the timestamp to infer online status


        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
      } catch (error) {
        console.error('Failed to update user status:', error);
      }
    };

    // Update status when component mounts
    updateUserStatus(isOnline ? 'online' : 'offline');

    // Update status when online/offline changes
    if (isOnline) {
      updateUserStatus('online');
    } else {
      updateUserStatus('offline');
      setLastSeen(new Date());
    }

    // Set up periodic updates when online
    let interval: NodeJS.Timeout;
    if (isOnline) {
      interval = setInterval(() => {
        updateUserStatus('online');
      }, 30000); // Update every 30 seconds
    }

    // Cleanup on unmount or when going offline
    return () => {
      if (interval) clearInterval(interval);
      if (user) {
        updateUserStatus('offline');
      }
    };
  }, [user, isOnline]);

  return {
    isOnline,
    lastSeen
  };
};

export const useUserOnlineStatus = (userId: string) => {
  const [userStatus, setUserStatus] = useState<{
    isOnline: boolean;
    lastSeen: string | null;
  }>({ isOnline: false, lastSeen: null });

  useEffect(() => {
    if (!userId) return;

    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('created_at, updated_at')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          // Use updated_at as a proxy for online status
          const lastUpdate = new Date(data.updated_at || data.created_at);
          const now = new Date();
          const isRecent = now.getTime() - lastUpdate.getTime() < 5 * 60 * 1000; // 5 minutes

          setUserStatus({
            isOnline: isRecent,
            lastSeen: data.updated_at || data.created_at
          });
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error);
      }
    };

    fetchUserStatus();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          if (payload.new) {
            const lastUpdate = new Date((payload.new as any).updated_at);
            const now = new Date();
            const isRecent = now.getTime() - lastUpdate.getTime() < 5 * 60 * 1000;

            setUserStatus({
              isOnline: isRecent,
              lastSeen: (payload.new as any).updated_at
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return userStatus;
};
