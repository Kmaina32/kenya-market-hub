
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Briefcase, Heart, Clock, Zap } from 'lucide-react';

interface QuickBookingProps {
  onBookRide: (from: string, to: string) => void;
  className?: string;
}

const QuickBooking: React.FC<QuickBookingProps> = ({ onBookRide, className }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Mock saved locations - in real app, this would come from user preferences
  const savedLocations = [
    { id: 'home', name: 'Home', address: 'Kileleshwa, Nairobi', icon: Home, color: 'bg-blue-100 text-blue-600' },
    { id: 'work', name: 'Work', address: 'Westlands, Nairobi', icon: Briefcase, color: 'bg-green-100 text-green-600' },
    { id: 'gym', name: 'Gym', address: 'Parklands, Nairobi', icon: Heart, color: 'bg-red-100 text-red-600' },
  ];

  const frequentRoutes = [
    { from: 'Home', to: 'Work', estimatedTime: '25 min', estimatedFare: 450 },
    { from: 'Work', to: 'Home', estimatedTime: '30 min', estimatedFare: 500 },
    { from: 'Home', to: 'Gym', estimatedTime: '15 min', estimatedFare: 300 },
  ];

  const handleQuickBook = (from: string, to: string) => {
    onBookRide(from, to);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          Quick Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Saved Locations */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Saved Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {savedLocations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedLocation === location.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedLocation(location.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${location.color}`}>
                      <location.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{location.name}</p>
                      <p className="text-xs text-gray-500">{location.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Frequent Routes */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Frequent Routes</h3>
          <div className="space-y-2">
            {frequentRoutes.map((route, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{route.from} → {route.to}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {route.estimatedTime}
                          </span>
                          <span>~KSh {route.estimatedFare}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleQuickBook(route.from, route.to)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Location Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleQuickBook('Current Location', 'Home')}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm">Go Home</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickBook('Current Location', 'Work')}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-sm">Go to Work</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickBooking;
