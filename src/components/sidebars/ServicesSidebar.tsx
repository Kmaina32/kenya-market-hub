
import React from 'react';
import { 
  Calendar, 
  BarChart3, 
  Settings, 
  User, 
  Home,
  Wrench,
  ArrowLeft
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import SidebarSection from '../sidebar/SidebarSection';

const ServicesSidebar = () => {
  const mainItems = [
    { icon: Home, label: 'Dashboard', path: '/services-app' },
    { icon: Calendar, label: 'Bookings', path: '/services-app/bookings' },
    { icon: BarChart3, label: 'Analytics', path: '/services-app/analytics' },
  ];

  const accountItems = [
    { icon: User, label: 'Profile', path: '/services-app/profile' },
    { icon: Settings, label: 'Settings', path: '/services-app/settings' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Services</h1>
            <p className="text-xs text-gray-600">Service Provider Hub</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarSection title="Main" items={mainItems} />
        <SidebarSection title="Account" items={accountItems} />
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Main App
        </Button>
        <div className="text-xs text-gray-500 text-center mt-2">
          © 2025 Sokko Sasa by Milleast.tech
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ServicesSidebar;
