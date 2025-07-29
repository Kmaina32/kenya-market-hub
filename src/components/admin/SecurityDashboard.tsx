
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Activity, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

const SecurityDashboard: React.FC = () => {
  const {
    securityMetrics,
    isLoadingMetrics,
    refetchMetrics,
    performSecurityHealthCheck
  } = useSecurityMonitoring();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  useEffect(() => {
    // Refresh metrics every 30 seconds
    const interval = setInterval(() => {
      refetchMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchMetrics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Security Dashboard
          </h1>
          <p className="text-gray-600">Monitor and manage system security</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchMetrics()}
            disabled={isLoadingMetrics}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => performSecurityHealthCheck()}>
            <Activity className="h-4 w-4 mr-2" />
            Health Check
          </Button>
        </div>
      </div>

      {/* Security Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityMetrics?.failed_logins_last_hour || 0}
            </div>
            <p className="text-xs text-gray-600">Last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {securityMetrics?.security_alerts?.length || 0}
            </div>
            <p className="text-xs text-gray-600">Unresolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {securityMetrics?.active_sessions || 0}
            </div>
            <p className="text-xs text-gray-600">Current</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {securityMetrics?.suspicious_activities || 0}
            </div>
            <p className="text-xs text-gray-600">Last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {!securityMetrics?.security_alerts?.length ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p>No security alerts - System is secure</p>
            </div>
          ) : (
            <div className="space-y-4">
              {securityMetrics.security_alerts.slice(0, 10).map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <AlertDescription className="font-medium">
                        {alert.message}
                      </AlertDescription>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">
                        {alert.alert_type}
                      </Badge>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Active Security Measures
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Row-Level Security (RLS) enabled</li>
                <li>• API keys secured with edge functions</li>
                <li>• Real-time security monitoring</li>
                <li>• Enhanced input validation</li>
                <li>• Secure authentication flow</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Best Practices
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Regular security audits</li>
                <li>• Monitor failed login attempts</li>
                <li>• Keep dependencies updated</li>
                <li>• Use strong password policies</li>
                <li>• Enable 2FA for admin accounts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
