
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import MpesaPayment from '@/components/MpesaPayment';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  items: any[];
}

const PaymentModal = ({ open, onOpenChange, total, items }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal' | 'stripe'>('mpesa');
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showMpesaPayment, setShowMpesaPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const createOrder = async () => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id || null,
          total_amount: total,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod,
          shipping_address: {
            fullName: customerInfo.fullName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address
          }
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order.id;
    } catch (error: any) {
      toast({
        title: "Order Creation Failed",
        description: error.message || "Failed to create order",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleMpesaSuccess = async (transactionId: string) => {
    try {
      // Update order status to paid
      if (orderId) {
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'paid',
            status: 'processing'
          })
          .eq('id', orderId);
      }

      toast({
        title: "Payment Successful!",
        description: "Your M-Pesa payment has been completed successfully.",
      });

      clearCart();
      onOpenChange(false);
      setShowMpesaPayment(false);
      setOrderId(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleMpesaError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowMpesaPayment(false);
  };

  const startMpesaPayment = async () => {
    const createdOrderId = await createOrder();
    if (createdOrderId) {
      setOrderId(createdOrderId);
      setShowMpesaPayment(true);
    }
  };

  const handleOtherPayments = async () => {
    const createdOrderId = await createOrder();
    if (!createdOrderId) return;

    setProcessing(true);

    try {
      // Simulate other payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          order_id: createdOrderId,
          payment_method: paymentMethod,
          amount: total,
          status: 'completed',
          transaction_id: `${paymentMethod.toUpperCase()}-${Date.now()}`,
          payment_data: {
            customerInfo,
            paymentMethod,
            timestamp: new Date().toISOString()
          }
        }]);

      if (transactionError) throw transactionError;

      // Update order status
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          status: 'processing'
        })
        .eq('id', createdOrderId);

      toast({
        title: "Payment Successful!",
        description: `Your order has been placed successfully. Order ID: ${createdOrderId.slice(0, 8)}`,
      });

      clearCart();
      onOpenChange(false);

    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'mpesa' as const,
      name: 'M-Pesa',
      description: 'Pay with your M-Pesa mobile money',
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
      color: 'border-green-200 bg-green-50'
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      description: 'Pay securely with PayPal',
      icon: <DollarSign className="h-5 w-5 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50'
    },
    {
      id: 'stripe' as const,
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard accepted',
      icon: <CreditCard className="h-5 w-5 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {showMpesaPayment && orderId ? (
            <MpesaPayment
              amount={total}
              orderId={orderId}
              onSuccess={handleMpesaSuccess}
              onError={handleMpesaError}
            />
          ) : (
            <>
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254 700 123 456"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Main Street, Nairobi"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? `${method.color} border-current` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="text-orange-600"
                      />
                      {method.icon}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Section */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={paymentMethod === 'mpesa' ? startMpesaPayment : handleOtherPayments}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay KSh ${total.toLocaleString()}`}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
