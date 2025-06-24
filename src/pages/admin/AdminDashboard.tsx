
import React from 'react';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <AdminDashboardOverview />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Metrics</h2>
        <AdminDashboardStats />
      </div>
    </div>
  );
};

export default AdminDashboard;
