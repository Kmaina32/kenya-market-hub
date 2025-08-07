
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import CartQuantityBadge from '../CartQuantityBadge';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  hasQuantityBadge?: boolean;
}

interface SidebarSectionProps {
  title: string;
  items: MenuItem[];
  isActive?: (path: string) => boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, isActive }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const defaultIsActive = (path: string) => location.pathname === path;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={`${item.path}-${item.label}`}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item.path)}
                isActive={isActive ? isActive(item.path) : defaultIsActive(item.path)}
                className="relative"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.hasQuantityBadge && <CartQuantityBadge />}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarSection;
