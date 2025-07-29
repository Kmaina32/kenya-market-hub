
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
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: event.action,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          success: event.success ?? true,
          error_message: event.errorMessage,
          metadata: event.metadata || {}
        });

      if (error) {
        console.error('Failed to log security event:', error);
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
      metadata: { timestamp: new Date().toISOString() }
    });
  };

  const logSuccessfulLogin = (userId: string) => {
    logSecurityEvent.mutate({
      action: 'login_success',
      resourceType: 'auth',
      resourceId: userId,
      success: true
    });
  };

  const logDataAccess = (resourceType: string, resourceId: string, action: string) => {
    logSecurityEvent.mutate({
      action: `${action}_${resourceType}`,
      resourceType,
      resourceId,
      success: true
    });
  };

  const logAdminAction = (action: string, resourceType: string, resourceId?: string) => {
    logSecurityEvent.mutate({
      action: `admin_${action}`,
      resourceType,
      resourceId,
      success: true,
      metadata: { admin: true }
    });
  };

  return {
    logFailedLogin,
    logSuccessfulLogin,
    logDataAccess,
    logAdminAction,
    logSecurityEvent: logSecurityEvent.mutate
  };
};
