
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Healthcare from "./pages/Healthcare";
import Ride from "./pages/Ride";
import Dashboard from "./pages/Dashboard";
import ChatForums from "./pages/ChatForums";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminVendorApplications from "./pages/admin/AdminVendorApplications";
import AdminDriverApplications from "./pages/admin/AdminDriverApplications";
import AdminServiceProviders from "./pages/admin/AdminServiceProviders";
import AdminBackup from "./pages/admin/AdminBackup";
import AdminEmailCampaigns from "./pages/admin/AdminEmailCampaigns";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import JobDetail from "./pages/JobDetail";
import ProductCompare from "./pages/ProductCompare";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import VendorApplication from "./pages/VendorApplication";
import DriverApplication from "./pages/DriverApplication";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/events" element={<Events />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/product-compare" element={<ProductCompare />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/healthcare" element={<Healthcare />} />
              <Route path="/ride" element={<Ride />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat-forums" element={<ChatForums />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/vendor-application" element={<VendorApplication />} />
              <Route path="/driver-application" element={<DriverApplication />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/vendor-applications" element={<AdminVendorApplications />} />
              <Route path="/admin/driver-applications" element={<AdminDriverApplications />} />
              <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
              <Route path="/admin/backup" element={<AdminBackup />} />
              <Route path="/admin/email-campaigns" element={<AdminEmailCampaigns />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
