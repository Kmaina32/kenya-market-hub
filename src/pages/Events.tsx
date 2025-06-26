
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MapPin, Clock, Users, Star } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Fetch events from database
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const eventTypes = ['conference', 'workshop', 'music', 'sports', 'exhibition', 'networking'];

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || event.event_type === selectedType;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Background Image */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 rounded-b-3xl mx-4 sm:mx-6 lg:mx-8 mt-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-b-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Calendar className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Events & Experiences</h1>
              <p className="text-lg text-orange-100 mb-6">
                Discover amazing events and purchase tickets from verified organizers
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 relative">
                    {event.image_url ? (
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-orange-400" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
                      {event.event_type}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 line-clamp-1">
                      {event.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        <span>{event.current_attendees}/{event.max_attendees || '∞'} attendees</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-orange-600">
                        {event.price > 0 ? `KSh ${event.price.toLocaleString()}` : 'Free'}
                      </span>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedType !== 'all' 
                  ? 'No events match your current search criteria.' 
                  : 'Events will be added soon. Check back later!'
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Events;
