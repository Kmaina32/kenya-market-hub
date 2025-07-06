
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

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      // Already in correct format
    } else if (cleaned.startsWith('+254')) {
      cleaned = cleaned.substring(1);
    } else if (cleaned.length === 9) {
      // Assume it's missing country code
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  const initiatePayment = async ({ phoneNumber, amount, orderId }: MpesaPaymentParams): Promise<MpesaPaymentResult> => {
    setIsProcessing(true);
    
    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Validate phone number
      if (!formattedPhone.startsWith('254') || formattedPhone.length !== 12) {
        throw new Error('Invalid phone number format. Please use format: 0712345678 or 254712345678');
      }

      // Validate amount
      if (amount < 1) {
        throw new Error('Amount must be at least KSh 1');
      }

      console.log('Initiating M-Pesa payment:', { formattedPhone, amount, orderId });

      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          phoneNumber: formattedPhone,
          amount: Math.round(amount), // Ensure amount is an integer
          orderId: orderId
        }
      });

      console.log('M-Pesa response:', { data, error });

      if (error) {
        console.error('M-Pesa function error:', error);
        throw new Error(error.message || 'Payment initiation failed');
      }

      if (data && data.success) {
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
        const errorMessage = data?.error || 'Payment failed';
        console.error('M-Pesa payment failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      
      let errorMessage = 'Unable to process M-Pesa payment. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (checkoutRequestId: string) => {
    try {
      console.log('Checking payment status for:', checkoutRequestId);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('status, payment_data')
        .eq('transaction_id', checkoutRequestId)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        return { status: 'unknown' };
      }

      console.log('Payment status:', data);
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
