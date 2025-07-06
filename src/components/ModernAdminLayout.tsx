
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Bell, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ModernAdminSidebar from '@/components/admin/ModernAdminSidebar';
import UserNav from '@/components/UserNav';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface ModernAdminLayoutProps {
  children: React.ReactNode;
}

const ModernAdminLayout = ({ children }: ModernAdminLayoutProps) => {
  const isOnline = useOnlineStatus();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Single Responsive Sidebar */}
        <ModernAdminSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-4 lg:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Sidebar Trigger */}
              <SidebarTrigger className="hover:bg-orange-50 hover:text-orange-600" />
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-gray-900">Sokko</span>{' '} {/* Sokko in black */}
                  <span className="text-orange-600">Admin</span> {/* Sasa in orange */}
                  <p className="text-sm text-gray-600 hidden md:block">Management Dashboard</p>
                </div>
              </div>
            </div>

            {/* Center Search - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
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

export default ModernAdminLayout;
