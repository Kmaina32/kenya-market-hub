
export type SecurityEvent = 
  | 'login_attempt' 
  | 'login_success' 
  | 'login_failure' 
  | 'logout' 
  | 'session_warning' 
  | 'session_timeout' 
  | 'password_change' 
  | 'profile_update' 
  | 'admin_access' 
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'invalid_input_detected'
  | 'security_violation'
  | 'admin_action';

export interface SecurityAuditLog {
  id: string;
  user_id?: string;
  event: SecurityEvent;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export const useSecurityAudit = () => {
  const logSecurityEvent = async (
    event: SecurityEvent, 
    details: Record<string, any> = {}
  ) => {
    try {
      console.log(`Security Event: ${event}`, details);
      
      const auditLog: Omit<SecurityAuditLog, 'id'> = {
        event,
        details,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      
      // Could send to backend security service here
      // await supabase.from('security_audit_logs').insert(auditLog);
      
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  // Specific helper methods for common security events
  const logSecurityViolation = async (message: string, details: Record<string, any> = {}) => {
    await logSecurityEvent('security_violation', { message, ...details });
  };

  const logAdminAction = async (action: string, resource: string, userId?: string) => {
    await logSecurityEvent('admin_action', { action, resource, userId });
  };

  const logFailedLogin = async (email: string, error: string) => {
    await logSecurityEvent('login_failure', { email, error });
  };

  const logSuccessfulLogin = async (userId: string) => {
    await logSecurityEvent('login_success', { userId });
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  return { 
    logSecurityEvent,
    logSecurityViolation,
    logAdminAction,
    logFailedLogin,
    logSuccessfulLogin
  };
};
