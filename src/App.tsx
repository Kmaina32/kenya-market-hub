
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import Rides from "./pages/Rides";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ModernAdminLayout from "./components/ModernAdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/rides" element={<Rides />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <ModernAdminLayout>
                    <div className="p-6">
                      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                          <p className="text-3xl font-bold text-orange-600 mt-2">1,234</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                          <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
                          <p className="text-3xl font-bold text-orange-600 mt-2">89</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                          <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                          <p className="text-3xl font-bold text-orange-600 mt-2">KSh 45,678</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                          <h3 className="text-lg font-semibold text-gray-900">Active Drivers</h3>
                          <p className="text-3xl font-bold text-orange-600 mt-2">23</p>
                        </div>
                      </div>
                    </div>
                  </ModernAdminLayout>
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
