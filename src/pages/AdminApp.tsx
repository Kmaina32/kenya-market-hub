
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import AdminModernDashboard from '@/pages/admin/AdminModernDashboard';
import AdminServiceProviderApplications from './admin/AdminServiceProviderApplications';

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
import AdminPropertyInquiries from '@/pages/admin/AdminPropertyInquiries';
import AdminPropertyViewings from '@/pages/admin/AdminPropertyViewings';
import AdminMedical from '@/pages/admin/AdminMedical';
import AdminInsurance from '@/pages/admin/AdminInsurance';
import AdminFoodDelivery from '@/pages/admin/AdminFoodDelivery';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminJobs from '@/pages/admin/AdminJobs';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminReports from '@/pages/admin/AdminReports';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminApprovals from '@/pages/admin/AdminApprovals';
import AdminForums from '@/pages/admin/AdminForums';

const AdminApp = () => {
  return (
    <ModernAdminLayout>
      <Routes>
        <Route index element={<AdminModernDashboard />} />
        <Route path="dashboard" element={<AdminModernDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="agents" element={<AdminAgents />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="property-inquiries" element={<AdminPropertyInquiries />} />
        <Route path="property-viewings" element={<AdminPropertyViewings />} />
        <Route path="service-providers" element={<AdminServiceProviders />} />
        <Route path="service-provider-applications" element={<AdminServiceProviderApplications />} />
        <Route path="service-bookings" element={<AdminServiceBookings />} />
        <Route path="medical" element={<AdminMedical />} />
        <Route path="rides" element={<AdminRides />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="employers" element={<AdminEmployers />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="forums" element={<AdminForums />} />
        <Route path="food-delivery" element={<AdminFoodDelivery />} />
        <Route path="insurance" element={<AdminInsurance />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="approvals" element={<AdminApprovals />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ModernAdminLayout>
  );
};

export default AdminApp;
