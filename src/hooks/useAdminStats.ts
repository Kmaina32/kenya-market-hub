
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
        revenueResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('vendors').select('id', { count: 'exact', head: true }),
        supabase.from('drivers').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').eq('status', 'completed')
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      // Calculate growth percentage (mock for now)
      const userGrowthPercentage = 12; // This would be calculated based on previous period

      return {
        totalUsers: usersResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalVendors: vendorsResult.count || 0,
        totalDrivers: driversResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        totalJobs: jobsResult.count || 0,
        totalRevenue,
        userGrowthPercentage
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};
