
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import VendorRegistration from "./pages/VendorRegistration";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";
import VendorAnalyticsPage from "./pages/VendorAnalyticsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminVendors from "./pages/AdminVendors";
import AdminSettings from "./pages/AdminSettings";
import PropertyListing from "./pages/PropertyListing";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import RideBooking from "./pages/RideBooking";
import RideHistory from "./pages/RideHistory";
import DriverRegistration from "./pages/DriverRegistration";
import DriverDashboard from "./pages/DriverDashboard";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumPost";
import CreatePost from "./pages/CreatePost";
import Chat from "./pages/Chat";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import JobApplication from "./pages/JobApplication";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventRegistration from "./pages/EventRegistration";
import Insurance from "./pages/Insurance";
import InsuranceApplication from "./pages/InsuranceApplication";
import SafetyCenter from "./pages/SafetyCenter";
import ComprehensiveAnalytics from "./pages/ComprehensiveAnalytics";
import MedicalServices from "./pages/MedicalServices";
import MedicalProviderRegistration from "./pages/MedicalProviderRegistration";
import MedicalProviderDashboard from "./pages/MedicalProviderDashboard";
import RestaurantMenus from "./pages/RestaurantMenus";
import RestaurantDetail from "./pages/RestaurantDetail";
import FoodOrders from "./pages/FoodOrders";
import Pharmacy from "./pages/Pharmacy";
import MedicationDetail from "./pages/MedicationDetail";
import PrescriptionUpload from "./pages/PrescriptionUpload";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/vendor/register" element={<VendorRegistration />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/products" element={<VendorProducts />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
              <Route path="/vendor/analytics" element={<VendorAnalyticsPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/comprehensive-analytics" element={<ComprehensiveAnalytics />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/vendors" element={<AdminVendors />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/property/list" element={<PropertyListing />} />
              <Route path="/rides/book" element={<RideBooking />} />
              <Route path="/rides/history" element={<RideHistory />} />
              <Route path="/driver/register" element={<DriverRegistration />} />
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/post/:id" element={<ForumPost />} />
              <Route path="/forum/create" element={<CreatePost />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/:id/apply" element={<JobApplication />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/register" element={<EventRegistration />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/insurance/apply" element={<InsuranceApplication />} />
              <Route path="/safety" element={<SafetyCenter />} />
              <Route path="/medical" element={<MedicalServices />} />
              <Route path="/medical/provider/register" element={<MedicalProviderRegistration />} />
              <Route path="/medical/provider/dashboard" element={<MedicalProviderDashboard />} />
              <Route path="/restaurants" element={<RestaurantMenus />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/food/orders" element={<FoodOrders />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/pharmacy/:id" element={<MedicationDetail />} />
              <Route path="/prescription/upload" element={<PrescriptionUpload />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
