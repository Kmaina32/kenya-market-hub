
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Activity, Clock, TrendingUp, Users, Eye, DollarSign, Package, Car, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdminStatsReal';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import BulkOperations from '@/components/admin/BulkOperations';
import NotificationCenter from '@/components/admin/NotificationCenter';

const ModernAdminDashboard = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (error) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Error loading dashboard data</p>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6 lg:space-y-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-6 lg:p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-orange-100 opacity-90">
                Here's what's happening with Soko Smart today.
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <Link to="/admin/analytics">
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link to="/admin/reports">
                <Button 
                  variant="outline" 
                  className="bg-transparent hover:bg-white/10 text-white border-white/30"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString() || 0}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {stats?.userGrowthPercentage > 0 ? '+' : ''}{stats?.userGrowthPercentage.toFixed(1)}% from last month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${stats?.totalRevenue.toLocaleString() || 0}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {stats?.revenueGrowthPercentage > 0 ? '+' : ''}{stats?.revenueGrowthPercentage.toFixed(1)}% from last month
                    </p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders.toLocaleString() || 0}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {stats?.orderGrowthPercentage > 0 ? '+' : ''}{stats?.orderGrowthPercentage.toFixed(1)}% from last month
                    </p>
                  </div>
                  <div className="p-3 bg-orange-500 rounded-full">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Active listings</p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vendors</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalVendors.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Active vendors</p>
                  </div>
                  <div className="p-3 bg-indigo-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-yellow-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Drivers</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalDrivers.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Registered drivers</p>
                  </div>
                  <div className="p-3 bg-yellow-500 rounded-full">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-teal-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Properties</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalProperties.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Listed properties</p>
                  </div>
                  <div className="p-3 bg-teal-500 rounded-full">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.pendingOrders.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Needs attention</p>
                  </div>
                  <div className="p-3 bg-red-500 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bulk-ops">Bulk Operations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="live">Live Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity and Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Activity */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Latest platform activities</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                      <Eye className="h-4 w-4 mr-1" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/60 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          activity.type === 'order' ? 'bg-green-500' :
                          activity.type === 'user' ? 'bg-blue-500' :
                          activity.type === 'vendor' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used admin actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/admin/users">
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                      >
                        <Users className="h-6 w-6 text-orange-600" />
                        <span className="text-sm font-medium">Manage Users</span>
                      </Button>
                    </Link>
                    
                    <Link to="/admin/products">
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                      >
                        <Package className="h-6 w-6 text-orange-600" />
                        <span className="text-sm font-medium">Products</span>
                      </Button>
                    </Link>
                    
                    <Link to="/admin/orders">
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                      >
                        <Clock className="h-6 w-6 text-orange-600" />
                        <span className="text-sm font-medium">View Orders</span>
                      </Button>
                    </Link>
                    
                    <Link to="/admin/analytics">
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                      >
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                        <span className="text-sm font-medium">Analytics</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="bulk-ops">
            <BulkOperations />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="live">
            <Card>
              <CardHeader>
                <CardTitle>Live Data Stream</CardTitle>
                <CardDescription>Real-time updates and system monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Live data streaming will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModernAdminLayout>
  );
};

export default ModernAdminDashboard;
