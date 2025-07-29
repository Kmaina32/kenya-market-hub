
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
      
      // Create alert if more than 5 failed attempts in an hour
      if (failedAttempts >= 5) {
        const { error: alertError } = await supabase
          .from('security_alerts')
          .insert({
            user_id: null,
            alert_type: 'multiple_failed_attempts',
            severity: 'high',
            message: `${failedAttempts} failed login attempts detected for ${email}`,
            metadata: { email, failed_attempts: failedAttempts }
          });

        if (alertError) {
          console.error('Failed to create security alert:', alertError);
        }
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

      // Get active security alerts
      const { data: alerts } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      return {
        failed_logins_last_hour: failedLogins?.length || 0,
        active_sessions: 0, // Would need session tracking
        suspicious_activities: 0, // Would need activity analysis
        security_alerts: (alerts || []) as SecurityAlert[]
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

      // Alert if more than 20 of the same action in 5 minutes
      if ((recentActions?.length || 0) > 20) {
        const { error: alertError } = await supabase
          .from('security_alerts')
          .insert({
            user_id: activity.userId,
            alert_type: 'unusual_activity',
            severity: 'medium',
            message: `Unusual activity pattern detected: ${activity.action}`,
            metadata: {
              action: activity.action,
              count: recentActions?.length,
              timeframe: '5_minutes'
            }
          });

        if (alertError) {
          console.error('Failed to create security alert:', alertError);
        }
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

      // Check 3: Unresolved security alerts
      const { data: unresolvedAlerts } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false);

      const criticalAlerts = unresolvedAlerts?.filter(a => a.severity === 'critical').length || 0;
      
      checks.push({
        name: 'unresolved_alerts',
        status: criticalAlerts === 0 ? 'healthy' : 'critical',
        details: `${unresolvedAlerts?.length || 0} unresolved alerts (${criticalAlerts} critical)`
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
