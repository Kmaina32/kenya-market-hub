import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { items: cart, clearCart, getTotalPrice } = useCartContext();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const token = searchParams.get('token'); // PayPal order ID
        if (!token) {
          toast.error('Missing PayPal token.');
          setProcessing(false);
          return;
        }

        // Capture the PayPal order
        const { data: cap, error: capErr } = await supabase.functions.invoke('paypal-capture', {
          body: { orderId: token },
        });
        if (capErr || !cap?.success) {
          throw new Error(capErr?.message || cap?.error || 'PayPal capture failed');
        }

        // Retrieve pending payment context
        const stored = sessionStorage.getItem('pendingPayment');
        const paymentData = stored ? JSON.parse(stored) : null;
        if (!paymentData) {
          toast.error('Payment context not found.');
          setProcessing(false);
          return;
        }

        if (!user) {
          toast.error('You must be signed in to complete the order.');
          setProcessing(false);
          navigate('/auth');
          return;
        }

        // Build order payload similar to Checkout
        const payload = {
          p_user_id: user.id,
          p_total_amount: getTotalPrice(),
          p_shipping_address: paymentData.shippingInfo?.address || 'N/A',
          p_shipping_city: paymentData.shippingInfo?.city || 'N/A',
          p_contact_phone: paymentData.shippingInfo?.phone || '',
          p_contact_email: paymentData.shippingInfo?.email || user.email,
          p_payment_method: 'PayPal',
          p_transaction_id: cap?.result?.purchase_units?.[0]?.payments?.captures?.[0]?.id || token,
          p_payment_status: 'paid',
          p_cart_items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
          })),
          p_order_id: paymentData.orderId,
        } as any;

        const { data: orderId, error } = await supabase.rpc('place_order_with_stock_update', payload);
        if (error) throw error;

        // Clear and navigate
        clearCart();
        sessionStorage.removeItem('pendingPayment');
        toast.success('Payment successful! Your order has been placed.');
        navigate('/orders', { state: { orderId } });
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || 'Failed to complete PayPal payment');
      } finally {
        setProcessing(false);
      }
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            {processing ? <Loader2 className="h-6 w-6 text-green-600 animate-spin" /> : <CheckCircle className="h-6 w-6 text-green-600" />}
          </div>
          <CardTitle className="text-green-700">{processing ? 'Finalizing Payment...' : 'Payment Successful!'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {processing ? 'Please wait while we complete your order.' : 'Your payment has been processed successfully.'}
          </p>
          {!processing && (
            <div className="space-y-2">
              <Button onClick={() => navigate('/')} className="w-full">Continue Shopping</Button>
              <Button variant="outline" onClick={() => navigate('/orders')} className="w-full">View Orders</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;