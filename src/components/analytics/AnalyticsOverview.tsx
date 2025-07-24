
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package,
  Car,
  Building,
  DollarSign
} from 'lucide-react';

interface AnalyticsOverviewProps {
  data: {
    totalRevenue: number;
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRides: number;
    totalProperties: number;
    totalVendors: number;
    totalDrivers: number;
    growthMetrics: {
      userGrowth: number;
      revenueGrowth: number;
      orderGrowth: number;
    };
  };
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `KSh ${data.totalRevenue.toLocaleString()}`,
      change: data.growthMetrics.revenueGrowth,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      change: data.growthMetrics.userGrowth,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: data.totalOrders.toLocaleString(),
      change: data.growthMetrics.orderGrowth,
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      title: 'Products',
      value: data.totalProducts.toLocaleString(),
      change: 5.2,
      icon: Package,
      color: 'text-orange-600'
    },
    {
      title: 'Rides',
      value: data.totalRides.toLocaleString(),
      change: 18.5,
      icon: Car,
      color: 'text-indigo-600'
    },
    {
      title: 'Properties',
      value: data.totalProperties.toLocaleString(),
      change: 3.8,
      icon: Building,
      color: 'text-pink-600'
    },
    {
      title: 'Vendors',
      value: data.totalVendors.toLocaleString(),
      change: 12.1,
      icon: Package,
      color: 'text-teal-600'
    },
    {
      title: 'Drivers',
      value: data.totalDrivers.toLocaleString(),
      change: 8.9,
      icon: Car,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        const isPositive = metric.change >= 0;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                  {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
                </Badge>
                <span>vs last period</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsOverview;
