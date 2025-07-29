
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityAudit } from './useSecurityAudit';

interface SecurityAlert {
  id: string;
  user_id: string | null;
  alert_type: 'suspicious_login' | 'multiple_failed_attempts' | 'unusual_activity' | 'potential_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata: Record<string, any>;
  created_at: string;
  resolved: boolean;
}

interface SecurityMetrics {
  failed_logins_last_hour: number;
  active_sessions: number;
  suspicious_activities: number;
  security_alerts: SecurityAlert[];
}

export const useSecurityMonitoring = () => {
  const { logSecurityEvent } = useSecurityAudit();

  // Monitor failed login attempts
  const monitorFailedLogins = useMutation({
    mutationFn: async (email: string) => {
      // Check for multiple failed attempts in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('action', 'login_failed')
        .eq('resource_id', email)
        .gte('created_at', oneHourAgo);

      if (error) throw error;

      const failedAttempts = data?.length || 0;
      
      // Log security event instead of creating alert in non-existent table
      if (failedAttempts >= 5) {
        logSecurityEvent({
          action: 'multiple_failed_attempts',
          resourceType: 'authentication',
          resourceId: email,
          success: false,
          metadata: { 
            email, 
            failed_attempts: failedAttempts,
            severity: 'high',
            message: `${failedAttempts} failed login attempts detected for ${email}`
          }
        });
      }

      return failedAttempts;
    }
  });

  // Get security metrics
  const getSecurityMetrics = useQuery({
    queryKey: ['security-metrics'],
    queryFn: async (): Promise<SecurityMetrics> => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      // Get failed logins in last hour
      const { data: failedLogins } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('action', 'login_failed')
        .gte('created_at', oneHourAgo);

      // Since security_alerts table doesn't exist, we'll create mock alerts from audit log
      const { data: suspiciousActivities } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('success', false)
        .gte('created_at', oneHourAgo)
        .limit(10);

      const mockAlerts: SecurityAlert[] = (suspiciousActivities || []).map((activity, index) => ({
        id: `alert-${activity.id}`,
        user_id: activity.user_id,
        alert_type: 'suspicious_login' as const,
        severity: 'medium' as const,
        message: `Suspicious activity detected: ${activity.action}`,
        metadata: activity.metadata || {},
        created_at: activity.created_at,
        resolved: false
      }));

      return {
        failed_logins_last_hour: failedLogins?.length || 0,
        active_sessions: 0, // Would need session tracking
        suspicious_activities: suspiciousActivities?.length || 0,
        security_alerts: mockAlerts
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: true
  });

  // Monitor suspicious activity patterns
  const detectSuspiciousActivity = useMutation({
    mutationFn: async (activity: {
      userId: string;
      action: string;
      resource: string;
      metadata?: Record<string, any>;
    }) => {
      // Log the activity
      logSecurityEvent({
        action: activity.action,
        resourceType: activity.resource,
        resourceId: activity.userId,
        success: true,
        metadata: {
          ...activity.metadata,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'client-side-detection'
        }
      });

      // Check for suspicious patterns (rapid actions, unusual times, etc.)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data: recentActions } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', activity.userId)
        .eq('action', activity.action)
        .gte('created_at', fiveMinutesAgo);

      // Log security event if more than 20 of the same action in 5 minutes
      if ((recentActions?.length || 0) > 20) {
        logSecurityEvent({
          action: 'unusual_activity_detected',
          resourceType: 'user_behavior',
          resourceId: activity.userId,
          success: false,
          metadata: {
            action: activity.action,
            count: recentActions?.length,
            timeframe: '5_minutes',
            severity: 'medium',
            message: `Unusual activity pattern detected: ${activity.action}`
          }
        });
      }
    }
  });

  // Security health check
  const performSecurityHealthCheck = useMutation({
    mutationFn: async () => {
      const checks = [];

      // Check 1: Recent security events
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .gte('created_at', oneHourAgo);

      checks.push({
        name: 'recent_activity',
        status: (recentEvents?.length || 0) < 1000 ? 'healthy' : 'warning',
        details: `${recentEvents?.length || 0} events in last hour`
      });

      // Check 2: Failed login rate
      const failedLogins = recentEvents?.filter(e => e.action === 'login_failed') || [];
      const failedLoginRate = failedLogins.length;
      
      checks.push({
        name: 'failed_login_rate',
        status: failedLoginRate < 10 ? 'healthy' : failedLoginRate < 50 ? 'warning' : 'critical',
        details: `${failedLoginRate} failed logins in last hour`
      });

      // Check 3: General system health based on error rates
      const errorEvents = recentEvents?.filter(e => e.success === false) || [];
      const errorRate = errorEvents.length;
      
      checks.push({
        name: 'error_rate',
        status: errorRate === 0 ? 'healthy' : errorRate < 50 ? 'warning' : 'critical',
        details: `${errorRate} error events in last hour`
      });

      return {
        overall_status: checks.every(c => c.status === 'healthy') ? 'healthy' : 
                       checks.some(c => c.status === 'critical') ? 'critical' : 'warning',
        checks,
        timestamp: new Date().toISOString()
      };
    }
  });

  return {
    monitorFailedLogins: monitorFailedLogins.mutate,
    detectSuspiciousActivity: detectSuspiciousActivity.mutate,
    performSecurityHealthCheck: performSecurityHealthCheck.mutate,
    securityMetrics: getSecurityMetrics.data,
    isLoadingMetrics: getSecurityMetrics.isLoading,
    refetchMetrics: getSecurityMetrics.refetch
  };
};
