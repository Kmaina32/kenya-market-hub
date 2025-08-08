
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import Profile from "./pages/Profile";

import VendorDashboard from "./pages/VendorDashboard";
import ServiceHub from "./pages/ServiceHub";
import ServiceProviderRegistration from "./pages/ServiceProviderRegistration";
import ServicesApp from "./pages/ServicesApp";
import ServiceProviderHub from "./pages/ServiceProviderHub";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Events from "./pages/Events";
import FoodDelivery from "./pages/FoodDelivery";
import ChatForums from "./pages/ChatForums";
import Rides from "./pages/Rides";
import RealEstate from "./pages/RealEstate";
import Medical from "./pages/Medical";
import Jobs from "./pages/Jobs";
import Insurance from "./pages/Insurance";
import Wishlist from "./pages/Wishlist";
import Services from "./pages/Services";

// Admin pages - Import AdminApp instead of individual components
import AdminApp from "./pages/AdminApp";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/food" element={<FoodDelivery />} />
                  <Route path="/chat-forums" element={<ChatForums />} />
                  <Route path="/rides" element={<Rides />} />
                  <Route path="/real-estate" element={<RealEstate />} />
                  <Route path="/medical" element={<Medical />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  
                  {/* Service Provider routes */}
                  <Route path="/service-hub" element={<ServiceHub />} />
                  <Route path="/service-provider-registration" element={<ServiceProviderRegistration />} />
                  <Route path="/services-app" element={<ServicesApp />} />
                  <Route path="/service-provider-hub" element={<ServiceProviderHub />} />
                  
                  {/* Vendor routes */}
                  
                  <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                  <Route path="/vendor" element={<VendorDashboard />} />
                  
                  {/* Payment routes */}
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  
  {/* Admin routes - Use AdminApp with protected route */}
  <Route path="/admin/*" element={
    <ProtectedAdminRoute>
      <AdminApp />
    </ProtectedAdminRoute>
  } />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
