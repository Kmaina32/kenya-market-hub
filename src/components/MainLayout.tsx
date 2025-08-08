import React from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppSidebar from './AppSidebar';
import UserNav from './UserNav';
import NotificationDropdown from './NotificationDropdown';
import GlobalSearch from './GlobalSearch';
import Footer from './Footer';
import CartQuantityBadge from './CartQuantityBadge';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useNavigate } from 'react-router-dom';
import NewsletterNotification from './NewsletterNotification';
import { cn } from '@/lib/utils'; // Import cn utility

interface MainLayoutProps {
  children: React.ReactNode;
}

// A new component to wrap the main content and header, allowing access to sidebar context
const LayoutContent: React.FC<MainLayoutProps> = ({ children }) => {
  const { state, isMobile } = useSidebar();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <main
      className={cn(
        "flex-1 flex flex-col overflow-x-hidden",
        !isMobile && state === "expanded" && "md:ml-[var(--sidebar-width)]",
        !isMobile && state === "collapsed" && "md:ml-[var(--sidebar-width-icon)]"
      )}
    >
      {/* Header - Fixed positioning to always stay visible */}
      <div
        className={cn(
          "fixed top-0 right-0 z-30 flex items-center justify-between border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-3 sm:px-6 py-2 shadow-sm",
          !isMobile && state === "expanded" && "md:left-[var(--sidebar-width)]",
          !isMobile && state === "collapsed" && "md:left-[var(--sidebar-width-icon)]",
          isMobile && "left-0 w-full"
        )}
      >
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

      {/* Content area with reduced top padding for better space utilization */}
      <div className="pt-12 flex-1 flex flex-col">
        {!isOnline && (
          <Alert className="m-4 border-yellow-200 bg-yellow-50">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You're currently offline. Some features may not be available.
            </AlertDescription>
          </Alert>
        )}

        {/* Main content area with optimized padding and center alignment */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col items-center">
          {children}
        </div>

        {/* Footer only in MainLayout */}
        <Footer />

        {/* Newsletter Notification */}
        <NewsletterNotification />
      </div>
    </main>
  );
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <LayoutContent>{children}</LayoutContent>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
