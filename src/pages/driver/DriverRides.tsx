
import React from 'react';
import DriverLayout from '@/components/layouts/DriverLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

const DriverRides = () => {
  return (
    <DriverLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Driver Rides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Driver rides management coming soon...</p>
        </CardContent>
      </Card>
    </DriverLayout>
  );
};

export default DriverRides;
