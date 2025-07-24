
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import CartProviderWrapper from "@/components/CartProviderWrapper";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Properties from "./pages/Properties";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Vendor from "./pages/Vendor";
import Admin from "./pages/Admin";
import VendorDashboard from "./pages/VendorDashboard";
import ChatInterface from "./pages/ChatInterface";
import Forums from "./pages/Forums";
import FoodDelivery from "./pages/FoodDelivery";
import AdminRoute from "./components/AdminRoute";
import VendorRoute from "./components/VendorRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProviderWrapper>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/vendor" element={<Vendor />} />
                  <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
                  <Route path="/vendor-dashboard" element={<VendorRoute><VendorDashboard /></VendorRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
                  <Route path="/forums" element={<Forums />} />
                  <Route path="/food-delivery" element={<FoodDelivery />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </CartProviderWrapper>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
