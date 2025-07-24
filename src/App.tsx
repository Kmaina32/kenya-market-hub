import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import RealEstate from './pages/RealEstate';
import Rides from './pages/Rides';
import Services from './pages/Services';
import Medical from './pages/Medical';
import Insurance from './pages/Insurance';
import Jobs from './pages/Jobs';
import ServiceProviderHub from './pages/ServiceProviderHub';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminVendors from './pages/admin/AdminVendors';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminForums from './pages/admin/AdminForums';
import AdminEvents from './pages/admin/AdminEvents';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReports from './pages/admin/AdminReports';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminProperties from './pages/admin/AdminProperties';
import AdminAgents from './pages/admin/AdminAgents';
import AdminMedical from './pages/admin/AdminMedical';
import AdminInsurance from '@/modules/insurance/pages/AdminInsurance';
import AdminJobs from './pages/admin/AdminJobs';
import AdminRides from './pages/admin/AdminRides';
import AdminServiceProviders from './pages/admin/AdminServiceProviders';
import AdminServiceBookings from './pages/admin/AdminServiceBookings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Settings from '@/pages/Settings';
import AdminServices from '@/pages/admin/AdminServices';
import AdminRestaurants from '@/pages/admin/AdminRestaurants';
import AdminTransactions from '@/pages/admin/AdminTransactions';

function App() {
  return (
    <Router>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/real-estate" element={<MainLayout><RealEstate /></MainLayout>} />
            <Route path="/rides" element={<MainLayout><Rides /></MainLayout>} />
            <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
            <Route path="/medical" element={<MainLayout><Medical /></MainLayout>} />
            <Route path="/insurance" element={<MainLayout><Insurance /></MainLayout>} />
            <Route path="/jobs" element={<MainLayout><Jobs /></MainLayout>} />
            <Route path="/service-provider-hub" element={<MainLayout><ServiceProviderHub /></MainLayout>} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/drivers" element={<AdminDrivers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/admin/forums" element={<AdminForums />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/agents" element={<AdminAgents />} />
            <Route path="/admin/medical" element={<AdminMedical />} />
            <Route path="/admin/insurance" element={<AdminInsurance />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/rides" element={<AdminRides />} />
            <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
            <Route path="/admin/service-bookings" element={<AdminServiceBookings />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
