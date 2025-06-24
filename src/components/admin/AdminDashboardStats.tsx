
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboardStats = () => {
  // This component now shows legacy placeholder stats
  // The real stats are shown in AdminDashboardOverview
  const legacyStats = [
    {
      title: 'Growth Rate',
      value: '12%',
      change: '+2.5% from last month',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+5.2% from yesterday',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8% from last week',
      icon: ShoppingBag,
      color: 'text-purple-600'
    },
    {
      title: 'Avg. Order Value',
      value: 'KSh 2,150',
      change: '+12% from last month',
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {legacyStats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              {stat.change}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboardStats;
