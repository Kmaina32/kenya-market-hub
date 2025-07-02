
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, MapPin, Phone, Mail } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentData } from '@/hooks/usePayments';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
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
    if (!user) {
      navigate('/auth');
      return;
    }
    if (cart.length === 0) {
      navigate('/marketplace');
      return;
    }
  }, [user, cart, navigate]);

  const handleProceedToPayment = () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      alert('Please fill in all shipping information');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    navigate('/orders', { 
      state: { 
        message: 'Payment successful! Your order has been placed.',
        orderId 
      }
    });
  };

  const paymentData: PaymentData = {
    amount: totalAmount,
    currency: 'KSh',
    orderId,
    customerInfo: {
      name: user?.user_metadata?.full_name || 'Customer',
      email: shippingInfo.email,
      phone: shippingInfo.phone
    }
  };

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
          {/* Order Summary */}
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
                <span className="text-green-600">KSh {totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
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
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                size="lg"
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
