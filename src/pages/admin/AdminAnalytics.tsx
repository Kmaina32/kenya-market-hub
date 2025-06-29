
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Download, BarChart3, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: async () => {
      const now = new Date();
      const startDate = new Date(now);
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(now.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
      }

      const [ordersData, revenueData, usersData, productsData] = await Promise.all([
        supabase
          .from('orders')
          .select('created_at, total_amount, status')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('orders')
          .select('created_at, total_amount')
          .eq('status', 'completed')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('products')
          .select('created_at, category')
          .gte('created_at', startDate.toISOString())
      ]);

      // Process orders over time
      const ordersByDay = ordersData.data?.reduce((acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const ordersChartData = Object.entries(ordersByDay).map(([date, count]) => ({
        date,
        orders: count
      }));

      // Process revenue over time
      const revenueByDay = revenueData.data?.reduce((acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + Number(order.total_amount);
        return acc;
      }, {} as Record<string, number>) || {};

      const revenueChartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue
      }));

      // Process user registrations
      const usersByDay = usersData.data?.reduce((acc, user) => {
        const date = new Date(user.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const usersChartData = Object.entries(usersByDay).map(([date, users]) => ({
        date,
        users
      }));

      // Process product categories
      const categoryData = productsData.data?.reduce((acc, product) => {
        const category = product.category || 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
        name: category,
        value: count
      }));

      // Calculate summary stats
      const totalOrders = ordersData.data?.length || 0;
      const totalRevenue = revenueData.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const newUsers = usersData.data?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        ordersChartData,
        revenueChartData,
        usersChartData,
        categoryChartData,
        summary: {
          totalOrders,
          totalRevenue,
          newUsers,
          averageOrderValue
        }
      };
    }
  });

  const exportData = () => {
    if (!analytics) return;
    
    const dataToExport = {
      summary: analytics.summary,
      timeRange,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pieColors = ['#f97316', '#ea580c', '#dc2626', '#b91c1c', '#991b1b'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business intelligence and metrics</p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2">Loading analytics...</span>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.summary.totalOrders || 0}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      KSh {(analytics?.summary.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.summary.newUsers || 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-900">
                      KSh {Math.round(analytics?.summary.averageOrderValue || 0).toLocaleString()}
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.ordersChartData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.revenueChartData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.usersChartData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={analytics?.categoryChartData || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analytics?.categoryChartData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
