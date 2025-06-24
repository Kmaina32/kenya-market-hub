
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalRestaurants: number;
  totalEvents: number;
  totalJobs: number;
  totalInsurancePlans: number;
  totalVendors: number;
  totalProperties: number;
  totalDrivers: number;
  totalServiceProviders: number;
  pendingVendorApplications: number;
  pendingDriverApprovals: number;
  pendingServiceProviders: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalRestaurants: 0,
    totalEvents: 0,
    totalJobs: 0,
    totalInsurancePlans: 0,
    totalVendors: 0,
    totalProperties: 0,
    totalDrivers: 0,
    totalServiceProviders: 0,
    pendingVendorApplications: 0,
    pendingDriverApprovals: 0,
    pendingServiceProviders: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [
        profilesResult,
        productsResult,
        ordersResult,
        restaurantsResult,
        eventsResult,
        jobsResult,
        insuranceResult,
        vendorsResult,
        propertiesResult,
        driversResult,
        serviceProvidersResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
        supabase.from('restaurants').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('insurance_plans').select('id', { count: 'exact', head: true }),
        supabase.from('vendors').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('drivers').select('id', { count: 'exact', head: true }),
        supabase.from('service_provider_profiles').select('id', { count: 'exact', head: true })
      ]);

      // Calculate total revenue
      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      // Get pending applications
      const [vendorAppsResult, driverAppsResult, serviceAppsResult] = await Promise.all([
        supabase.from('vendor_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('drivers').select('id', { count: 'exact', head: true }).eq('is_verified', false),
        supabase.from('service_provider_profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending')
      ]);

      setStats({
        totalUsers: profilesResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.data?.length || 0,
        totalRevenue,
        totalRestaurants: restaurantsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalJobs: jobsResult.count || 0,
        totalInsurancePlans: insuranceResult.count || 0,
        totalVendors: vendorsResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        totalDrivers: driversResult.count || 0,
        totalServiceProviders: serviceProvidersResult.count || 0,
        pendingVendorApplications: vendorAppsResult.count || 0,
        pendingDriverApprovals: driverAppsResult.count || 0,
        pendingServiceProviders: serviceAppsResult.count || 0,
        recentActivity: [] // Will be populated with real activity data later
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
