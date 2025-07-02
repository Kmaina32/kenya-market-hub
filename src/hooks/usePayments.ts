
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useCreateTransaction, useUpdateTransactionStatus } from './useTransactions';

export interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

export const useMpesaPayment = () => {
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransactionStatus();

  return useMutation({
    mutationFn: async (paymentData: PaymentData & { phoneNumber: string }) => {
      console.log('Processing M-Pesa payment:', paymentData);
      
      // Create transaction record
      const transaction = await createTransaction.mutateAsync({
        order_id: paymentData.orderId,
        payment_method: 'mpesa',
        amount: paymentData.amount,
        payment_data: {
          phone_number: paymentData.phoneNumber,
          customer_info: paymentData.customerInfo
        }
      });

      // Simulate M-Pesa STK Push
      const mpesaResponse = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: paymentData.phoneNumber,
          amount: paymentData.amount,
          order_id: paymentData.orderId,
          transaction_id: transaction.id
        }),
      });

      if (!mpesaResponse.ok) {
        throw new Error('M-Pesa payment failed');
      }

      const result = await mpesaResponse.json();
      
      // Update transaction with M-Pesa response
      await updateTransaction.mutateAsync({
        id: transaction.id,
        status: 'pending',
        transaction_id: result.CheckoutRequestID
      });

      return result;
    },
    onSuccess: () => {
      toast({
        title: 'M-Pesa Payment Initiated',
        description: 'Please complete the payment on your phone.',
      });
    },
    onError: (error) => {
      console.error('M-Pesa payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'M-Pesa payment could not be processed.',
        variant: 'destructive',
      });
    },
  });
};

export const usePayPalPayment = () => {
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();

  return useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      console.log('Processing PayPal payment:', paymentData);
      
      // Create transaction record
      const transaction = await createTransaction.mutateAsync({
        order_id: paymentData.orderId,
        payment_method: 'paypal',
        amount: paymentData.amount,
        payment_data: {
          currency: paymentData.currency,
          customer_info: paymentData.customerInfo
        }
      });

      // Simulate PayPal integration
      const paypalResponse = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          order_id: paymentData.orderId,
          transaction_id: transaction.id
        }),
      });

      if (!paypalResponse.ok) {
        throw new Error('PayPal payment failed');
      }

      const result = await paypalResponse.json();
      return { ...result, transactionId: transaction.id };
    },
    onSuccess: () => {
      toast({
        title: 'PayPal Payment Initiated',
        description: 'Redirecting to PayPal...',
      });
    },
    onError: (error) => {
      console.error('PayPal payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'PayPal payment could not be processed.',
        variant: 'destructive',
      });
    },
  });
};

export const useStripePayment = () => {
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();

  return useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      console.log('Processing Stripe payment:', paymentData);
      
      // Create transaction record
      const transaction = await createTransaction.mutateAsync({
        order_id: paymentData.orderId,
        payment_method: 'stripe',
        amount: paymentData.amount,
        payment_data: {
          currency: paymentData.currency,
          customer_info: paymentData.customerInfo
        }
      });

      // Simulate Stripe integration
      const stripeResponse = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount * 100, // Stripe uses cents
          currency: paymentData.currency,
          order_id: paymentData.orderId,
          transaction_id: transaction.id
        }),
      });

      if (!stripeResponse.ok) {
        throw new Error('Stripe payment failed');
      }

      const result = await stripeResponse.json();
      return { ...result, transactionId: transaction.id };
    },
    onSuccess: () => {
      toast({
        title: 'Stripe Payment Initiated',
        description: 'Processing your payment...',
      });
    },
    onError: (error) => {
      console.error('Stripe payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Stripe payment could not be processed.',
        variant: 'destructive',
      });
    },
  });
};
