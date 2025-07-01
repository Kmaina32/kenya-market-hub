
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useMpesaPayment } from '@/hooks/useMpesaPayment';

interface MpesaPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onError
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'checking' | 'completed' | 'failed'>('idle');
  const { initiatePayment, checkPaymentStatus, isProcessing } = useMpesaPayment();

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      onError('Please enter your phone number');
      return;
    }

    setPaymentStatus('processing');
    
    const result = await initiatePayment({
      phoneNumber: phoneNumber.trim(),
      amount,
      orderId
    });

    if (result.success && result.checkoutRequestId) {
      setCheckoutRequestId(result.checkoutRequestId);
      setPaymentStatus('checking');
      
      // Start polling for payment status
      startStatusPolling(result.checkoutRequestId);
    } else {
      setPaymentStatus('failed');
      onError(result.error || 'Payment initiation failed');
    }
  };

  const startStatusPolling = (requestId: string) => {
    const pollInterval = setInterval(async () => {
      const statusResult = await checkPaymentStatus(requestId);
      
      if (statusResult.status === 'completed') {
        clearInterval(pollInterval);
        setPaymentStatus('completed');
        onSuccess(requestId);
      } else if (statusResult.status === 'failed') {
        clearInterval(pollInterval);
        setPaymentStatus('failed');
        onError('Payment was cancelled or failed');
      }
    }, 3000); // Check every 3 seconds

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (paymentStatus === 'checking') {
        setPaymentStatus('failed');
        onError('Payment timeout. Please try again.');
      }
    }, 120000);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as 07XX XXX XXX or 254X XXX XXX
    if (cleaned.startsWith('254')) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    } else if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return cleaned;
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Smartphone className="h-5 w-5 text-green-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Sending payment request to your phone...';
      case 'checking':
        return 'Waiting for payment confirmation. Please complete the payment on your phone.';
      case 'completed':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Pay with M-Pesa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            KSh {amount.toLocaleString()}
          </p>
        </div>

        {paymentStatus === 'idle' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="mpesa-phone">Phone Number</Label>
              <Input
                id="mpesa-phone"
                placeholder="07XX XXX XXX or 254X XXX XXX"
                value={phoneNumber}
                onChange={handlePhoneInputChange}
                maxLength={15}
              />
              <p className="text-xs text-gray-500">
                Enter your M-Pesa registered phone number
              </p>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing || !phoneNumber.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Pay with M-Pesa
                </>
              )}
            </Button>
          </>
        )}

        {paymentStatus !== 'idle' && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">{getStatusMessage()}</span>
            </div>
            
            {paymentStatus === 'checking' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong>
                </p>
                <ol className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>1. Check your phone for the M-Pesa prompt</li>
                  <li>2. Enter your M-Pesa PIN</li>
                  <li>3. Confirm the payment</li>
                </ol>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <Button 
                onClick={() => {
                  setPaymentStatus('idle');
                  setCheckoutRequestId(null);
                }}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MpesaPayment;
