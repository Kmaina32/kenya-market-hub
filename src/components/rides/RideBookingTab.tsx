
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import EnhancedRideBooking from '@/components/EnhancedRideBooking';
import QuickBooking from './QuickBooking';
import UserPreferences from './UserPreferences';
import { useRideNotifications } from '@/hooks/useRideNotifications';

interface RideBookingTabProps {
  onRideBooked: (rideId: string) => void;
}

const RideBookingTab = ({ onRideBooked }: RideBookingTabProps) => {
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Enable ride notifications
  useRideNotifications();

  const handleQuickBook = (from: string, to: string) => {
    // This would trigger the enhanced booking component with pre-filled data
    console.log('Quick booking:', { from, to });
  };

  return (
    <TabsContent value="book" className="p-6 pt-0 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Book a Ride</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreferences(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedRideBooking onRideBooked={onRideBooked} />
        </div>
        <div className="space-y-4">
          <QuickBooking onBookRide={handleQuickBook} />
        </div>
      </div>

      <UserPreferences
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </TabsContent>
  );
};

export default RideBookingTab;
