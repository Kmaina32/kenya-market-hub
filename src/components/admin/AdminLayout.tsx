
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from './AdminSidebar';
import UserNav from '../UserNav';
import NotificationDropdown from '../NotificationDropdown';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const isOnline = useOnlineStatus();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        {/* Mobile Sidebar Overlay - Fixed z-index and background */}
        {isMobileSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-80 z-50 lg:hidden">
              <AdminSidebar />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}

        {/* Desktop Sidebar - Always visible on desktop */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200/80 bg-white/90 backdrop-blur-md px-4 lg:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Desktop Sidebar Trigger */}
              <SidebarTrigger className="hidden lg:flex hover:bg-orange-50 hover:text-orange-600" />
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">Sokko Sasa Admin</h1>
                  <p className="text-sm text-gray-600 hidden md:block">Management Dashboard</p>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <UserNav />
            </div>
          </div>

          {/* Offline Alert */}
          {!isOnline && (
            <Alert className="m-4 border-yellow-200 bg-yellow-50">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You're currently offline. Some features may not be available.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
