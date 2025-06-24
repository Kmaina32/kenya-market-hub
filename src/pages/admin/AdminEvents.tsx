
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Calendar, Search, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch events from database
  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,event_type.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Manage all events and bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search events..." 
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
            All Events ({events?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading events...</span>
            </div>
          ) : events && events.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.event_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(event.date), 'MMM dd, yyyy')}
                          <div className="text-gray-500">
                            {format(new Date(event.date), 'HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-32">{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {event.price > 0 ? `KSh ${Number(event.price).toLocaleString()}` : 'Free'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Users className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{event.current_attendees}</span>
                          {event.max_attendees && (
                            <span className="text-gray-500">/{event.max_attendees}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.is_active ? 'default' : 'secondary'}>
                          {event.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No events match your search criteria.' : 'Start by creating your first event.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEvents;
