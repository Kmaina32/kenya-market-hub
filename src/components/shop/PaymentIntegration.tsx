
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentIntegrationProps {
  amount: number;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'bank'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const { toast } = useToast();

  const processMpesaPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate M-Pesa STK Push
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction ID
      const transactionId = `MP${Date.now()}`;
      
      toast({
        title: "Payment Successful",
        description: `M-Pesa payment of KSh ${amount.toLocaleString()} completed.`
      });
      
      onPaymentSuccess(transactionId);
    } catch (error) {
      onPaymentError('M-Pesa payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCardPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate card payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionId = `CD${Date.now()}`;
      
      toast({
        title: "Payment Successful",
        description: `Card payment of KSh ${amount.toLocaleString()} completed.`
      });
      
      onPaymentSuccess(transactionId);
    } catch (error) {
      onPaymentError('Card payment failed. Please check your details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processBankTransfer = async () => {
    setIsProcessing(true);
    try {
      // Simulate bank transfer
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const transactionId = `BT${Date.now()}`;
      
      toast({
        title: "Bank Transfer Instructions Sent",
        description: "Please complete the transfer using the details sent to your email."
      });
      
      onPaymentSuccess(transactionId);
    } catch (error) {
      onPaymentError('Bank transfer setup failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    switch (paymentMethod) {
      case 'mpesa':
        processMpesaPayment();
        break;
      case 'card':
        processCardPayment();
        break;
      case 'bank':
        processBankTransfer();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Payment</h2>
        <p className="text-3xl font-bold text-green-600">KSh {amount.toLocaleString()}</p>
      </div>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            paymentMethod === 'mpesa' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
          }`}
          onClick={() => setPaymentMethod('mpesa')}
        >
          <CardContent className="p-4 text-center">
            <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">M-Pesa</h3>
            <p className="text-sm text-gray-600">Mobile Money</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            paymentMethod === 'card' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold">Card</h3>
            <p className="text-sm text-gray-600">Credit/Debit</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            paymentMethod === 'bank' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
          }`}
          onClick={() => setPaymentMethod('bank')}
        >
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold">Bank</h3>
            <p className="text-sm text-gray-600">Transfer</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Forms */}
      {paymentMethod === 'mpesa' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              M-Pesa Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mpesa-phone">Phone Number</Label>
              <Input
                id="mpesa-phone"
                placeholder="254712345678"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
              />
            </div>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing || !mpesaPhone}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
            </Button>
          </CardContent>
        </Card>
      )}

      {paymentMethod === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Card Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-expiry">Expiry</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                />
              </div>
            </div>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing || !cardDetails.name || !cardDetails.number}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? 'Processing...' : 'Pay with Card'}
            </Button>
          </CardContent>
        </Card>
      )}

      {paymentMethod === 'bank' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Bank Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Bank Details:</h4>
              <p><strong>Bank:</strong> KCB Bank Kenya</p>
              <p><strong>Account:</strong> 1234567890</p>
              <p><strong>Name:</strong> Sokko Sasa Ltd</p>
              <p><strong>Reference:</strong> ORDER-{Date.now()}</p>
            </div>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? 'Setting up...' : 'I have made the transfer'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentIntegration;
