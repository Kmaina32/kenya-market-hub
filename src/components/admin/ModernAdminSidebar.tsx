
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  Users,
  ShoppingBag,
  Car,
  Building,
  Shield,
  Settings,
  MessageSquare,
  Calendar,
  TrendingUp,
  FileText,
  LogOut
} from 'lucide-react';

const ModernAdminSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const adminItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
    { icon: Car, label: 'Drivers', path: '/admin/drivers' },
    { icon: Building, label: 'Vendors', path: '/admin/vendors' },
    { icon: MessageSquare, label: 'Forums', path: '/admin/forums' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar variant="inset" className="border-r border-gray-200/80 bg-white/95 backdrop-blur-md">
      <SidebarHeader className="border-b border-gray-200/80 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-normal text-lg">
              <span className="text-gray-900">Sokko</span>{' '}
              <span className="text-orange-600">Admin</span>
            </h1>
            <p className="text-sm text-gray-600">Management Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {adminItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-orange-50 text-orange-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/80 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ModernAdminSidebar;
