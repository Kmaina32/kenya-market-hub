
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  order_id: string;
  payment_method: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_data?: any;
  created_at: string;
  updated_at: string;
}

export const useTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          orders!inner(user_id)
        `)
        .eq('orders.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      return data as Transaction[];
    },
    enabled: !!user
  });
};

export const useCreateTransaction = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: {
      order_id: string;
      payment_method: string;
      amount: number;
      transaction_id?: string;
      payment_data?: any;
    }) => {
      console.log('Creating transaction:', transactionData);
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
      
      console.log('Transaction created successfully:', data);
      return data as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Payment Processing',
        description: 'Your payment is being processed.',
      });
    },
    onError: (error) => {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTransactionStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, transaction_id }: { 
      id: string; 
      status: Transaction['status'];
      transaction_id?: string;
    }) => {
      console.log('Updating transaction status:', id, status);
      const { data, error } = await supabase
        .from('transactions')
        .update({ 
          status,
          transaction_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        throw error;
      }
      
      console.log('Transaction updated successfully:', data);
      return data as Transaction;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Payment Updated',
        description: `Payment status updated to ${data.status}.`,
      });
    },
    onError: (error) => {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Update Error',
        description: 'Failed to update payment status.',
        variant: 'destructive',
      });
    },
  });
};
