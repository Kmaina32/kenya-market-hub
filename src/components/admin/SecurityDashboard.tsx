
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, Lock, Activity } from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const { data: securityEvents, isLoading } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to fetch security events:', error);
        return [];
      }

      return data || [];
    }
  });

  const { data: securityStats } = useQuery({
    queryKey: ['security-stats'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: failedLogins } = await supabase
        .from('security_audit_log')
        .select('id', { count: 'exact', head: true })
        .eq('action', 'login_failed')
        .gte('created_at', today.toISOString());

      const { data: adminActions } = await supabase
        .from('security_audit_log')
        .select('id', { count: 'exact', head: true })
        .like('action', 'admin_%')
        .gte('created_at', today.toISOString());

      const { data: totalEvents } = await supabase
        .from('security_audit_log')
        .select('id', { count: 'exact', head: true });

      return {
        failedLogins: failedLogins || 0,
        adminActions: adminActions || 0,
        totalEvents: totalEvents || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const criticalEvents = securityEvents?.filter(event => 
    !event.success || event.action === 'login_failed'
  ) || [];

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
            <div className="text-2xl font-bold text-red-600">
              {securityStats?.failedLogins || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions (24h)</CardTitle>
            <Lock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {securityStats?.adminActions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Security Events</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {securityStats?.totalEvents || 0}
            </div>
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

      {criticalEvents.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {criticalEvents.length} security events require attention in the last 24 hours.
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
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={event.success ? 'default' : 'destructive'}>
                      {event.action}
                    </Badge>
                    <span className="text-sm text-gray-600">{event.resource_type}</span>
                    {event.resource_id && (
                      <span className="text-xs text-gray-500">{event.resource_id}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!event.success && event.error_message && (
                      <span className="text-xs text-red-500 max-w-xs truncate">
                        {event.error_message}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No security events recorded yet.</p>
                <p className="text-sm">Events will appear here once security logging is active.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
