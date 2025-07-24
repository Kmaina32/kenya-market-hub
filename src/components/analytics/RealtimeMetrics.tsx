
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Users, 
  Car, 
  Clock,
  DollarSign
} from 'lucide-react';

interface RealtimeMetricsProps {
  data: {
    activeUsers: number;
    onlineDrivers: number;
    pendingOrders: number;
    todayRevenue: number;
  };
}

const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Active Users',
      value: data.activeUsers,
      icon: Users,
      color: 'text-green-600',
      badge: 'online'
    },
    {
      title: 'Online Drivers',
      value: data.onlineDrivers,
      icon: Car,
      color: 'text-blue-600',
      badge: 'available'
    },
    {
      title: 'Pending Orders',
      value: data.pendingOrders,
      icon: Clock,
      color: 'text-yellow-600',
      badge: 'pending'
    },
    {
      title: 'Today\'s Revenue',
      value: `KSh ${data.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      badge: 'today'
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Real-time Metrics</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {metric.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  <span>Real-time</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RealtimeMetrics;
