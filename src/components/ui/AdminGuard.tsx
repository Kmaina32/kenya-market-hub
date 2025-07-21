
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuth();
  const { checkAdminAccess } = useEnhancedAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        const hasAdminAccess = await checkAdminAccess();
        setIsAdmin(hasAdminAccess);
      } catch (error) {
        console.error('Admin verification failed:', error);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    if (!loading) {
      verifyAdminAccess();
    }
  }, [user, loading, checkAdminAccess]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <span className="text-gray-600">Verifying admin access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Alert className="max-w-md border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Authentication required. Please log in to continue.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Access denied. Administrator privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};
