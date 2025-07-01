
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MpesaPaymentParams {
  phoneNumber: string;
  amount: number;
  orderId: string;
}

interface MpesaPaymentResult {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  error?: string;
}

export const useMpesaPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async ({ phoneNumber, amount, orderId }: MpesaPaymentParams): Promise<MpesaPaymentResult> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          phoneNumber,
          amount,
          orderId
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment initiation failed');
      }

      if (data.success) {
        toast({
          title: "Payment Request Sent",
          description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
        });

        return {
          success: true,
          checkoutRequestId: data.checkoutRequestId,
          merchantRequestId: data.merchantRequestId
        };
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      
      toast({
        title: "Payment Failed",
        description: error.message || 'Unable to process M-Pesa payment. Please try again.',
        variant: "destructive"
      });

      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (checkoutRequestId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('status, payment_data')
        .eq('transaction_id', checkoutRequestId)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        return { status: 'unknown' };
      }

      return { 
        status: data.status,
        paymentData: data.payment_data 
      };
    } catch (error) {
      console.error('Payment status check failed:', error);
      return { status: 'unknown' };
    }
  };

  return {
    initiatePayment,
    checkPaymentStatus,
    isProcessing
  };
};
