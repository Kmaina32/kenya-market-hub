import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import Footer from '@/components/Footer';
import CouponInput from '@/components/CouponInput';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCartContext();
  const { toast } = useToast();
  
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    email: user?.email || '',
    specialInstructions: ''
  });

  const subtotal = getCartTotal();
  const shippingCost = 500; // Fixed shipping cost
  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal + shippingCost - discount;

  const handleCouponApplied = (couponData: any) => {
    setAppliedCoupon(couponData);
    toast({ title: 'Coupon applied successfully!' });
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    toast({ title: 'Coupon removed' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Please log in to complete your order',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Create order in database
      const orderData = {
        user_id: user.id,
        total_amount: total,
        shipping_address: shippingInfo,
        status: 'pending',
        payment_status: 'pending',
        coupon_id: appliedCoupon?.coupon_id || null,
        discount_amount: discount
      };

      clearCart();
      toast({ title: 'Order placed successfully!' });
      navigate('/');
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error placing order',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="max-w-2xl mx-auto text-center py-12">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
                <p className="text-muted-foreground mb-6">
                  You need to be logged in to complete your checkout.
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-8"
                >
                  Log In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </FrontendLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="max-w-2xl mx-auto text-center py-12">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-6">
                  Add some items to your cart before checking out.
                </p>
                <Button 
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-8"
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order securely</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your delivery details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={shippingInfo.specialInstructions}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
                      placeholder="Any special delivery instructions..."
                      className="rounded-xl"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        KSH {(Number(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KSH {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>KSH {shippingCost.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-KSH {discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>KSH {total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <CouponInput
                orderAmount={subtotal}
                onCouponApplied={handleCouponApplied}
                onCouponRemoved={handleCouponRemoved}
                appliedCoupon={appliedCoupon}
              />

              <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl py-6 text-lg"
              >
                Place Order - KSH {total.toLocaleString()}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </FrontendLayout>
  );
};

export default Checkout;
