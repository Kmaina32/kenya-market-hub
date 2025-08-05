
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Package, ShoppingCart, Building, Car, Briefcase, DollarSign, TrendingUp, Store, UserCheck, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminModernDashboard = () => {
  const { user } = useAuth();

  // Fetch comprehensive dashboard statistics with error handling
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      try {
        const [
          { count: usersCount },
          { count: productsCount },
          { count: ordersCount },
          { count: propertiesCount },
          { count: ridesCount },
          { count: serviceProvidersCount },
          { count: vendorsCount },
          { count: driversCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('rides').select('*', { count: 'exact', head: true }),
          supabase.from('service_provider_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('vendors').select('*', { count: 'exact', head: true }),
          supabase.from('drivers').select('*', { count: 'exact', head: true })
        ]);

        return {
          users: usersCount || 0,
          products: productsCount || 0,
          orders: ordersCount || 0,
          properties: propertiesCount || 0,
          rides: ridesCount || 0,
          serviceProviders: serviceProvidersCount || 0,
          vendors: vendorsCount || 0,
          drivers: driversCount || 0,
          revenue: 0,
          pendingApplications: 0,
          pendingApprovals: 0
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        return {
          users: 0,
          products: 0,
          orders: 0,
          properties: 0,
          rides: 0,
          serviceProviders: 0,
          vendors: 0,
          drivers: 0,
          revenue: 0,
          pendingApplications: 0,
          pendingApprovals: 0
        };
      }
    },
    retry: false
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Registered users',
      link: '/admin/users'
    },
    {
      title: 'Products',
      value: stats?.products || 0,
      icon: Package,
      color: 'from-green-500 to-green-600',
      description: 'Active products',
      link: '/admin/products'
    },
    {
      title: 'Orders',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      description: 'Total orders',
      link: '/admin/orders'
    },
    {
      title: 'Properties',
      value: stats?.properties || 0,
      icon: Building,
      color: 'from-orange-500 to-orange-600',
      description: 'Listed properties',
      link: '/admin/properties'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{stat.description}</p>
                {stat.link && (
                  <Link to={stat.link}>
                    <Button variant="outline" size="sm" className="text-xs h-6">
                      Manage
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              E-commerce Management
            </CardTitle>
            <CardDescription>
              Manage products, orders, and vendors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">Oversee your marketplace operations</p>
            <div className="flex gap-2">
              <Link to="/admin/vendors">
                <Button size="sm" variant="outline">Vendors</Button>
              </Link>
              <Link to="/admin/products">
                <Button size="sm" variant="outline">Products</Button>
              </Link>
              <Link to="/admin/orders">
                <Button size="sm" variant="outline">Orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Real Estate Hub
            </CardTitle>
            <CardDescription>
              Properties, agents, and inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">Manage property listings and agents</p>
            <div className="flex gap-2">
              <Link to="/admin/properties">
                <Button size="sm" variant="outline">Properties</Button>
              </Link>
              <Link to="/admin/agents">
                <Button size="sm" variant="outline">Agents</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Transportation & Services
            </CardTitle>
            <CardDescription>
              Rides, drivers, and service providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">Coordinate rides and services</p>
            <div className="flex gap-2">
              <Link to="/admin/drivers">
                <Button size="sm" variant="outline">Drivers</Button>
              </Link>
              <Link to="/admin/service-providers">
                <Button size="sm" variant="outline">Services</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminModernDashboard;
