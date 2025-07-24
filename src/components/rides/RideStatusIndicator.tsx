
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Car, MapPin, AlertCircle, Zap } from 'lucide-react';

interface RideStatusIndicatorProps {
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  timeElapsed?: number;
  driverETA?: number;
}

const RideStatusIndicator: React.FC<RideStatusIndicatorProps> = ({
  status,
  timeElapsed = 0,
  driverETA
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'requested':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          title: 'Finding Driver',
          description: 'Searching for nearby drivers...',
          bgColor: 'from-yellow-50 to-orange-50',
          pulse: true
        };
      case 'accepted':
        return {
          icon: <Car className="h-5 w-5" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          title: 'Driver Assigned',
          description: 'Your driver is on the way to pick you up',
          bgColor: 'from-blue-50 to-indigo-50',
          pulse: false
        };
      case 'in_progress':
        return {
          icon: <MapPin className="h-5 w-5" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          title: 'Trip in Progress',
          description: 'Enjoy your ride to the destination',
          bgColor: 'from-green-50 to-emerald-50',
          pulse: false
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          title: 'Trip Completed',
          description: 'Thank you for choosing our service!',
          bgColor: 'from-gray-50 to-slate-50',
          pulse: false
        };
      case 'cancelled':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'bg-red-100 text-red-800 border-red-200',
          title: 'Trip Cancelled',
          description: 'Your ride has been cancelled',
          bgColor: 'from-red-50 to-rose-50',
          pulse: false
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          title: 'Unknown Status',
          description: 'Please contact support',
          bgColor: 'from-gray-50 to-slate-50',
          pulse: false
        };
    }
  };

  const config = getStatusConfig();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${config.bgColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.color.replace('text-', 'bg-').replace('border-', '')}`}>
              {config.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <Badge className={`${config.color} ${config.pulse ? 'animate-pulse' : ''}`}>
            {config.pulse && <div className="w-2 h-2 bg-current rounded-full mr-2 animate-ping"></div>}
            {status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-3">
          {/* Time Information */}
          <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {status === 'requested' ? 'Searching time' : 'Trip time'}
              </span>
            </div>
            <span className="font-bold text-gray-900">{formatTime(timeElapsed)}</span>
          </div>

          {/* Driver ETA (if available) */}
          {driverETA && status === 'accepted' && (
            <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Driver ETA</span>
              </div>
              <span className="font-bold text-blue-900">{driverETA} min</span>
            </div>
          )}

          {/* Live Updates Notice */}
          {(status === 'requested' || status === 'accepted') && (
            <div className="flex items-center justify-center p-3 bg-white/50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live updates enabled</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs text-gray-500">
              {status === 'requested' ? '25%' : 
               status === 'accepted' ? '50%' : 
               status === 'in_progress' ? '75%' : '100%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                status === 'requested' ? 'bg-yellow-500 w-1/4' :
                status === 'accepted' ? 'bg-blue-500 w-1/2' :
                status === 'in_progress' ? 'bg-green-500 w-3/4' :
                'bg-gray-500 w-full'
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideStatusIndicator;
