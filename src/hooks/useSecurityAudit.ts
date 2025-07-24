
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  action: string;
  resourceType: string;
  resourceId?: string;
  success?: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export const useSecurityAudit = () => {
  const logSecurityEvent = useMutation({
    mutationFn: async (event: SecurityEvent) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
          .from('security_audit_log')
          .insert({
            user_id: user?.id,
            action: event.action,
            resource_type: event.resourceType,
            resource_id: event.resourceId,
            success: event.success ?? true,
            error_message: event.errorMessage,
            metadata: {
              ...event.metadata,
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              ip_address: await getClientIP()
            }
          });

        if (error) {
          console.error('Failed to log security event:', error);
        }
      } catch (error) {
        console.error('Security audit logging error:', error);
      }
    }
  });

  const logFailedLogin = (email: string, reason: string) => {
    logSecurityEvent.mutate({
      action: 'login_failed',
      resourceType: 'auth',
      resourceId: email,
      success: false,
      errorMessage: reason,
      metadata: { 
        login_method: 'email_password',
        security_level: 'high'
      }
    });
  };

  const logSuccessfulLogin = (userId: string) => {
    logSecurityEvent.mutate({
      action: 'login_success',
      resourceType: 'auth',
      resourceId: userId,
      success: true,
      metadata: {
        login_method: 'email_password',
        security_level: 'normal'
      }
    });
  };

  const logDataAccess = (resourceType: string, resourceId: string, action: string) => {
    logSecurityEvent.mutate({
      action: `${action}_${resourceType}`,
      resourceType,
      resourceId,
      success: true,
      metadata: {
        access_type: 'data_operation',
        security_level: 'medium'
      }
    });
  };

  const logAdminAction = (action: string, resourceType: string, resourceId?: string) => {
    logSecurityEvent.mutate({
      action: `admin_${action}`,
      resourceType,
      resourceId,
      success: true,
      metadata: { 
        admin: true,
        security_level: 'critical'
      }
    });
  };

  const logSecurityViolation = (violation: string, resourceType: string, resourceId?: string) => {
    logSecurityEvent.mutate({
      action: 'security_violation',
      resourceType,
      resourceId,
      success: false,
      errorMessage: violation,
      metadata: {
        violation_type: violation,
        security_level: 'critical'
      }
    });
  };

  const logPasswordChange = (userId: string, success: boolean, reason?: string) => {
    logSecurityEvent.mutate({
      action: 'password_change',
      resourceType: 'auth',
      resourceId: userId,
      success,
      errorMessage: reason,
      metadata: {
        security_level: 'high'
      }
    });
  };

  const logPermissionDenied = (action: string, resourceType: string, resourceId?: string) => {
    logSecurityEvent.mutate({
      action: 'permission_denied',
      resourceType,
      resourceId,
      success: false,
      errorMessage: `Access denied for ${action} on ${resourceType}`,
      metadata: {
        attempted_action: action,
        security_level: 'high'
      }
    });
  };

  return {
    logFailedLogin,
    logSuccessfulLogin,
    logDataAccess,
    logAdminAction,
    logSecurityViolation,
    logPasswordChange,
    logPermissionDenied,
    logSecurityEvent: logSecurityEvent.mutate
  };
};

// Helper function to get client IP (placeholder for actual implementation)
async function getClientIP(): Promise<string> {
  try {
    // In a real implementation, you might use a service like ipapi.co
    // For now, we'll return a placeholder
    return 'client_ip_placeholder';
  } catch {
    return 'unknown';
  }
}
