
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Home from './pages/Home';
import Services from './pages/Services';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Admin from './pages/admin/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminVendors from './pages/AdminVendors';
import AdminSettings from './pages/AdminSettings';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import VendorRegistration from './pages/VendorRegistration';
import VendorProducts from './pages/VendorProducts';
import VendorOrders from './pages/VendorOrders';
import Rides from './pages/Rides';
import EnhancedRides from './pages/EnhancedRides';
import ImprovedRides from './pages/ImprovedRides';
import RideBooking from './pages/RideBooking';
import RideHistory from './pages/RideHistory';
import DriverRegistration from './pages/DriverRegistration';
import DriverDashboard from './pages/DriverDashboard';
import DriverProfile from './pages/driver/DriverProfile';
import DriverRides from './pages/driver/DriverRides';
import DriverEarnings from './pages/driver/DriverEarnings';
import DriverHistory from './pages/driver/DriverHistory';
import DriverRoutes from './pages/driver/DriverRoutes';
import DriverAnalytics from './pages/driver/DriverAnalytics';
import DriverSettings from './pages/driver/DriverSettings';
import DriverRatings from './pages/driver/DriverRatings';
import PropertyListing from './pages/PropertyListing';
import Properties from './pages/Properties';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import CreatePost from './pages/CreatePost';
import JobApplication from './pages/JobApplication';
import EventDetail from './pages/EventDetail';
import EventRegistration from './pages/EventRegistration';
import InsuranceApplication from './pages/InsuranceApplication';
import MedicalServices from './pages/MedicalServices';
import MedicalProviderRegistration from './pages/MedicalProviderRegistration';
import MedicalProviderDashboard from './pages/MedicalProviderDashboard';
import RestaurantMenus from './pages/RestaurantMenus';
import RestaurantDetail from './pages/RestaurantDetail';
import FoodOrders from './pages/FoodOrders';
import Pharmacy from './pages/Pharmacy';
import MedicationDetail from './pages/MedicationDetail';
import PrescriptionUpload from './pages/PrescriptionUpload';
import Notifications from './pages/Notifications';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/account" element={<Account />} />
          <Route path="/services" element={<Services />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/vendor/register" element={<VendorRegistration />} />
          <Route path="/vendor/products" element={<VendorProducts />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/list" element={<PropertyListing />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/enhanced-rides" element={<EnhancedRides />} />
          <Route path="/improved-rides" element={<ImprovedRides />} />
          <Route path="/ride-booking" element={<RideBooking />} />
          <Route path="/ride-history" element={<RideHistory />} />
          <Route path="/driver/register" element={<DriverRegistration />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/profile" element={<DriverProfile />} />
          <Route path="/driver/rides" element={<DriverRides />} />
          <Route path="/driver/earnings" element={<DriverEarnings />} />
          <Route path="/driver/history" element={<DriverHistory />} />
          <Route path="/driver/routes" element={<DriverRoutes />} />
          <Route path="/driver/analytics" element={<DriverAnalytics />} />
          <Route path="/driver/settings" element={<DriverSettings />} />
          <Route path="/driver/ratings" element={<DriverRatings />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/post/:id" element={<ForumPost />} />
          <Route path="/forum/create" element={<CreatePost />} />
          <Route path="/jobs/apply/:id" element={<JobApplication />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/register" element={<EventRegistration />} />
          <Route path="/insurance/apply" element={<InsuranceApplication />} />
          <Route path="/medical" element={<MedicalServices />} />
          <Route path="/medical/provider/register" element={<MedicalProviderRegistration />} />
          <Route path="/medical/provider/dashboard" element={<MedicalProviderDashboard />} />
          <Route path="/restaurants" element={<RestaurantMenus />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/food/orders" element={<FoodOrders />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/pharmacy/medication/:id" element={<MedicationDetail />} />
          <Route path="/pharmacy/prescription/upload" element={<PrescriptionUpload />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
