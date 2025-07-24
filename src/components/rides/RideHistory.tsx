
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Clock, Star, Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

interface RideHistoryProps {
  className?: string;
}

const RideHistory: React.FC<RideHistoryProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock data - in real app, this would come from API
  const rideHistory = [
    {
      id: '1',
      date: new Date('2024-01-15T10:30:00'),
      from: 'Nairobi CBD',
      to: 'Westlands',
      driver: 'John Doe',
      vehicle: 'Toyota Vitz - KCA 123A',
      duration: '25 min',
      distance: '12.5 km',
      fare: 450,
      status: 'completed',
      rating: 4.5,
      vehicleType: 'taxi'
    },
    {
      id: '2',
      date: new Date('2024-01-14T15:45:00'),
      from: 'Karen',
      to: 'Sarit Centre',
      driver: 'Mary Wanjiku',
      vehicle: 'Honda Fit - KBZ 456B',
      duration: '18 min',
      distance: '8.2 km',
      fare: 320,
      status: 'completed',
      rating: 5,
      vehicleType: 'taxi'
    },
    {
      id: '3',
      date: new Date('2024-01-13T09:15:00'),
      from: 'Kasarani',
      to: 'JKIA',
      driver: 'Peter Kimani',
      vehicle: 'Yamaha FZ - KDA 789C',
      duration: '45 min',
      distance: '22.1 km',
      fare: 650,
      status: 'cancelled',
      rating: 0,
      vehicleType: 'motorbike'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRides = rideHistory.filter(ride => {
    const matchesSearch = ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          Ride History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Ride List */}
        <div className="space-y-4">
          {filteredRides.map((ride) => (
            <Card key={ride.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(ride.status)}>
                      {ride.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {format(ride.date, 'MMM dd, yyyy • HH:mm')}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">KSh {ride.fare}</p>
                    <p className="text-sm text-gray-500">{ride.vehicleType}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">{ride.from}</span>
                  </div>
                  <div className="ml-1 border-l-2 border-gray-200 h-4"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">{ride.to}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Driver: {ride.driver}</span>
                    <span>{ride.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{ride.duration}</span>
                    <span>{ride.distance}</span>
                    {ride.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{ride.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Book Again
                  </Button>
                  {ride.status === 'completed' && ride.rating === 0 && (
                    <Button variant="outline" size="sm" className="flex-1">
                      Rate Trip
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No rides found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideHistory;
