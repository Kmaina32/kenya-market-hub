
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, DollarSign, Loader2 } from 'lucide-react';
import MpesaPayment from '@/components/MpesaPayment';
import { PaymentData, usePayPalPayment } from '@/hooks/usePayments';

export interface PaymentMethodSelectorProps {
  paymentData: PaymentData;
  onPaymentSuccess: (paymentDetails?: { transactionId?: string; paymentMethod?: string }) => void;
  onCancel: () => void;
}

export type { PaymentData } from '@/hooks/usePayments';

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentData,
  onPaymentSuccess,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'paypal' | 'stripe'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const paypalPayment = usePayPalPayment();

  const handleMpesaSuccess = (transactionId: string) => {
    onPaymentSuccess({ transactionId, paymentMethod: 'mpesa' });
  };

  const handleMpesaError = (error: string) => {
    console.error('M-Pesa payment error:', error);
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    try {
      const result: any = await paypalPayment.mutateAsync(paymentData);
      // Persist pending payment data so success page can complete the order
      sessionStorage.setItem('pendingPayment', JSON.stringify(paymentData));
      // Redirect in the same tab to maintain app state on return
      window.location.href = result.approvalUrl;
      return; // Do not call onPaymentSuccess here; complete after redirect
    } catch (error) {
      console.error('PayPal payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOtherPayment = async () => {
    if (selectedMethod === 'paypal') {
      await handlePayPalPayment();
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate other payment methods
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({ 
        transactionId: `${selectedMethod.toUpperCase()}_${Date.now()}`, 
        paymentMethod: selectedMethod 
      });
    }, 2000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Your Payment
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
          <p className="text-sm text-gray-600 mt-1">{paymentData.description}</p>
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

          <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-60">
            <RadioGroupItem value="stripe" id="stripe" disabled />
            <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium">Credit/Debit Card (Coming Soon)</div>
                <div className="text-sm text-gray-600">Pay with Visa, Mastercard, etc.</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {selectedMethod === 'mpesa' && (
          <MpesaPayment
            amount={paymentData.amount}
            orderId={paymentData.orderId}
            onSuccess={handleMpesaSuccess}
            onError={handleMpesaError}
          />
        )}

        {selectedMethod !== 'mpesa' && (
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
              onClick={handleOtherPayment}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${paymentData.currency} ${paymentData.amount}`
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
