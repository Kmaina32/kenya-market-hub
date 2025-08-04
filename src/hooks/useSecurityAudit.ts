
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  action: string;
  resourceType: string;
  resourceId?: string;
  success?: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  userAgent?: string;
}

export const useSecurityAudit = () => {
  const logSecurityEvent = useMutation({
    mutationFn: async (event: SecurityEvent) => {
      const user = (await supabase.auth.getUser()).data.user;
      
      // Get client information for security context
      const clientInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          user_id: user?.id || null,
          action: event.action,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          success: event.success ?? true,
          error_message: event.errorMessage,
          metadata: {
            ...event.metadata,
            ...clientInfo,
            severity: event.severity || 'medium'
          }
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    }
  });

  const logFailedLogin = (email: string, reason: string, attempts: number = 1) => {
    logSecurityEvent.mutate({
      action: 'login_failed',
      resourceType: 'auth',
      resourceId: email,
      success: false,
      errorMessage: reason,
      severity: attempts > 3 ? 'high' : 'medium',
      metadata: { 
        attempts,
        timestamp: new Date().toISOString(),
        potentialBruteForce: attempts > 5
      }
    });
  };

  const logSuccessfulLogin = (userId: string) => {
    logSecurityEvent.mutate({
      action: 'login_success',
      resourceType: 'auth',
      resourceId: userId,
      success: true,
      severity: 'low'
    });
  };

  const logDataAccess = (resourceType: string, resourceId: string, action: string) => {
    logSecurityEvent.mutate({
      action: `${action}_${resourceType}`,
      resourceType,
      resourceId,
      success: true,
      severity: 'low'
    });
  };

  const logAdminAction = (action: string, resourceType: string, resourceId?: string) => {
    logSecurityEvent.mutate({
      action: `admin_${action}`,
      resourceType,
      resourceId,
      success: true,
      severity: 'high',
      metadata: { admin: true, requiresReview: true }
    });
  };

  const logSecurityViolation = (violation: string, details?: Record<string, any>) => {
    logSecurityEvent.mutate({
      action: 'security_violation',
      resourceType: 'system',
      success: false,
      errorMessage: violation,
      severity: 'critical',
      metadata: {
        ...details,
        requiresImediateAttention: true,
        timestamp: new Date().toISOString()
      }
    });
  };

  const logSuspiciousActivity = (activity: string, context?: Record<string, any>) => {
    logSecurityEvent.mutate({
      action: 'suspicious_activity',
      resourceType: 'system',
      success: false,
      errorMessage: activity,
      severity: 'high',
      metadata: {
        ...context,
        flaggedForReview: true,
        timestamp: new Date().toISOString()
      }
    });
  };

  return {
    logFailedLogin,
    logSuccessfulLogin,
    logDataAccess,
    logAdminAction,
    logSecurityViolation,
    logSuspiciousActivity,
    logSecurityEvent: logSecurityEvent.mutate
  };
};
