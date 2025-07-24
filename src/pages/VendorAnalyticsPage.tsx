
import React from 'react';
import MainLayout from '@/components/MainLayout';
import VendorAnalytics from '@/components/VendorAnalytics';
import ProtectedVendorRoute from '@/components/ProtectedVendorRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorAnalyticsPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <ProtectedVendorRoute requireApproval={true}>
        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <TrendingUp className="h-6 w-6" />
                    Vendor Analytics Dashboard
                  </CardTitle>
                  <p className="text-blue-100">
                    Comprehensive insights into your business performance and growth metrics
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => navigate('/admin/comprehensive-analytics')}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Advanced Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
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
