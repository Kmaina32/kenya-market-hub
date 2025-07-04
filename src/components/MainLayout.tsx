
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <SidebarTrigger className="hover:bg-orange-50 hover:text-orange-600" />
              <div className="flex items-center space-x-2 sm:space-x-3 md:hidden">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  <img 
                    alt="Sokko Sasa Logo" 
                    src="/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div>
                  <h1 className="text-sm sm:text-lg font-bold text-gray-900">Sokko Sasa</h1>
                  <p className="text-xs text-gray-600 hidden sm:block">Kenya's Marketplace</p>
                </div>
              </div>
              
              {/* Global Search - Hidden on small screens */}
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
          
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer only in MainLayout */}
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
