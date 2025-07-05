
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Car, 
  DollarSign,
  BarChart3,
  Settings,
  User,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

const DriverSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { title: 'Overview', url: '/driver', icon: LayoutDashboard },
        { title: 'Active Rides', url: '/driver/rides', icon: Car },
        { title: 'Earnings', url: '/driver/earnings', icon: DollarSign },
      ]
    },
    {
      title: 'Management',
      items: [
        { title: 'Ride History', url: '/driver/history', icon: Clock },
        { title: 'Route Planning', url: '/driver/routes', icon: MapPin },
        { title: 'Analytics', url: '/driver/analytics', icon: BarChart3 },
        { title: 'Ratings', url: '/driver/ratings', icon: Star },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Profile', url: '/driver/profile', icon: User },
        { title: 'Settings', url: '/driver/settings', icon: Settings },
      ]
    }
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Driver App</h1>
            <p className="text-xs text-gray-600">Ride Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {menuSections.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        className="w-full relative"
                        isActive={isActive}
                        onClick={() => handleNavigation(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Sokko Sasa Driver
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DriverSidebar;
