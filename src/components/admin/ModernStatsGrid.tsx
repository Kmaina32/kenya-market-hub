
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Building, 
  Car, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Store,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalVendors: number;
  totalProperties: number;
  totalDrivers: number;
  totalServiceProviders?: number;
  pendingVendorApplications?: number;
  pendingDriverApprovals?: number;
  pendingServiceProviders?: number;
}

interface ModernStatsGridProps {
  stats: AdminStats | undefined;
  isLoading: boolean;
}

const ModernStatsGrid: React.FC<ModernStatsGridProps> = ({ stats, isLoading }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Registered users',
      link: '/admin/users',
      change: '+12%',
      trend: 'up' as const
    },
    {
      title: 'Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'from-green-500 to-green-600',
      description: 'Active products',
      link: '/admin/products',
      change: '+8%',
      trend: 'up' as const
    },
    {
      title: 'Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      description: 'Total orders',
      link: '/admin/orders',
      change: '+23%',
      trend: 'up' as const
    },
    {
      title: 'Revenue',
      value: `KSh ${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Total revenue',
      link: '/admin/analytics',
      change: '+15%',
      trend: 'up' as const
    },
    {
      title: 'Vendors',
      value: stats?.totalVendors || 0,
      icon: Store,
      color: 'from-orange-500 to-orange-600',
      description: 'Active vendors',
      link: '/admin/vendors',
      change: '+5%',
      trend: 'up' as const
    },
    {
      title: 'Properties',
      value: stats?.totalProperties || 0,
      icon: Building,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Listed properties',
      link: '/admin/properties',
      change: '+18%',
      trend: 'up' as const
    },
    {
      title: 'Drivers',
      value: stats?.totalDrivers || 0,
      icon: Car,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Registered drivers',
      link: '/admin/drivers',
      change: '-2%',
      trend: 'down' as const
    },
    {
      title: 'Service Providers',
      value: stats?.totalServiceProviders || 0,
      icon: Briefcase,
      color: 'from-pink-500 to-pink-600',
      description: 'Active providers',
      link: '/admin/service-providers',
      change: '+7%',
      trend: 'up' as const
    }
  ];

  const alertCards = [
    {
      title: 'Pending Applications',
      value: stats?.pendingVendorApplications || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Vendor applications',
      link: '/admin/vendors',
      urgent: (stats?.pendingVendorApplications || 0) > 0
    },
    {
      title: 'Pending Approvals',
      value: (stats?.pendingDriverApprovals || 0) + (stats?.pendingServiceProviders || 0),
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      description: 'Awaiting approval',
      urgent: ((stats?.pendingDriverApprovals || 0) + (stats?.pendingServiceProviders || 0)) > 0
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      description: 'Monthly growth',
      link: '/admin/analytics'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {alertCards.map((alert) => (
          <Card 
            key={alert.title} 
            className={`group shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
              alert.urgent ? 'ring-2 ring-red-500/20 shadow-red-100' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{alert.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{alert.value}</p>
                  <p className="text-xs text-gray-500">{alert.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${alert.color} ${alert.urgent ? 'animate-pulse' : ''} shadow-lg`}>
                  <alert.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              {alert.link && (
                <Link to={alert.link} className="mt-4 block">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs border-gray-200 hover:bg-gray-50 group-hover:border-gray-300"
                  >
                    View Details
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className="group shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{stat.description}</p>
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              {stat.link && (
                <Link to={stat.link} className="mt-4 block">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs border-gray-200 hover:bg-gray-50 group-hover:border-gray-300"
                  >
                    Manage
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModernStatsGrid;
