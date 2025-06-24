
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Search, User, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const AdminServiceBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch service bookings from database with proper joins
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-service-bookings', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('service_bookings')
        .select(`
          *,
          customer:profiles!service_bookings_customer_id_fkey (
            full_name,
            email
          ),
          provider:service_provider_profiles!service_bookings_provider_id_fkey (
            business_name,
            provider_type
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`service_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Bookings Management</h1>
          <p className="text-gray-600">Manage all service bookings and appointments</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search bookings..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            All Service Bookings ({bookings?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading bookings...</span>
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="font-medium">
                              {booking.customer?.full_name || 'Unknown Customer'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer?.email || 'No email'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.service_type}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {booking.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.provider?.business_name || 'Unknown Provider'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.provider?.provider_type}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {booking.booking_date ? format(new Date(booking.booking_date), 'MMM dd, yyyy') : 'No date'}
                          <div className="text-gray-500">
                            {booking.booking_time || 'No time specified'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-32">{booking.booking_address || 'Provider location'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {booking.total_amount ? `KSh ${Number(booking.total_amount).toLocaleString()}` : 'TBD'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
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
