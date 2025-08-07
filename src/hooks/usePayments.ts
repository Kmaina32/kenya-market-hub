
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingInfo?: {
    address: string;
    city: string;
    phone: string;
    email: string;
  };
}

export const useMpesaPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paymentData: PaymentData & { phoneNumber: string }) => {
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          phoneNumber: paymentData.phoneNumber,
          amount: paymentData.amount,
          orderId: paymentData.orderId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Payment Request Sent",
        description: "Please check your phone and complete the M-Pesa payment.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate M-Pesa payment",
        variant: "destructive",
      });
    },
  });
};

export const usePayPalPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const { data, error } = await supabase.functions.invoke('paypal-payment', {
        body: {
          amount: paymentData.amount,
          currency: paymentData.currency,
          orderId: paymentData.orderId,
          description: paymentData.description,
          returnUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'PayPal payment failed');
      
      return data;
    },
    onSuccess: () => {
      // Let caller handle redirect UX
    },
    onError: (error: any) => {
      toast({
        title: "PayPal Payment Failed",
        description: error.message || "Failed to initiate PayPal payment",
        variant: "destructive",
      });
    },
  });
};

export const useStripePayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      // Simulate Stripe payment
      return { clientSecret: 'mock_client_secret' };
    },
    onError: (error: any) => {
      toast({
        title: "Card Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
