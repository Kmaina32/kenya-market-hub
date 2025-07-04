
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, ShoppingCart } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import UserNav from '@/components/UserNav';
import GlobalSearch from '@/components/GlobalSearch';
import Footer from '@/components/Footer';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCartContext } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isOnline = useOnlineStatus();
  const { getTotalItems } = useCartContext();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <SidebarTrigger className="hover:bg-orange-50 hover:text-orange-600 rounded-lg" />
              <div className="flex items-center space-x-2 sm:space-x-3 md:hidden">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  <img 
                    alt="Sokko Smart Logo" 
                    src="/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div>
                  <h1 className="text-sm sm:text-lg font-bold text-gray-900">Sokko Smart</h1>
                  <p className="text-xs text-gray-600 hidden sm:block">Kenya's Smart Marketplace</p>
                </div>
              </div>
              
              {/* Global Search - Hidden on small screens */}
              <div className="hidden md:flex flex-1 max-w-2xl">
                <GlobalSearch />
              </div>
            </div>
            
            {/* Cart and User Nav */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cart')}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <UserNav />
            </div>
          </div>
          
          {!isOnline && (
            <Alert className="m-4 border-yellow-200 bg-yellow-50 rounded-xl">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You're currently offline. Some features may not be available.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex-1">
            {children}
          </div>
          
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
