// src/pages/Checkout.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, MapPin, Phone, Mail, Loader2, Calendar } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { useCartContext } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentData } from '@/hooks/usePayments'; 
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid'; 
import { Input } from '@/components/ui/input'; 

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
  p_cart_items: CartItemForOrder[] | any; 
  p_order_id: string; 
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Check if this is an event booking
  const eventBookingData = location.state?.isEventBooking ? location.state : null;
  const isEventBooking = !!eventBookingData;
  
  // Calculate total amount (either from cart or event booking)
  const totalAmount = isEventBooking ? eventBookingData.eventData.totalAmount : getTotalPrice();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.info("Please log in to proceed to checkout.");
      navigate('/auth');
      return;
    }
    
    // For regular cart checkout, check if cart is empty
    if (!isEventBooking && cart.length === 0) {
      toast.info("Your cart is empty. Please add items before checking out.");
      navigate('/shop');
      return;
    }
    
    // For event booking, pre-fill contact info
    if (isEventBooking && eventBookingData.eventData.bookingDetails) {
      const bookingDetails = eventBookingData.eventData.bookingDetails;
      setShippingInfo(prev => ({
        ...prev,
        phone: bookingDetails.phone || prev.phone,
        email: bookingDetails.email || prev.email,
        // For events, we don't need shipping address
        address: isEventBooking ? 'N/A - Digital Event Ticket' : prev.address,
        city: isEventBooking ? 'N/A' : prev.city
      }));
    } else if (user && user.user_metadata) {
      // Only use fields that are safely accessible from user metadata
      setShippingInfo(prev => ({
        ...prev,
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user, cart, navigate, authLoading, isEventBooking, eventBookingData]);

  const mapPaymentMethodToDB = useCallback((method: 'mpesa' | 'paypal' | 'stripe' | string): string => {
    switch (method.toLowerCase()) {
      case 'mpesa': return 'M-Pesa';
      case 'paypal': return 'PayPal';
      case 'stripe': return 'Stripe';
      default: return 'Other'; 
    }
  }, []);

  const placeOrderMutation = useMutation({
    mutationFn: async (payload: PlaceOrderPayload) => {
      if (isEventBooking) {
        // For event bookings, update the existing order
        const { error } = await supabase
          .from('orders')
          .update({
            payment_method: payload.p_payment_method,
            payment_status: payload.p_payment_status,
            transaction_id: payload.p_transaction_id,
            status: 'confirmed'
          })
          .eq('id', eventBookingData.orderId);

        if (error) throw error;
        return eventBookingData.orderId;
      } else {
        // For regular cart orders, use the existing RPC function
        const { data, error } = await supabase.rpc('place_order_with_stock_update', payload);
        if (error) {
          console.error('Order placement RPC error:', error);
          if (error.message.includes('Insufficient stock')) {
            throw new Error(`Order failed: ${error.message}`);
          }
          throw new Error('Failed to place order. Please try again.');
        }
        return data;
      }
    },
    onSuccess: (newOrderId: string) => {
      const successMessage = isEventBooking 
        ? 'Payment successful! Your event tickets have been confirmed.'
        : 'Payment successful! Your order has been placed.';
      
      toast.success(successMessage);
      
      if (!isEventBooking) {
        clearCart();
      }
      
      navigate('/orders', { 
        state: { 
          message: successMessage,
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
    if (!isEventBooking && (!shippingInfo.address || !shippingInfo.city)) {
      toast.error('Please fill in all shipping information (address and city).');
      return;
    }
    
    if (!shippingInfo.phone || !shippingInfo.email) {
      toast.error('Please fill in your contact information (phone and email).');
      return;
    }
    
    if (totalAmount <= 0) {
      toast.error('Order total must be greater than zero.');
      return;
    }
    
    if (!user) {
      toast.error('User not authenticated. Please log in.');
      navigate('/auth');
      return;
    }

    setShowPayment(true);
  };

  const paymentData: PaymentData = useMemo(() => ({
    orderId: isEventBooking ? eventBookingData.orderId : uuidv4(),
    amount: totalAmount,
    currency: 'KES',
    description: isEventBooking 
      ? `Event Tickets: ${eventBookingData.eventData.eventTitle} - ${eventBookingData.eventData.tickets} ticket(s)`
      : `Order from Kenya Market Hub - Total: KSh ${totalAmount.toLocaleString()}`,
    customerInfo: {
      name: isEventBooking 
        ? eventBookingData.eventData.bookingDetails.fullName
        : user?.user_metadata?.full_name || user?.email || 'Customer',
      email: shippingInfo.email,
      phone: shippingInfo.phone,
    },
    shippingInfo: { 
      address: shippingInfo.address,
      city: shippingInfo.city,
      phone: shippingInfo.phone,
      email: shippingInfo.email,
    },
  }), [totalAmount, user, shippingInfo, isEventBooking, eventBookingData]);

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
      p_payment_method: mapPaymentMethodToDB(paymentDetails?.paymentMethod || 'unknown'),
      p_transaction_id: paymentDetails?.transactionId || null,
      p_payment_status: 'paid', 
      p_order_id: paymentData.orderId, 
      p_cart_items: isEventBooking ? [] : cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      })) as any 
    };

    placeOrderMutation.mutate(orderPayload);
  };

  if (placeOrderMutation.isPending) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen-minus-header">
          <Loader2 className="h-16 w-16 text-orange-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Processing your {isEventBooking ? 'booking' : 'order'}...</h2>
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
          <h1 className="text-3xl font-bold mb-2">
            {isEventBooking ? 'Complete Event Booking' : 'Checkout'}
          </h1>
          <p className="text-gray-600">
            {isEventBooking 
              ? 'Review your event booking and complete payment'
              : 'Review your order and complete your purchase'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEventBooking ? <Calendar className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                {isEventBooking ? 'Event Booking Summary' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEventBooking ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{eventBookingData.eventData.eventTitle}</div>
                      <div className="text-sm text-gray-600">
                        Date: {new Date(eventBookingData.eventData.eventDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Tickets: {eventBookingData.eventData.tickets}
                      </div>
                      <div className="text-sm text-gray-600">
                        Attendee: {eventBookingData.eventData.bookingDetails.fullName}
                      </div>
                    </div>
                    <div className="font-medium">
                      KSh {eventBookingData.eventData.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
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
                ))
              )}
              
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
                {isEventBooking ? 'Contact Information' : 'Shipping Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEventBooking && (
                <>
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
                    <Input 
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter your city"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                <Input 
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
                <Input 
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
