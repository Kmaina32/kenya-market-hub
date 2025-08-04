
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireSuperAdmin?: boolean;
  allowedRoles?: string[];
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  fallback,
  requireSuperAdmin = false,
  allowedRoles = ['admin']
}) => {
  const { user, loading } = useAuth();
  const { checkAdminAccess } = useEnhancedAuth();
  const { logSecurityViolation, logAdminAction } = useSecurityAudit();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [accessAttempts, setAccessAttempts] = useState(0);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      try {
        setAccessAttempts(prev => prev + 1);
        
        const hasAdminAccess = await checkAdminAccess();
        
        if (hasAdminAccess) {
          logAdminAction('admin_panel_access', 'system', user.id);
          setIsAuthorized(true);
        } else {
          // Log unauthorized access attempt
          logSecurityViolation('Unauthorized admin panel access attempt', {
            userId: user.id,
            userEmail: user.email,
            attempts: accessAttempts,
            timestamp: new Date().toISOString()
          });
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
        logSecurityViolation('Admin verification system failure', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: user?.id,
          timestamp: new Date().toISOString()
        });
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    if (!loading) {
      verifyAdminAccess();
    }
  }, [user, loading, checkAdminAccess, logSecurityViolation, logAdminAction, accessAttempts]);

  // Rate limiting for repeated access attempts
  useEffect(() => {
    if (accessAttempts > 3 && !isAuthorized) {
      logSecurityViolation('Excessive admin panel access attempts', {
        attempts: accessAttempts,
        userId: user?.id,
        timestamp: new Date().toISOString(),
        potentialAttack: true
      });
    }
  }, [accessAttempts, isAuthorized, logSecurityViolation, user?.id]);

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

  if (!isAuthorized) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <p className="font-semibold">Access Denied</p>
              <p className="text-sm">Administrator privileges required.</p>
              <p className="text-xs text-red-700">
                This incident has been logged for security review.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};
