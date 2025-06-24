
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Wrench, Search, Calendar, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const AdminServiceBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch service bookings from database
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-service-bookings', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('service_bookings')
        .select(`
          *,
          customer:profiles!customer_id(full_name, email),
          provider:service_provider_profiles!provider_id(business_name, provider_type)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`service_type.ilike.%${searchTerm}%,service_description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Booking Management</h1>
          <p className="text-gray-600">Monitor and manage all service bookings</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search service bookings..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            All Service Bookings ({bookings?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading service bookings...</span>
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.service_type}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {booking.service_description || booking.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer?.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{booking.customer?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.provider?.business_name || 'Not assigned'}</div>
                          <Badge variant="outline" className="text-xs">
                            {booking.provider?.provider_type || 'Unknown'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-gray-500 mt-1">
                            {booking.booking_time}
                          </div>
                          {booking.booking_address && (
                            <div className="flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="truncate max-w-32">{booking.booking_address}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.total_amount ? (
                          <div className="flex items-center font-semibold text-green-600">
                            <DollarSign className="h-3 w-3 mr-1" />
                            KSh {Number(booking.total_amount).toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                          {booking.payment_status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Bookings Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No bookings match your search criteria.' : 'Service bookings will appear here once customers start booking services.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServiceBookings;
