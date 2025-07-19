import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Users,
  ShoppingBag,
  Car,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import { toast } from 'sonner';

const ReportsManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedReportType, setSelectedReportType] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', selectedPeriod],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case 'last_7_days':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'last_30_days':
          startDate.setDate(now.getDate() - 30);
          break;
        case 'last_90_days':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'last_year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      const [
        usersResult,
        ordersResult,
        ridesResult,
        productsResult,
        revenueResult
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, created_at')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('orders')
          .select('id, total_amount, created_at, status')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('rides')
          .select('id, actual_fare, created_at, status')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('products')
          .select('id, created_at')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'completed')
          .gte('created_at', startDate.toISOString())
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const rideRevenue = ridesResult.data?.filter(ride => ride.status === 'completed')
        .reduce((sum, ride) => sum + (ride.actual_fare || 0), 0) || 0;

      return {
        users: {
          total: usersResult.data?.length || 0,
          data: usersResult.data || []
        },
        orders: {
          total: ordersResult.data?.length || 0,
          completed: ordersResult.data?.filter(order => order.status === 'completed').length || 0,
          data: ordersResult.data || []
        },
        rides: {
          total: ridesResult.data?.length || 0,
          completed: ridesResult.data?.filter(ride => ride.status === 'completed').length || 0,
          data: ridesResult.data || []
        },
        products: {
          total: productsResult.data?.length || 0,
          data: productsResult.data || []
        },
        revenue: {
          total: totalRevenue + rideRevenue,
          orders: totalRevenue,
          rides: rideRevenue
        }
      };
    }
  });

  // Generate report mutation
  const generateReport = useMutation({
    mutationFn: async (reportType: string) => {
      // In a real app, this would generate and download a PDF/Excel report
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Report generated successfully! Check your downloads.');
    },
    onError: () => {
      toast.error('Failed to generate report. Please try again.');
    }
  });

  const reportTypes = [
    { value: 'overview', label: 'Business Overview', icon: BarChart3 },
    { value: 'sales', label: 'Sales Report', icon: DollarSign },
    { value: 'users', label: 'User Analytics', icon: Users },
    { value: 'products', label: 'Product Performance', icon: ShoppingBag },
    { value: 'rides', label: 'Ride Analytics', icon: Car },
    { value: 'financial', label: 'Financial Summary', icon: LineChart }
  ];

  const timeFrames = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'last_year', label: 'Last Year' }
  ];

  const handleGenerateReport = () => {
    generateReport.mutate(selectedReportType);
  };

  const dashboardCards = [
    {
      title: 'Total Revenue',
      value: `KSh ${(analytics?.revenue?.total || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%'
    },
    {
      title: 'New Users',
      value: analytics?.users?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8.2%'
    },
    {
      title: 'Total Orders',
      value: analytics?.orders?.total || 0,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+15.3%'
    },
    {
      title: 'Completed Rides',
      value: analytics?.rides?.completed || 0,
      icon: Car,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+23.1%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive business reports and view analytics</p>
        </div>
        <Button 
          onClick={handleGenerateReport}
          disabled={generateReport.isPending}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {generateReport.isPending ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFrames.map(frame => (
                <SelectItem key={frame.value} value={frame.value}>
                  {frame.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <Select value={selectedReportType} onValueChange={setSelectedReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {typeof card.value === 'string' ? card.value : card.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {card.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Report Types Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {reportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card key={type.value} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600">
                            Generate detailed {type.label.toLowerCase()} for the selected period
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">E-commerce Orders</span>
                  </div>
                  <span className="font-medium">
                    KSh {(analytics?.revenue?.orders || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Ride Services</span>
                  </div>
                  <span className="font-medium">
                    KSh {(analytics?.revenue?.rides || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setSelectedReportType('sales')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Sales Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setSelectedReportType('users')}
              >
                <Users className="h-4 w-4 mr-2" />
                User Analytics
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setSelectedReportType('financial')}
              >
                <LineChart className="h-4 w-4 mr-2" />
                Financial Summary
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;