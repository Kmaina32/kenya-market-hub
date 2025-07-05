
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PropertyOwnerSidebar from '@/components/sidebars/PropertyOwnerSidebar';
import UserNav from '../UserNav';

interface PropertyOwnerLayoutProps {
  children: React.ReactNode;
}

const PropertyOwnerLayout: React.FC<PropertyOwnerLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <PropertyOwnerSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-green-200 bg-white px-3 sm:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger className="hover:bg-green-50 hover:text-green-600" />
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-sm sm:text-lg font-bold text-gray-900">Property Portal</h1>
                  <p className="text-xs text-gray-600">Property Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="hover:bg-green-50 hover:text-green-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Main App
              </Button>
              <UserNav />
            </div>
          </div>
          
          <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
            {children}
          </div>

          <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-600">
            © 2025 Sokko Sasa by Milleast.tech
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PropertyOwnerLayout;
