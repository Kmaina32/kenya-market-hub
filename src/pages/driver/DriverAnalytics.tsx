
import React from 'react';
import DriverLayout from '@/components/layouts/DriverLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

const DriverAnalytics = () => {
  return (
    <DriverLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Driver Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Driver analytics coming soon...</p>
        </CardContent>
      </Card>
    </DriverLayout>
  );
};

export default DriverAnalytics;
