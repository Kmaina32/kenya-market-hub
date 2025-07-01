
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';

const EventSystem = () => {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Events & Activities</h2>
          <p className="text-gray-600">Loading events...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Events & Activities</h2>
        <p className="text-red-600 mb-4">Error loading events</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const upcomingEvents = events?.slice(0, 6) || [];

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Events & Activities</h2>
        <p className="text-gray-600">No upcoming events found. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
        <p className="text-gray-600">Discover exciting events happening around you</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {event.image_url && (
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-blue-600">
                  {event.event_type}
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
              {event.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString('en-KE', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {new Date(event.date).toLocaleTimeString('en-KE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              
              {event.max_attendees && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {event.current_attendees}/{event.max_attendees} attendees
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {event.price === 0 ? 'Free' : `KSh ${event.price?.toLocaleString()}`}
                  </span>
                </div>
                
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {events && events.length > 6 && (
        <div className="text-center">
          <Button variant="outline">View All Events</Button>
        </div>
      )}
    </div>
  );
};

export default EventSystem;
