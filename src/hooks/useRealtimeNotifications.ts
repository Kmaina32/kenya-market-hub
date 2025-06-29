
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen for vendor approvals
    const vendorChannel = supabase
      .channel('vendor-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'vendors',
          filter: 'verification_status=eq.approved'
        },
        (payload) => {
          toast.success(`Vendor "${payload.new.business_name}" has been approved!`);
          queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .subscribe();

    // Listen for driver approvals
    const driverChannel = supabase
      .channel('driver-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: 'is_verified=eq.true'
        },
        (payload) => {
          toast.success(`Driver has been verified and approved!`);
          queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .subscribe();

    // Listen for new orders
    const orderChannel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          toast.info(`New order received: KSh ${payload.new.total_amount}`);
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .subscribe();

    // Listen for product additions
    const productChannel = supabase
      .channel('product-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          toast.info(`New product added: ${payload.new.name}`);
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .subscribe();

    // Listen for agent approvals
    const agentChannel = supabase
      .channel('agent-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'real_estate_agents',
          filter: 'is_verified=eq.true'
        },
        (payload) => {
          toast.success(`Real estate agent has been verified!`);
          queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(vendorChannel);
      supabase.removeChannel(driverChannel);
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(productChannel);
      supabase.removeChannel(agentChannel);
    };
  }, [queryClient]);
};
