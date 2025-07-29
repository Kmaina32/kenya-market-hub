
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, MapPin, Clock, Car } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import RideBookingTab from '@/components/rides/RideBookingTab';
import DriverLocationTracker from '@/components/rides/DriverLocationTracker';
import RideHistory from '@/components/rides/RideHistory';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedRides: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('book');

  const handleRideBooked = (rideId: string) => {
    console.log('Ride booked:', rideId);
    // Could switch to tracking tab or show confirmation
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/60" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Navigation className="h-16 w-16 mx-auto mb-4 text-orange-100" />
              <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                Smart Ride Booking
              </h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Real-time driver matching with intelligent algorithms
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="book" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Book Ride
              </TabsTrigger>
              <TabsTrigger value="track" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Driver Tracking
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Ride History
              </TabsTrigger>
            </TabsList>

            <RideBookingTab onRideBooked={handleRideBooked} />

            <TabsContent value="track" className="space-y-6">
              <DriverLocationTracker />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <RideHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default EnhancedRides;
