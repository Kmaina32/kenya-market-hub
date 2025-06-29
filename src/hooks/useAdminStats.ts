
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const [
          { count: totalUsers },
          { count: totalOrders },
          { count: totalProducts },
          { count: totalVendors },
          { count: totalDrivers },
          { count: totalProperties },
          { count: pendingOrders }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('vendors').select('*', { count: 'exact', head: true }),
          supabase.from('drivers').select('*', { count: 'exact', head: true }),
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ]);

        // Mock recent activity data
        const recentActivity = [
          {
            id: '1',
            type: 'order',
            message: 'New order received from customer',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'user',
            message: 'New user registered',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            type: 'vendor',
            message: 'Vendor application submitted',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ];

        return {
          totalUsers: totalUsers || 0,
          totalOrders: totalOrders || 0,
          totalProducts: totalProducts || 0,
          totalVendors: totalVendors || 0,
          totalDrivers: totalDrivers || 0,
          totalProperties: totalProperties || 0,
          pendingOrders: pendingOrders || 0,
          totalRevenue: 125000,
          userGrowthPercentage: 12.5,
          orderGrowthPercentage: 8.3,
          revenueGrowthPercentage: 15.2,
          recentActivity
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        return {
          totalUsers: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalVendors: 0,
          totalDrivers: 0,
          totalProperties: 0,
          pendingOrders: 0,
          totalRevenue: 0,
          userGrowthPercentage: 0,
          orderGrowthPercentage: 0,
          revenueGrowthPercentage: 0,
          recentActivity: []
        };
      }
    },
    retry: 1
  });
};
