import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { useCartContext } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentData } from '@/hooks/usePayments'; // Assuming PaymentData comes from usePayments hook
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define interfaces for data types expected by the RPC function
interface CartItemForOrder {
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

interface PlaceOrderPayload {
  p_user_id: string;
  p_total_amount: number;
  p_shipping_address: string;
  p_shipping_city: string;
  p_contact_phone: string;
  p_contact_email: string;
  p_payment_method: string;
  p_transaction_id: string | null;
  p_payment_status: string;
  p_cart_items: CartItemForOrder[];
}

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: cart, getTotalPrice, clearCart } = useCartContext();
  const { user, loading: authLoading } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    phone: '',
    email: user?.email || ''
  });

  const orderId = searchParams.get('orderId') || `ORDER-${Date.now()}`;
  const totalAmount = getTotalPrice();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    if (cart.length === 0) {
      navigate('/shop');
      return;
    }
  }, [user, cart, navigate, authLoading]);

  // Mutation to place the order
  const placeOrderMutation = useMutation({
    mutationFn: async (payload: PlaceOrderPayload) => {
      // FIX: Add 'as any' to bypass TypeScript type checking for RPC function name
      const { data, error } = await supabase.rpc('place_order_with_stock_update' as any, payload);

      if (error) {
        console.error('Order placement RPC error:', error);
        if (error.message.includes('Insufficient stock')) {
            throw new Error(`Order failed: ${error.message}`);
        }
        throw new Error('Failed to place order. Please try again.');
      }
      return data;
    },
    onSuccess: (newOrderId: string) => {
      toast.success('Payment successful! Your order has been placed.');
      clearCart();
      navigate('/orders', { 
        state: { 
          message: 'Payment successful! Your order has been placed.',
          orderId: newOrderId 
        }
      });
    },
    onError: (error: any) => {
      console.error('Error placing order:', error.message);
      toast.error(error.message || 'Payment failed and order could not be placed.');
      setShowPayment(false);
    },
  });

  const handleProceedToPayment = () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone || !shippingInfo.email) {
      toast.error('Please fill in all shipping information (address, city, phone, email).');
      return;
    }
    
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentDetails?: { transactionId?: string; paymentMethod?: string }) => {
    if (!user) {
        toast.error("User not authenticated for order placement.");
        return;
    }

    const orderPayload: PlaceOrderPayload = {
      p_user_id: user.id,
      p_total_amount: totalAmount,
      p_shipping_address: shippingInfo.address,
      p_shipping_city: shippingInfo.city,
      p_contact_phone: shippingInfo.phone,
      p_contact_email: shippingInfo.email,
      p_payment_method: paymentDetails?.paymentMethod || 'unknown',
      p_transaction_id: paymentDetails?.transactionId || null,
      p_payment_status: 'paid', // Assuming payment success means 'paid'
      p_cart_items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }))
    };

    placeOrderMutation.mutate(orderPayload);
  };

  const paymentData: PaymentData = {
    amount: totalAmount,
    currency: 'KSh',
    orderId,
    customerInfo: {
      name: user?.user_metadata?.full_name || 'Customer',
      email: shippingInfo.email,
      phone: shippingInfo.phone
    },
    shippingInfo: shippingInfo 
  };

  if (placeOrderMutation.isPending) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen-minus-header">
          <Loader2 className="h-16 w-16 text-orange-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Processing your order...</h2>
          <p className="text-gray-600">Please do not close this window.</p>
        </div>
      </MainLayout>
    );
  }

  if (showPayment) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto p-6">
          <PaymentMethodSelector
            paymentData={paymentData}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80'}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-orange-600">KSh {totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Delivery Address
                </label>
                <textarea
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your full delivery address"
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter your city"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="254712345678"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <Button
                onClick={handleProceedToPayment}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                size="lg"
                disabled={placeOrderMutation.isPending}
              >
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;