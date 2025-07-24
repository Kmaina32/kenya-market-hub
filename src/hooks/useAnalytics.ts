
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
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
  chartData: {
    salesTrend: Array<{
      date: string;
      revenue: number;
      orders: number;
      rides: number;
    }>;
    categoryDistribution: Array<{
      category: string;
      value: number;
      percentage: number;
    }>;
    userActivity: Array<{
      hour: number;
      users: number;
      orders: number;
    }>;
    geographicData: Array<{
      city: string;
      users: number;
      orders: number;
      revenue: number;
    }>;
  };
  realtimeMetrics: {
    activeUsers: number;
    onlineDrivers: number;
    pendingOrders: number;
    todayRevenue: number;
  };
}

export const useAnalytics = (timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
  return useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const now = new Date();
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Fetch all data in parallel
      const [
        usersResult,
        ordersResult,
        productsResult,
        ridesResult,
        propertiesResult,
        vendorsResult,
        driversResult,
        transactionsResult
      ] = await Promise.all([
        supabase.from('profiles').select('id, created_at'),
        supabase.from('orders').select('id, total_amount, created_at, status'),
        supabase.from('products').select('id, category, created_at'),
        supabase.from('rides').select('id, actual_fare, created_at, status'),
        supabase.from('properties').select('id, created_at'),
        supabase.from('vendors').select('id, created_at'),
        supabase.from('drivers').select('id, created_at, status'),
        supabase.from('transactions').select('amount, created_at, status')
      ]);

      // Calculate totals
      const totalUsers = usersResult.data?.length || 0;
      const totalOrders = ordersResult.data?.length || 0;
      const totalProducts = productsResult.data?.length || 0;
      const totalRides = ridesResult.data?.length || 0;
      const totalProperties = propertiesResult.data?.length || 0;
      const totalVendors = vendorsResult.data?.length || 0;
      const totalDrivers = driversResult.data?.length || 0;

      // Calculate revenue
      const totalRevenue = [
        ...(ordersResult.data?.map(o => o.total_amount) || []),
        ...(ridesResult.data?.map(r => r.actual_fare) || []),
        ...(transactionsResult.data?.map(t => t.amount) || [])
      ].reduce((sum, amount) => sum + (Number(amount) || 0), 0);

      // Generate sales trend data
      const salesTrend = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = ordersResult.data?.filter(order => 
          order.created_at.startsWith(dateStr)
        ) || [];
        
        const dayRides = ridesResult.data?.filter(ride => 
          ride.created_at.startsWith(dateStr)
        ) || [];
        
        const dayRevenue = [
          ...dayOrders.map(o => o.total_amount),
          ...dayRides.map(r => r.actual_fare)
        ].reduce((sum, amount) => sum + (Number(amount) || 0), 0);

        return {
          date: dateStr,
          revenue: dayRevenue,
          orders: dayOrders.length,
          rides: dayRides.length
        };
      });

      // Generate category distribution
      const categoryCount: { [key: string]: number } = {};
      productsResult.data?.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      });

      const categoryDistribution = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        value: count,
        percentage: (count / totalProducts) * 100
      }));

      // Generate user activity data (mock hourly data)
      const userActivity = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        users: Math.floor(Math.random() * 100) + 20,
        orders: Math.floor(Math.random() * 50) + 5
      }));

      // Generate geographic data (mock data)
      const geographicData = [
        { city: 'Nairobi', users: Math.floor(totalUsers * 0.4), orders: Math.floor(totalOrders * 0.45), revenue: totalRevenue * 0.5 },
        { city: 'Mombasa', users: Math.floor(totalUsers * 0.2), orders: Math.floor(totalOrders * 0.18), revenue: totalRevenue * 0.2 },
        { city: 'Kisumu', users: Math.floor(totalUsers * 0.15), orders: Math.floor(totalOrders * 0.12), revenue: totalRevenue * 0.15 },
        { city: 'Nakuru', users: Math.floor(totalUsers * 0.1), orders: Math.floor(totalOrders * 0.1), revenue: totalRevenue * 0.1 },
        { city: 'Others', users: Math.floor(totalUsers * 0.15), orders: Math.floor(totalOrders * 0.15), revenue: totalRevenue * 0.05 }
      ];

      // Calculate growth metrics (mock data)
      const growthMetrics = {
        userGrowth: 12.5,
        revenueGrowth: 8.3,
        orderGrowth: 15.2
      };

      // Realtime metrics
      const realtimeMetrics = {
        activeUsers: Math.floor(totalUsers * 0.05),
        onlineDrivers: driversResult.data?.filter(d => d.status === 'available').length || 0,
        pendingOrders: ordersResult.data?.filter(o => o.status === 'pending').length || 0,
        todayRevenue: salesTrend[salesTrend.length - 1]?.revenue || 0
      };

      return {
        totalRevenue,
        totalUsers,
        totalOrders,
        totalProducts,
        totalRides,
        totalProperties,
        totalVendors,
        totalDrivers,
        growthMetrics,
        chartData: {
          salesTrend,
          categoryDistribution,
          userActivity,
          geographicData
        },
        realtimeMetrics
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
