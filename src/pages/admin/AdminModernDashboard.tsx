
import React from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminStats } from '@/hooks/useAdminStats';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminModernDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  const statsCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Products',
      value: stats?.totalProducts || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      color: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `KSh ${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      title: 'Growth Rate',
      value: '12%',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to Sokko Sasa Admin Panel</p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                    className="ml-1 text-xs"
                  >
                    {stat.change} from last month
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">New user registration</p>
                    <p className="text-sm text-gray-600">2 minutes ago</p>
                  </div>
                  <Badge>New</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Product approved</p>
                    <p className="text-sm text-gray-600">15 minutes ago</p>
                  </div>
                  <Badge variant="outline">Approved</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order completed</p>
                    <p className="text-sm text-gray-600">1 hour ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold">56</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue Today</span>
                  <span className="font-semibold">KSh 45,230</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold">3.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminModernDashboard;
