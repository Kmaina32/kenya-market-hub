
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
import Services from "./pages/Services";
import Events from "./pages/Events";
import VendorDashboard from "./pages/VendorDashboard";
import FoodDelivery from "./pages/FoodDelivery";
import ChatForums from "./pages/ChatForums";
import RealEstate from "./pages/RealEstate";
import Medical from "./pages/Medical";
import Jobs from "./pages/Jobs";
import Insurance from "./pages/Insurance";
import Rides from "./pages/Rides";
import ServiceProviderHub from "./pages/ServiceProviderHub";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminApp from "./pages/AdminApp";
import VendorApp from "./pages/VendorApp";
import DriverApp from "./pages/DriverApp";
import PropertyOwnerApp from "./pages/PropertyOwnerApp";
import ServicesApp from "./pages/ServicesApp";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <CartProviderWrapper>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/food-delivery" element={<FoodDelivery />} />
                    <Route path="/chat-forums" element={<ChatForums />} />
                    <Route path="/real-estate" element={<RealEstate />} />
                    <Route path="/medical" element={<Medical />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/rides" element={<Rides />} />
                    <Route path="/service-provider-hub" element={<ServiceProviderHub />} />
                    
                    {/* Protected customer routes */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    
                    {/* Legacy redirect routes */}
                    <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                    
                    {/* Specialized app routes */}
                    <Route path="/admin/*" element={<AdminApp />} />
                    <Route path="/vendor/*" element={<VendorApp />} />
                    <Route path="/driver/*" element={<DriverApp />} />
                    <Route path="/property-owner/*" element={<PropertyOwnerApp />} />
                    <Route path="/services-app/*" element={<ServicesApp />} />
                    
                    {/* Catch-all 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </CartProviderWrapper>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
