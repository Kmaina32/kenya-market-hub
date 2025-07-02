
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, Calendar, CreditCard } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { format } from 'date-fns';

const TransactionHistory = () => {
  const { data: transactions = [], isLoading } = useTransactions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return '📱';
      case 'paypal':
        return '💰';
      case 'stripe':
        return '💳';
      default:
        return '💳';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {getPaymentMethodIcon(transaction.payment_method)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {transaction.payment_method.toUpperCase()} Payment
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                    {transaction.transaction_id && (
                      <div className="text-xs text-gray-500">
                        ID: {transaction.transaction_id}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    KSh {transaction.amount.toLocaleString()}
                  </div>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
