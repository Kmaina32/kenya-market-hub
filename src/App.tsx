import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { applySecurityHeaders } from '@/utils/securityConfig';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import ProfilePage from '@/pages/ProfilePage';
import ResetPassword from '@/pages/ResetPassword';
import TermsAndConditions from '@/pages/TermsAndConditions';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import { SecureRoute } from '@/components/security/SecureRoute';
import AdminDashboard from '@/pages/AdminDashboard';
import { SecurityProvider } from '@/components/security/SecurityProvider';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Apply security headers on app initialization
    applySecurityHeaders();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SecurityProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={
                  <SecureRoute requireAuth={true}>
                    <ProfilePage />
                  </SecureRoute>
                } />
                <Route path="/admin" element={
                  <SecureRoute requireAuth={true} requireAdmin={true}>
                    <AdminDashboard />
                  </SecureRoute>
                } />
              </Routes>
            </BrowserRouter>
          </SecurityProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
