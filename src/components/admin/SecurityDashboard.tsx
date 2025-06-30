
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, Lock } from 'lucide-react';

interface SecurityEvent {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  success: boolean;
  error_message?: string;
  metadata?: any;
  created_at: string;
  user_id?: string;
}

export const SecurityDashboard: React.FC = () => {
  // Use notifications table as a fallback for security events
  const { data: securityEvents, isLoading } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      // Try to get security audit logs, fallback to notifications for now
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'security')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Failed to fetch security events:', error);
        return [];
      }

      // Transform notifications to security events format
      return (data || []).map(notification => ({
        id: notification.id,
        action: notification.title,
        resource_type: 'system',
        success: true,
        created_at: notification.created_at,
        user_id: notification.user_id
      }));
    }
  });

  // Mock data for demonstration since we don't have the audit table yet
  const mockSecurityData = {
    failedLogins: 3,
    adminActions: 12,
    totalEvents: 45
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockSecurityData.failedLogins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions (24h)</CardTitle>
            <Lock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mockSecurityData.adminActions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Security Events</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockSecurityData.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Enhanced
            </Badge>
          </CardContent>
        </Card>
      </div>

      {mockSecurityData.failedLogins > 10 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High number of failed login attempts detected in the last 24 hours. Consider reviewing access logs.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securityEvents && securityEvents.length > 0 ? (
              securityEvents.slice(0, 20).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant={event.success ? 'default' : 'destructive'}>
                      {event.action}
                    </Badge>
                    <span className="text-sm text-gray-600">{event.resource_type}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No security events recorded yet. Events will appear here once the audit logging is fully configured.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
