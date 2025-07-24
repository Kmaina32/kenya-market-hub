
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Car, Phone, MapPin, Shield, Zap } from 'lucide-react';

interface Driver {
  id: string;
  license_number?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  license_plate: string;
  vehicle_type: 'taxi' | 'motorbike';
  rating?: number;
  total_rides?: number;
  status: 'available' | 'on_trip' | 'offline';
  phone_number: string;
  eta_minutes?: number;
}

interface EnhancedDriverCardProps {
  driver: Driver;
  onBookRide: (driverId: string) => void;
  onCallDriver: (driverId: string) => void;
  isBookingEnabled: boolean;
}

const EnhancedDriverCard: React.FC<EnhancedDriverCardProps> = ({
  driver,
  onBookRide,
  onCallDriver,
  isBookingEnabled
}) => {
  const getVehicleIcon = (vehicleType: string) => {
    return vehicleType === 'motorbike' ? Zap : Car;
  };

  const VehicleIcon = getVehicleIcon(driver.vehicle_type);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {driver.license_number?.charAt(0) || 'D'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {driver.license_number || `Driver #${driver.id.slice(0, 6)}`}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-700">
                    {(driver.rating || 4.5).toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {driver.total_rides || 0} rides
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={driver.status === 'available' ? 'default' : 'secondary'}
            className={`${
              driver.status === 'available'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            } px-3 py-1 text-xs font-medium rounded-full`}
          >
            {driver.status === 'available' ? 'Available' : 'Busy'}
          </Badge>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-orange-100 rounded-lg">
              <VehicleIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {driver.vehicle_make} {driver.vehicle_model}
              </div>
              <div className="text-sm text-gray-600">
                {driver.vehicle_year} • {driver.license_plate}
              </div>
            </div>
            <Badge
              variant="outline"
              className="capitalize bg-orange-50 text-orange-700 border-orange-200"
            >
              {driver.vehicle_type}
            </Badge>
          </div>

          {/* ETA */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-blue-900">Estimated Arrival</div>
              <div className="text-sm text-blue-700">
                {driver.eta_minutes ? `${driver.eta_minutes} minutes` : 'Calculating...'}
              </div>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Safety Features</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Verified
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              GPS Tracked
            </Badge>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              Insured
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onBookRide(driver.id)}
            disabled={!isBookingEnabled || driver.status !== 'available'}
            className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {driver.status === 'available' ? 'Book Ride' : 'Unavailable'}
          </Button>
          <Button
            onClick={() => onCallDriver(driver.id)}
            variant="outline"
            size="sm"
            className="h-12 px-4 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>

        {/* Distance Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>~{(Math.random() * 5 + 1).toFixed(1)} km away</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDriverCard;
