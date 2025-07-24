import React from 'react';
import MainLayout from '@/components/MainLayout';
import VendorAnalytics from '@/components/VendorAnalytics';
import ProtectedVendorRoute from '@/components/ProtectedVendorRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const VendorAnalyticsPage = () => {
  return (
    <MainLayout>
      <ProtectedVendorRoute requireApproval={true}>
        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="h-6 w-6" />
                Vendor Analytics Dashboard
              </CardTitle>
              <p className="text-blue-100">
                Comprehensive insights into your business performance and growth metrics
              </p>
            </CardHeader>
          </Card>

          {/* Analytics Component */}
          <VendorAnalytics />
        </div>
      </ProtectedVendorRoute>
    </MainLayout>
  );
};

export default VendorAnalyticsPage;
