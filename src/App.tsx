import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from 'next-themes'

import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import VendorDashboard from '@/pages/VendorDashboard';
import VendorRegistrationPage from '@/pages/VendorRegistrationPage';
import DriverDashboard from '@/pages/DriverDashboard';
import DriverRegistrationPage from '@/pages/DriverRegistrationPage';
import PropertyOwnerDashboard from '@/pages/PropertyOwnerDashboard';
import PropertyOwnerRegistrationPage from '@/pages/PropertyOwnerRegistrationPage';
import MedicalProviderDashboard from '@/pages/MedicalProviderDashboard';
import MedicalProviderRegistrationPage from '@/pages/MedicalProviderRegistrationPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import UpdatePasswordPage from '@/pages/UpdatePasswordPage';
import ServicesApp from '@/components/ServiceProviderApp';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedVendorRoute from '@/components/ProtectedVendorRoute';
import ProtectedDriverRoute from '@/components/ProtectedDriverRoute';
import ProtectedPropertyOwnerRoute from '@/components/ProtectedPropertyOwnerRoute';
import ProtectedServiceProviderRoute from '@/components/ProtectedServiceProviderRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleRedirect } from '@/components/RoleRedirect';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleRedirection } from '@/hooks/useRoleRedirection';
import { SecurityAuditProvider } from '@/contexts/SecurityAuditContext';
import { Toaster } from "@/components/ui/toaster"
import ProtectedServiceHubRoute from '@/components/ProtectedServiceHubRoute';
import ServiceProviderHub from '@/components/ServiceProviderHub';
import ServiceProviderDashboard from '@/pages/ServiceProviderDashboard';

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SecurityAuditProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
            <Router>
              <AppContent />
            </Router>
            <Toaster />
          </ThemeProvider>
        </SecurityAuditProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
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
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/" element={<HomePage />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Vendor Routes */}
      <Route
        path="/vendor"
        element={
          <ProtectedVendorRoute>
            <VendorDashboard />
          </ProtectedVendorRoute>
        }
      />
      <Route path="/vendor-registration" element={<VendorRegistrationPage />} />

      {/* Driver Routes */}
      <Route
        path="/driver"
        element={
          <ProtectedDriverRoute>
            <DriverDashboard />
          </ProtectedDriverRoute>
        }
      />
      <Route path="/driver-registration" element={<DriverRegistrationPage />} />

      {/* Property Owner Routes */}
      <Route
        path="/property-owner"
        element={
          <ProtectedPropertyOwnerRoute>
            <PropertyOwnerDashboard />
          </ProtectedPropertyOwnerRoute>
        }
      />
      <Route path="/property-owner-registration" element={<PropertyOwnerRegistrationPage />} />

      {/* Medical Provider Routes */}
       <Route path="/medical-provider" element={<MedicalProviderDashboard />} />
      <Route path="/medical-provider-registration" element={<MedicalProviderRegistrationPage />} />

      {/* Service Provider App Routes - Example for Plumber */}
      <Route
        path="/plumber-app"
        element={
          <ProtectedServiceProviderRoute>
            <ServicesApp serviceType="plumber" />
          </ProtectedServiceProviderRoute>
        }
      />

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
            <ProtectedServiceProviderRoute>
              <ServiceProviderDashboard />
            </ProtectedServiceProviderRoute>
          } 
        />
    </Routes>
  );
};

export default AppRoutes;
