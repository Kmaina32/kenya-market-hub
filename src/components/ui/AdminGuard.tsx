
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Verifying access...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert className="m-4">
        <AlertDescription>
          Authentication required. Please log in to continue.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return fallback || (
      <Alert className="m-4">
        <AlertDescription>
          Access denied. Administrator privileges required.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
