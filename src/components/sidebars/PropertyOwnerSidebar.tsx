
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
  Building, 
  Plus,
  BarChart3,
  Settings,
  User,
  MessageSquare,
  Eye,
  Users,
  DollarSign
} from 'lucide-react';

const PropertyOwnerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { title: 'Overview', url: '/property-owner', icon: LayoutDashboard },
        { title: 'Revenue', url: '/property-owner/revenue', icon: DollarSign },
      ]
    },
    {
      title: 'Properties',
      items: [
        { title: 'All Properties', url: '/property-owner/properties', icon: Building },
        { title: 'Add Property', url: '/property-owner/properties/add', icon: Plus },
        { title: 'Viewings', url: '/property-owner/viewings', icon: Eye },
      ]
    },
    {
      title: 'Management',
      items: [
        { title: 'Inquiries', url: '/property-owner/inquiries', icon: MessageSquare },
        { title: 'Tenants', url: '/property-owner/tenants', icon: Users },
        { title: 'Analytics', url: '/property-owner/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Profile', url: '/property-owner/profile', icon: User },
        { title: 'Settings', url: '/property-owner/settings', icon: Settings },
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
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Property Portal</h1>
            <p className="text-xs text-gray-600">Real Estate Hub</p>
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
                        className="w-full relative hover:bg-green-50 hover:text-green-600"
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
          © 2025 Sokko Sasa by Milleast.tech
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PropertyOwnerSidebar;
