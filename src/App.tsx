
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Profile from '@/pages/Profile';
import ServiceHub from '@/pages/ServiceHub';
import Wishlist from '@/pages/Wishlist';
import RealEstate from '@/pages/RealEstate';
import PropertyDetail from '@/pages/PropertyDetail';
import Rides from '@/pages/Rides';
import Services from '@/pages/Services';
import ServicesApp from '@/pages/ServicesApp';
import Medical from '@/pages/Medical';
import Insurance from '@/pages/Insurance';
import Jobs from '@/pages/Jobs';
import Events from '@/pages/Events';
import Food from '@/pages/Food';
import ChatForums from '@/pages/ChatForums';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminModernDashboard from '@/pages/admin/AdminModernDashboard';
import AdminServiceProviders from '@/pages/admin/AdminServiceProviders';
import AdminVendors from '@/pages/admin/AdminVendors';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminReports from '@/pages/admin/AdminReports';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/service-hub" element={<ServiceHub />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/real-estate" element={<RealEstate />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/rides" element={<Rides />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services-app" element={<ServicesApp />} />
                <Route path="/medical" element={<Medical />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/events" element={<Events />} />
                <Route path="/food" element={<Food />} />
                <Route path="/chat-forums" element={<ChatForums />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminModernDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/vendors" element={<AdminVendors />} />
                <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/reports" element={<AdminReports />} />
              </Routes>
            </div>
            <Toaster position="top-right" richColors />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
