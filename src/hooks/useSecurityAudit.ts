
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
      const { error } = await supabase.rpc('log_security_event', {
        p_action: event.action,
        p_resource_type: event.resourceType,
        p_resource_id: event.resourceId || null,
        p_success: event.success ?? true,
        p_error_message: event.errorMessage || null,
        p_metadata: event.metadata ? JSON.stringify(event.metadata) : null
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
