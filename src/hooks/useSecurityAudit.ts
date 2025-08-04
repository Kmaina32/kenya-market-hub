
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
  | 'invalid_input_detected';

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
      
      // In a real implementation, this would log to your security audit system
      // For now, we'll just log to console and could extend to send to backend
      
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

  const getClientIP = async (): Promise<string> => {
    try {
      // This is a simple way to get client IP - in production you might want a more robust solution
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  return { logSecurityEvent };
};
