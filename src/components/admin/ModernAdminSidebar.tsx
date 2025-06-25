
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ClipboardList,
  Store,
  Car,
  Wrench,
  Building,
  Route,
  Stethoscope,
  BarChart3,
  Settings,
  UserCheck,
  Building2,
  Bell,
  Briefcase,
  Shield,
  UtensilsCrossed,
  Calendar,
  FileText,
  X
} from 'lucide-react';

interface ModernAdminSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const ModernAdminSidebar = ({ isMobileOpen, onMobileClose }: ModernAdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === `/admin${path}`;
  };

  const handleNavigation = (path: string) => {
    navigate(`/admin${path}`);
    onMobileClose?.();
  };

  const mainItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
    { icon: Users, label: 'Users', path: '/users', badge: null },
    { icon: ShoppingBag, label: 'Products', path: '/products', badge: null },
    { icon: ClipboardList, label: 'Orders', path: '/orders', badge: '5' }
  ];

  const businessItems = [
    { icon: Store, label: 'Vendors', path: '/vendors', badge: '3' },
    { icon: Car, label: 'Drivers', path: '/drivers', badge: null },
    { icon: Wrench, label: 'Service Providers', path: '/service-providers', badge: null },
    { icon: Building2, label: 'Employers', path: '/employers', badge: null },
    { icon: UserCheck, label: 'Agents', path: '/agents', badge: null }
  ];

  const servicesItems = [
    { icon: Route, label: 'Rides', path: '/rides', badge: null },
    { icon: Wrench, label: 'Service Bookings', path: '/service-bookings', badge: null },
    { icon: Building, label: 'Properties', path: '/properties', badge: null },
    { icon: Stethoscope, label: 'Medical', path: '/medical', badge: null },
    { icon: Shield, label: 'Insurance', path: '/insurance', badge: null },
    { icon: UtensilsCrossed, label: 'Food Delivery', path: '/food-delivery', badge: null },
    { icon: Calendar, label: 'Events', path: '/events', badge: null },
    { icon: Briefcase, label: 'Job Board', path: '/jobs', badge: null }
  ];

  const systemItems = [
    { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
    { icon: FileText, label: 'Reports', path: '/reports', badge: null },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: '7' },
    { icon: Settings, label: 'Settings', path: '/settings', badge: null }
  ];

  const SidebarSection = ({ title, items }: { title: string; items: any[] }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-orange-600 font-semibold text-xs uppercase tracking-wider">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item.path)}
                isActive={isActive(item.path)}
                className={`group relative hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-r-2 border-orange-500 font-medium' 
                    : ''
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-auto bg-orange-100 text-orange-700 text-xs h-5 w-5 flex items-center justify-center p-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <>
      <Sidebar 
        variant="inset" 
        className={`border-r border-orange-200/50 bg-white/95 backdrop-blur-md shadow-xl ${
          isMobileOpen ? 'translate-x-0' : ''
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <SidebarHeader className="border-b border-orange-200/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Soko Smart</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={onMobileClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="py-4 space-y-4">
          <SidebarSection title="Main" items={mainItems} />
          <SidebarSection title="Business Partners" items={businessItems} />
          <SidebarSection title="Services & Modules" items={servicesItems} />
          <SidebarSection title="System" items={systemItems} />
        </SidebarContent>

        <SidebarFooter className="border-t border-orange-200/50 p-4">
          <div className="text-xs text-gray-500 text-center">
            © 2024 Soko Smart Admin
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default ModernAdminSidebar;
