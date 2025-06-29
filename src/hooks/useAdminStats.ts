
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        usersResult,
        ordersResult,
        productsResult,
        vendorsResult,
        driversResult,
        propertiesResult,
        jobsResult,
        revenueResult,
        pendingOrdersResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('vendors').select('id', { count: 'exact', head: true }),
        supabase.from('drivers').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').eq('status', 'completed'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      // Mock growth percentages - in real app these would be calculated from historical data
      const userGrowthPercentage = 12;
      const revenueGrowthPercentage = 8.5;
      const orderGrowthPercentage = 15.2;

      // Mock recent activity data
      const recentActivity = [
        {
          id: '1',
          type: 'order',
          message: 'New order placed by John Doe',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'user',
          message: 'New user registered: Jane Smith',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'vendor',
          message: 'Vendor application approved: Tech Store',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      return {
        totalUsers: usersResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalVendors: vendorsResult.count || 0,
        totalDrivers: driversResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        totalJobs: jobsResult.count || 0,
        totalRevenue,
        pendingOrders: pendingOrdersResult.count || 0,
        userGrowthPercentage,
        revenueGrowthPercentage,
        orderGrowthPercentage,
        recentActivity
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};
