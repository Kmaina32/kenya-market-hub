
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import SidebarSection from './sidebar/SidebarSection';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  ShoppingBag, 
  Car, 
  Wrench, 
  Building, 
  Heart, 
  ShoppingCart, 
  User, 
  Stethoscope, 
  Briefcase, 
  Shield,
  UtensilsCrossed,
  Calendar,
  MessageCircle,
  Settings
} from 'lucide-react';

const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Custom isActive function to handle various path patterns
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const mainItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: UtensilsCrossed, label: 'Food Delivery', path: '/food' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: MessageCircle, label: 'Chat & Forums', path: '/chat-forums' }
  ];

  const servicesItems = [
    { icon: Car, label: 'Rides', path: '/rides' },
    { icon: Wrench, label: 'Services', path: '/services' },
    { icon: Building, label: 'Real Estate', path: '/real-estate' },
    { icon: Stethoscope, label: 'Medical', path: '/medical' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Shield, label: 'Insurance', path: '/insurance' }
  ];

  const userItems = [
    { icon: ShoppingCart, label: 'Cart', path: '/cart', hasQuantityBadge: true },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Service Hub', path: '/service-hub' }
  ];

  return (
    <Sidebar variant="inset" className="border-r border-orange-200">
      <SidebarHeader className="border-b border-orange-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
            <img 
              alt="Soko Smart Logo" 
              src="/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Soko Smart</h1>
            <p className="text-sm text-gray-600">Kenya's Marketplace</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSection 
          title="Main" 
          items={mainItems} 
          isActive={isActive} 
        />
        
        <SidebarSection 
          title="Services" 
          items={servicesItems} 
          isActive={isActive} 
        />
        
        <SidebarSection 
          title="My Account" 
          items={userItems} 
          isActive={isActive} 
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-orange-200 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span className="text-sm text-gray-600">
                © 2025 Sokko Smart by Milleast.tech. All rights reserved.
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
