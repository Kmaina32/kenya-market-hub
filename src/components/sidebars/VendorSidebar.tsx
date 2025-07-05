
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
  Package, 
  ShoppingCart,
  BarChart3,
  Settings,
  User,
  Plus,
  Store,
  DollarSign,
  Users
} from 'lucide-react';

const VendorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { title: 'Overview', url: '/vendor', icon: LayoutDashboard },
        { title: 'My Store', url: '/vendor/store', icon: Store },
      ]
    },
    {
      title: 'Products',
      items: [
        { title: 'All Products', url: '/vendor/products', icon: Package },
        { title: 'Add Product', url: '/vendor/products/add', icon: Plus },
      ]
    },
    {
      title: 'Business',
      items: [
        { title: 'Customers', url: '/vendor/customers', icon: Users },
        { title: 'Analytics', url: '/vendor/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Profile', url: '/vendor/profile', icon: User },
        { title: 'Settings', url: '/vendor/settings', icon: Settings },
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
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Vendor Portal</h1>
            <p className="text-xs text-gray-600">E-commerce Hub</p>
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
          © 2024 Sokko Sasa Vendor
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default VendorSidebar;
