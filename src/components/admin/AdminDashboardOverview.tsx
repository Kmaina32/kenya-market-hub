
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, DollarSign, TrendingUp, Calendar, Briefcase, Shield, UtensilsCrossed } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminDashboardOverview = () => {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error loading dashboard statistics</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Products',
      value: stats.totalProducts.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      title: 'Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Restaurants',
      value: stats.totalRestaurants.toLocaleString(),
      icon: UtensilsCrossed,
      color: 'text-red-600'
    },
    {
      title: 'Events',
      value: stats.totalEvents.toLocaleString(),
      icon: Calendar,
      color: 'text-indigo-600'
    },
    {
      title: 'Jobs',
      value: stats.totalJobs.toLocaleString(),
      icon: Briefcase,
      color: 'text-yellow-600'
    },
    {
      title: 'Insurance Plans',
      value: stats.totalInsurancePlans.toLocaleString(),
      icon: Shield,
      color: 'text-cyan-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Live from database
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboardOverview;
