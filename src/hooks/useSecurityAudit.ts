
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, RateLimiter } from '@/utils/securityEnhancements';

interface SecurityEvent {
  action: string;
  resourceType: string;
  resourceId?: string;
  success?: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

// Create a rate limiter for security events (max 100 events per minute per user)
const rateLimiter = new RateLimiter();

export const useSecurityAudit = () => {
  const logSecurityEvent = useMutation({
    mutationFn: async (event: SecurityEvent) => {
      const user = (await supabase.auth.getUser()).data.user;
      const userId = user?.id;
      
      // Rate limiting check
      if (userId && !rateLimiter.isAllowed(`security-audit-${userId}`, 100, 60000)) {
        console.warn('Security audit rate limit exceeded');
        return;
      }

      // Sanitize inputs
      const sanitizedEvent = {
        ...event,
        action: sanitizeInput.text(event.action),
        resourceType: sanitizeInput.text(event.resourceType),
        resourceId: event.resourceId ? sanitizeInput.text(event.resourceId) : undefined,
        errorMessage: event.errorMessage ? sanitizeInput.text(event.errorMessage) : undefined
      };

      // Enhanced metadata with security information
      const enhancedMetadata = {
        ...sanitizedEvent.metadata,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        session_id: await generateSessionFingerprint()
      };

      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          user_id: userId,
          action: sanitizedEvent.action,
          resource_type: sanitizedEvent.resourceType,
          resource_id: sanitizedEvent.resourceId,
          success: sanitizedEvent.success ?? true,
          error_message: sanitizedEvent.errorMessage,
          metadata: enhancedMetadata
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    }
  });

  // Generate a session fingerprint for tracking
  const generateSessionFingerprint = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    // Hash the fingerprint
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const logFailedLogin = (email: string, reason: string) => {
    logSecurityEvent.mutate({
      action: 'login_failed',
      resourceType: 'auth',
      resourceId: sanitizeInput.email(email),
      success: false,
      errorMessage: reason,
      metadata: { 
        timestamp: new Date().toISOString(),
        failure_reason: sanitizeInput.text(reason)
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
        timestamp: new Date().toISOString()
      }
    });
  };

  const logDataAccess = (resourceType: string, resourceId: string, action: string) => {
    logSecurityEvent.mutate({
      action: `${sanitizeInput.text(action)}_${sanitizeInput.text(resourceType)}`,
      resourceType: sanitizeInput.text(resourceType),
      resourceId: sanitizeInput.text(resourceId),
      success: true
    });
  };

  const logAdminAction = (action: string, resourceType: string, resourceId?: string) => {
    logSecurityEvent.mutate({
      action: `admin_${sanitizeInput.text(action)}`,
      resourceType: sanitizeInput.text(resourceType),
      resourceId: resourceId ? sanitizeInput.text(resourceId) : undefined,
      success: true,
      metadata: { 
        admin: true,
        elevated_privileges: true
      }
    });
  };

  const logSuspiciousActivity = (activity: string, details: Record<string, any>) => {
    logSecurityEvent.mutate({
      action: 'suspicious_activity',
      resourceType: 'security',
      success: false,
      errorMessage: sanitizeInput.text(activity),
      metadata: {
        activity_type: sanitizeInput.text(activity),
        details: details,
        security_flag: true
      }
    });
  };

  return {
    logFailedLogin,
    logSuccessfulLogin,
    logDataAccess,
    logAdminAction,
    logSuspiciousActivity,
    logSecurityEvent: logSecurityEvent.mutate
  };
};
