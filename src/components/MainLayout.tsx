
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'; // Assuming SidebarProvider manages sidebar visibility
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppSidebar from './AppSidebar'; // This component is key for mobile responsiveness
import UserNav from './UserNav';
import NotificationDropdown from './NotificationDropdown';
import GlobalSearch from './GlobalSearch';
import Footer from './Footer';
import CartQuantityBadge from './CartQuantityBadge';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useNavigate } from 'react-router-dom';
import NewsletterNotification from './NewsletterNotification'; // Import NewsletterNotification

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <SidebarProvider>
      {/*
        The main container for the entire layout.
        On small screens, the sidebar will likely be off-canvas,
        so the main content area should span the full width.
        On larger screens, the sidebar will be fixed, and the main content
        area will sit next to it.
      */}
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* AppSidebar is crucial here. It must be implemented to:
          - Be fixed and visible on larger screens (e.g., `lg:w-64 lg:flex-shrink-0 lg:static`).
          - Be off-canvas (hidden by default, slides out) on smaller screens 
            (e.g., `fixed inset-y-0 left-0 z-50 transform -translate-x-full transition-transform duration-300 ease-in-out sm:translate-x-0 sm:static` 
            controlled by a state from SidebarProvider).
          - Have an appropriate width on desktop (e.g., w-64 or w-72).
        */}
        <AppSidebar />

        {/* Main content area. This will expand to fill the remaining space.
          On mobile, it should effectively take up 100% width, as the sidebar is off-canvas.
          On desktop, it will take the space next to the fixed sidebar.
        */}
        <main className="flex-1 flex flex-col overflow-x-hidden"> {/* Added overflow-x-hidden here */}
          {/* Header - Enhanced sticky positioning with higher z-index */}
          <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6 py-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <SidebarTrigger className="hover:bg-orange-50 hover:text-orange-600" aria-label="Toggle Sidebar" /> 
              {/* Logo & Sokko Sasa text - visible on small screens, hidden on md and up */}
              <div className="flex items-center space-x-2 sm:space-x-3 md:hidden">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  <img 
                    alt="Sokko Sasa Logo" 
                    src="/LOGO/Sokko.svg"
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div>
                  <h1 className="text-sm sm:text-lg font-normal">
                    <span className="text-gray-900">Sokko</span>{' '}
                    <span className="text-orange-600">Sasa</span>
                  </h1>
                  <p className="text-xs text-gray-600 hidden sm:block">Africa's Smart Marketplace</p>
                </div>
              </div>
              
              {/* Global Search - Hidden on small screens, flex on md and up */}
              <div className="hidden md:flex flex-1 max-w-2xl">
                <GlobalSearch />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Cart Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCartClick}
                className="relative hover:bg-orange-50 hover:text-orange-600"
                aria-label="Shopping Cart" 
              >
                <ShoppingCart className="h-5 w-5" />
                <CartQuantityBadge />
              </Button>
              
              <NotificationDropdown />
              <UserNav />
            </div>
          </div>
          
          {!isOnline && (
            <Alert className="m-4 border-yellow-200 bg-yellow-50">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You're currently offline. Some features may not be available.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Main content area for children. Use padding for inner spacing. */}
          {/* Added p-4 for general padding to prevent content from touching edges */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6"> 
            {children}
          </div>
          
          {/* Footer only in MainLayout */}
          <Footer />

          {/* Newsletter Notification */}
          <NewsletterNotification />

        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
