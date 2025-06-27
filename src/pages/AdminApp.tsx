
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import AdminModernDashboard from '@/pages/admin/AdminModernDashboard';

// Import all admin page components
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminVendors from '@/pages/admin/AdminVendors';
import AdminDrivers from '@/pages/admin/AdminDrivers';
import AdminServiceProviders from '@/pages/admin/AdminServiceProviders';
import AdminEmployers from '@/pages/admin/AdminEmployers';
import AdminAgents from '@/pages/admin/AdminAgents';
import AdminRides from '@/pages/admin/AdminRides';
import AdminServiceBookings from '@/pages/admin/AdminServiceBookings';
import AdminProperties from '@/pages/admin/AdminProperties';
import AdminMedical from '@/pages/admin/AdminMedical';
import AdminInsurance from '@/pages/admin/AdminInsurance';
import AdminFoodDelivery from '@/pages/admin/AdminFoodDelivery';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminJobs from '@/pages/admin/AdminJobs';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminReports from '@/pages/admin/AdminReports';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';

const AdminApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProtectedAdminRoute>
      <ModernAdminLayout>
        <Routes>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminModernDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="service-providers" element={<AdminServiceProviders />} />
          <Route path="employers" element={<AdminEmployers />} />
          <Route path="agents" element={<AdminAgents />} />
          <Route path="rides" element={<AdminRides />} />
          <Route path="service-bookings" element={<AdminServiceBookings />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="medical" element={<AdminMedical />} />
          <Route path="insurance" element={<AdminInsurance />} />
          <Route path="food-delivery" element={<AdminFoodDelivery />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </ModernAdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminApp;
