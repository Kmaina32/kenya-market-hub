
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  ClipboardList, 
  Store, 
  Car, 
  Building, 
  Briefcase,
  DollarSign 
} from 'lucide-react';

const AdminDashboardOverview = () => {
  const { data: stats, isLoading } = useAdminStats();
  const navigate = useNavigate();

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/admin/users'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ClipboardList,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/admin/orders'
    },
    {
      title: 'Products',
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/admin/products'
    },
    {
      title: 'Active Vendors',
      value: stats?.totalVendors || 0,
      icon: Store,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/admin/vendors'
    },
    {
      title: 'Drivers',
      value: stats?.totalDrivers || 0,
      icon: Car,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      path: '/admin/drivers'
    },
    {
      title: 'Properties',
      value: stats?.totalProperties || 0,
      icon: Building,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/admin/properties'
    },
    {
      title: 'Job Postings',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      path: '/admin/jobs'
    },
    {
      title: 'Total Revenue',
      value: `KSh ${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/admin/analytics'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={() => navigate(stat.path)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminDashboardOverview;
