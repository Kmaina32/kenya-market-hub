
import React from 'react';
import RestaurantManagement from '@/components/admin/RestaurantManagement';
import { AdminGuard } from '@/components/ui/AdminGuard';

const AdminFoodDelivery: React.FC = () => {
  return (
    <AdminGuard>
      <RestaurantManagement />
    </AdminGuard>
  );
};

export default AdminFoodDelivery;
