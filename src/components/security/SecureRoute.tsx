
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminGuard } from '@/components/ui/AdminGuard';
import { Loader2 } from 'lucide-react';

interface SecureRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export const SecureRoute: React.FC<SecureRouteProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  fallback
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin) {
    return (
      <AdminGuard fallback={fallback}>
        {children}
      </AdminGuard>
    );
  }

  return <>{children}</>;
};
