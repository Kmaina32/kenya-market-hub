// src/components/PaymentMethodSelector.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
// PaymentData is correctly imported from usePayments here, not exported
import { useMpesaPayment, usePayPalPayment, useStripePayment, PaymentData } from '@/hooks/usePayments';

// FIX: Export the interface so it can be used by parent components
export interface PaymentMethodSelectorProps {
  paymentData: PaymentData;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentData,
  onPaymentSuccess,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'paypal' | 'stripe'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const mpesaPayment = useMpesaPayment();
  const paypalPayment = usePayPalPayment();
  const stripePayment = useStripePayment();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      switch (selectedMethod) {
        case 'mpesa':
          if (!phoneNumber) {
            throw new Error('Phone number is required for M-Pesa');
          }
          await mpesaPayment.mutateAsync({ ...paymentData, phoneNumber });
          break;
        case 'paypal':
          const paypalResult = await paypalPayment.mutateAsync(paymentData);
          window.location.href = paypalResult.approvalUrl;
          break;
        case 'stripe':
          const stripeResult = await stripePayment.mutateAsync(paymentData);
          console.log('Stripe client secret:', stripeResult.clientSecret);
          break;
      }
      onPaymentSuccess();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Select Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-green-600">
              {paymentData.currency} {paymentData.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <RadioGroup value={selectedMethod} onValueChange={(value: any) => setSelectedMethod(value)}>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="mpesa" id="mpesa" />
            <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer flex-1">
              <Smartphone className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">M-Pesa</div>
                <div className="text-sm text-gray-600">Pay with your mobile money</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium">PayPal</div>
                <div className="text-sm text-gray-600">Pay with PayPal account</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-sm text-gray-600">Pay with Visa, Mastercard, etc.</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {selectedMethod === 'mpesa' && (
          <div className="space-y-2">
            <Label htmlFor="phone">M-Pesa Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-gray-600">
              Enter your M-Pesa registered phone number
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePayment}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            disabled={isProcessing || (selectedMethod === 'mpesa' && !phoneNumber)}
          >
            {isProcessing ? 'Processing...' : `Pay ${paymentData.currency} ${paymentData.amount}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;