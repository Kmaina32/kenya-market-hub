
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ProtectedServiceHubRoute from '@/components/ProtectedServiceHubRoute';
import ServiceProviderHub from '@/components/ServiceProviderHub';
import ServiceProviderDashboard from '@/pages/ServiceProviderDashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleRedirection } from '@/hooks/useRoleRedirection';
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const { redirectToAppropriateApp } = useRoleRedirection();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/') {
      redirectToAppropriateApp();
    }
  }, [user, redirectToAppropriateApp, navigate, location.pathname]);

  return (
    <Routes>
      {/* Service Provider Hub - Protected Route */}
      <Route 
        path="/service-provider-hub" 
        element={
          <ProtectedServiceHubRoute>
            <ServiceProviderHub />
          </ProtectedServiceHubRoute>
        } 
      />
      
      {/* Service Provider Dashboard - Protected Route */}
      <Route 
        path="/services-app" 
        element={
          <ProtectedServiceHubRoute>
            <ServiceProviderDashboard />
          </ProtectedServiceHubRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Sokko Sasa</h1>
            <p className="text-gray-600">Please navigate to the service provider hub to get started.</p>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
