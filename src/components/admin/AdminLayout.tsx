
import React from 'react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { Toaster } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Enable real-time notifications
  useRealtimeNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default AdminLayout;
