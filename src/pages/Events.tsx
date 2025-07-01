
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, DollarSign, Search } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useEvents, useBookEvent } from '@/hooks/useEvents';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: events, isLoading } = useEvents();
  const bookEvent = useBookEvent();

  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleBookEvent = (eventId: string) => {
    bookEvent.mutate(eventId);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Calendar className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Events</h1>
              <p className="text-lg text-purple-100 mb-6">
                Find and book amazing events happening across Kenya
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search events by name, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-orange-200 focus:border-orange-400 rounded-xl"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'No events match your search criteria.' : 'Events will be added soon. Check back later!'}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {event.image_url ? (
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                        <Calendar className="h-16 w-16 text-purple-400" />
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-purple-500 text-white capitalize">
                      {event.event_type}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900 line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {event.price && event.price > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-orange-500" />
                        <span>KSh {event.price.toLocaleString()}</span>
                      </div>
                    )}

                    {event.max_attendees && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-orange-500" />
                        <span>{event.current_attendees || 0} / {event.max_attendees} attendees</span>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => handleBookEvent(event.id)}
                      disabled={bookEvent.isPending || (event.max_attendees && (event.current_attendees || 0) >= event.max_attendees)}
                    >
                      {bookEvent.isPending 
                        ? 'Booking...' 
                        : (event.max_attendees && (event.current_attendees || 0) >= event.max_attendees)
                        ? 'Fully Booked'
                        : event.price && event.price > 0 
                        ? `Book Now - KSh ${event.price.toLocaleString()}`
                        : 'Book Now - Free'
                      }
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
