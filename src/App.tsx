import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // BrowserRouter import
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PerformanceMonitor from "./components/PerformanceMonitor";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import RealEstate from "./pages/RealEstate";
import PropertyDetail from "./pages/PropertyDetail";
import Services from "./pages/Services";
import Rides from "./pages/Rides";
import FoodDelivery from "./pages/FoodDelivery";
import Insurance from "./pages/Insurance";
import Medical from "./pages/Medical";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Events from "./pages/Events";
import ChatForums from "./pages/ChatForums";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import EmailConfirmation from "./pages/EmailConfirmation";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NewAdminDashboard from "./pages/NewAdminDashboard";
import AdminApp from "./pages/AdminApp";

// Service provider pages
import ServiceHub from "./pages/ServiceHub";
import ServiceHubUnified from "./pages/ServiceHubUnified";
import ServiceProviderHub from "./pages/ServiceProviderHub";
import ServiceProviderRegistrationPage from "./pages/ServiceProviderRegistrationPage";

// App-specific pages
import VendorApp from "./pages/VendorApp";
import VendorDashboard from "./pages/VendorDashboard";
import VendorAnalyticsPage from "./pages/VendorAnalyticsPage";
import DriverApp from "./pages/DriverApp";
import PropertyOwnerApp from "./pages/PropertyOwnerApp";
import ServicesApp from "./pages/ServicesApp";
import ServicesDashboard from "./pages/ServicesDashboard";

// Create a query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors or 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              {/* FIX: Moved BrowserRouter inside all providers */}
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                  // You can add other future flags here as needed, based on React Router documentation
                }}
              >
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Routes>
                    {/* Main routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/real-estate" element={<RealEstate />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/rides" element={<Rides />} />
                    <Route path="/food-delivery" element={<FoodDelivery />} />
                    <Route path="/food" element={<FoodDelivery />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/medical" element={<Medical />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/job/:id" element={<JobDetail />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/chat-forums" element={<ChatForums />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/email-confirmation" element={<EmailConfirmation />} />

                    {/* Admin routes - Fixed routing */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<AdminApp />} />
                    <Route path="/new-admin/*" element={<NewAdminDashboard />} />

                    {/* Service provider routes */}
                    <Route path="/service-hub" element={<ServiceHub />} />
                    <Route path="/service-hub-unified" element={<ServiceHubUnified />} />
                    <Route path="/service-provider-hub" element={<ServiceProviderHub />} />
                    <Route path="/service-provider-registration" element={<ServiceProviderRegistrationPage />} />

                    {/* App routes */}
                    <Route path="/vendor/*" element={<VendorApp />} />
                    <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                    <Route path="/vendor-analytics" element={<VendorAnalyticsPage />} />
                    <Route path="/driver-app/*" element={<DriverApp />} />
                    <Route path="/property-owner/*" element={<PropertyOwnerApp />} />
                    <Route path="/services-app/*" element={<ServicesApp />} />
                    <Route path="/services-dashboard" element={<ServicesDashboard />} />

                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
                <PerformanceMonitor />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;