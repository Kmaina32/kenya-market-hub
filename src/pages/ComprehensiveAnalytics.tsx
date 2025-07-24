
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useAnalytics } from '@/hooks/useAnalytics';
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import RealtimeMetrics from '@/components/analytics/RealtimeMetrics';
import LoadingSpinner from '@/components/LoadingSpinner';

const ComprehensiveAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { data: analytics, isLoading, refetch } = useAnalytics(timeRange);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as '7d' | '30d' | '90d' | '1y');
  };

  const handleExportData = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <ProtectedAdminRoute>
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
            <span className="ml-2">Loading analytics...</span>
          </div>
        </ProtectedAdminRoute>
      </MainLayout>
    );
  }

  if (!analytics) {
    return (
      <MainLayout>
        <ProtectedAdminRoute>
          <div className="text-center py-12">
            <p className="text-gray-600">No analytics data available</p>
          </div>
        </ProtectedAdminRoute>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProtectedAdminRoute>
        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BarChart3 className="h-6 w-6" />
                    Comprehensive Analytics Dashboard
                  </CardTitle>
                  <p className="text-blue-100 mt-2">
                    Advanced insights and metrics for your business performance
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="text-blue-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportData}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Real-time Metrics */}
          <RealtimeMetrics data={analytics.realtimeMetrics} />

          {/* Main Analytics */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AnalyticsOverview data={analytics} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Revenue Growth</h4>
                      <p className="text-sm text-blue-700">
                        Revenue increased by {analytics.growthMetrics.revenueGrowth}% 
                        compared to the previous period
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">User Acquisition</h4>
                      <p className="text-sm text-green-700">
                        {analytics.growthMetrics.userGrowth}% increase in new users 
                        shows strong market adoption
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900">Order Volume</h4>
                      <p className="text-sm text-purple-700">
                        Order volume grew by {analytics.growthMetrics.orderGrowth}% 
                        indicating increased engagement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <AnalyticsCharts data={analytics.chartData} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Average Order Value</span>
                        <Badge variant="outline">
                          KSh {(analytics.totalRevenue / analytics.totalOrders || 0).toFixed(0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Revenue per User</span>
                        <Badge variant="outline">
                          KSh {(analytics.totalRevenue / analytics.totalUsers || 0).toFixed(0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Orders per User</span>
                        <Badge variant="outline">
                          {(analytics.totalOrders / analytics.totalUsers || 0).toFixed(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Drivers</span>
                        <Badge variant="outline">
                          {analytics.realtimeMetrics.onlineDrivers}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Cities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.chartData.geographicData.map((city, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{city.city}</p>
                            <p className="text-sm text-gray-600">
                              {city.users} users • {city.orders} orders
                            </p>
                          </div>
                          <Badge variant="secondary">
                            KSh {city.revenue.toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Sales Report</h4>
                      <p className="text-sm text-gray-600">Detailed sales analytics</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">User Report</h4>
                      <p className="text-sm text-gray-600">User behavior analysis</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Financial Report</h4>
                      <p className="text-sm text-gray-600">Revenue and profit analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ProtectedAdminRoute>
    </MainLayout>
  );
};

export default ComprehensiveAnalytics;
