import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Calendar, MapPin, Clock, Users, Ticket, Search, Share2,
  Filter, DollarSign, Loader2, List, Grid, CheckCircle, Info
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EventBookingModal from '@/components/modals/EventBookingModal';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isPast } from 'date-fns';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// --- Interfaces for better type safety and clarity ---
interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string e.g., "2025-07-20T18:00:00Z"
  end_date?: string; // Optional end date
  location: string;
  price: number; // Price in KSh
  image_url?: string;
  event_type: string; // e.g., "Concert", "Workshop", "Conference"
  is_active: boolean;
  max_attendees?: number;
  current_attendees?: number;
  organizer?: string;
  time?: string;
}

// --- Constants for filtering/sorting options ---
const EVENT_TYPES = [
  'All', 'Concert', 'Workshop', 'Conference', 'Festival', 'Sports', 'Art Exhibit', 'Networking', 'Charity', 'Online'
];
const SORT_OPTIONS = [
  { value: 'date_asc', label: 'Upcoming' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' }, // Requires a 'popularity' field or calculated metric
];

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [sortBy, setSortBy] = useState('date_asc');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false); // New state for preview modal

  // Debounced search term for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data: events, isLoading, isFetching, refetch } = useQuery<Event[]>({
    queryKey: ['events', debouncedSearchTerm, selectedEventType, sortBy, priceFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('is_active', true);

      if (debouncedSearchTerm) {
        query = query.or(`title.ilike.%${debouncedSearchTerm}%,location.ilike.%${debouncedSearchTerm}%,event_type.ilike.%${debouncedSearchTerm}%`);
      }

      if (selectedEventType !== 'All') {
        query = query.eq('event_type', selectedEventType);
      }

      if (priceFilter === 'free') {
        query = query.eq('price', 0);
      } else if (priceFilter === 'paid') {
        query = query.gt('price', 0);
      }

      if (dateRange?.from) {
        query = query.gte('date', format(dateRange.from, 'yyyy-MM-dd'));
      }
      if (dateRange?.to) {
        query = query.lte('date', format(addDays(dateRange.to, 1), 'yyyy-MM-dd'));
      }


      switch (sortBy) {
        case 'price_low': query = query.order('price', { ascending: true, nullsFirst: false }); break;
        case 'price_high': query = query.order('price', { ascending: false, nullsFirst: true }); break;
        case 'popularity': query = query.order('popularity', { ascending: false, nullsFirst: true }); break;
        default: query = query.order('date', { ascending: true });
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching events:", error.message);
        toast.error("Failed to load events. Please try again.");
        throw error;
      }
      return data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const handleBookEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
    setShowPreviewModal(false); // Close preview if open
    toast.success(`Booking process for "${event.title}" started.`);
  }, []);

  const handlePreviewEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowPreviewModal(true);
  }, []);

  const handleShareEvent = useCallback((event: Event) => {
    const eventLink = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(eventLink);
    toast.success("Event link copied to clipboard!");
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedEventType('All');
    setSortBy('date_asc');
    setPriceFilter('all');
    setDateRange(undefined);
    refetch();
    toast.info("All filters cleared!");
  }, [refetch]);

  // --- Event Card Component (Memoized for performance) ---
  const EventCard = React.memo(({ event, onPreview, onBook, onShare }: { event: Event; onPreview: (event: Event) => void; onBook: (event: Event) => void; onShare: (event: Event) => void; }) => {
    const isFree = event.price === 0;
    const isFull = event.max_attendees && event.current_attendees && event.current_attendees >= event.max_attendees;
    const isPastEvent = isPast(new Date(event.date));

    return (
      <Card
        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
          isPastEvent ? 'opacity-70 bg-gray-100 cursor-not-allowed' : 'hover:shadow-lg hover:border-orange-400 bg-white'
        }`}
      >
        <div
          className="aspect-video bg-gray-200 relative overflow-hidden cursor-pointer" // Add cursor-pointer
          onClick={() => onPreview(event)} // Handle preview on image/header click
        >
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-white/70" />
            </div>
          )}
          <Badge className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 text-sm font-semibold shadow">
            {event.event_type}
          </Badge>
          {isPastEvent && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-4 py-1 animate-pulse">Event Ended</Badge>
            </div>
          )}
          {isFull && !isPastEvent && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm bg-blue-500 text-white px-4 py-1 animate-pulse">Sold Out</Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3 px-4 pt-4 cursor-pointer" onClick={() => onPreview(event)}>
          <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-700 transition-colors">
            {event.title}
          </CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span>
                {format(new Date(event.date), 'EEE, MMM d, yyyy')}
                {event.end_date && ` - ${format(new Date(event.end_date), 'MMM d, yyyy')}`}
              </span>
            </div>

            {event.time && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-orange-600">
                {isFree ? 'FREE' : `KSh ${event.price.toLocaleString()}`}
              </span>
              {event.max_attendees && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{event.current_attendees || 0}/{event.max_attendees}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              size="sm"
              onClick={() => onBook(event)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md transition-all duration-200"
              disabled={isFull || isPastEvent}
            >
              <Ticket className="h-4 w-4 mr-1" />
              {isPastEvent ? 'Event Ended' : isFull ? 'Sold Out' : 'Book Now'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShare(event)}
              className="border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8 shadow-xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-orange-100 drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Discover & Book Unforgettable Events</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Explore exciting concerts, workshops, conferences, and social gatherings happening right here in Nairobi, Kenya!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters and Search Bar */}
          <Card className="mb-8 p-6 shadow-lg border border-gray-100">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Search Input */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search events by title, location, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    aria-label="Search events"
                  />
                </div>

                {/* Event Type Filter (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="event-type-select" className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                    <SelectTrigger id="event-type-select" className="w-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-select" className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Buttons */}
                <div className="flex gap-2 justify-end sm:justify-start">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('grid')} aria-label="Grid View">
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('list')} aria-label="List View">
                    <List className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Filter Sheet */}
                <div className="sm:hidden col-span-full">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center gap-2 shadow-sm">
                        <Filter className="h-5 w-5" /> More Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Filter /> Filters
                        </SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        {/* Mobile Event Type Filter */}
                        <div>
                          <label htmlFor="mobile-event-type-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Ticket className="h-4 w-4" /> Event Type
                          </label>
                          <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                            <SelectTrigger id="mobile-event-type-select" className="w-full">
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_TYPES.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Sort By */}
                        <div>
                          <label htmlFor="mobile-sort-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <List className="h-4 w-4" /> Sort By
                          </label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger id="mobile-sort-select" className="w-full">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Price Filter */}
                        <div>
                          <label htmlFor="mobile-price-filter" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> Price
                          </label>
                          <Select
                            value={priceFilter}
                            onValueChange={(value) => setPriceFilter(value as "all" | "free" | "paid")}
                          >
                            <SelectTrigger id="mobile-price-filter" className="w-full">
                              <SelectValue placeholder="All Prices" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Date Range Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Date Range
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={"w-full justify-start text-left font-normal"}
                              >
                                {dateRange?.from ? (
                                  dateRange.to ? (
                                    <>
                                      {format(dateRange.from, "LLL dd, yyyy")} -{" "}
                                      {format(dateRange.to, "LLL dd, yyyy")}
                                    </>
                                  ) : (
                                    format(dateRange.from, "LLL dd, yyyy")
                                  )
                                ) : (
                                  <span>Pick a date range</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarPicker
                                initialFocus
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={1}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <Button onClick={handleClearFilters} variant="outline" className="w-full mt-4">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              {/* Desktop Filters below search/sort/view mode */}
              <div className="mt-6 hidden sm:block grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Filter */}
                <div>
                  <label htmlFor="price-filter" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" /> Price
                  </label>
                  <Select
                    value={priceFilter}
                    onValueChange={(value) => setPriceFilter(value as "all" | "free" | "paid")}
                  >
                    <SelectTrigger id="price-filter" className="w-full">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Date Range
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={"w-full justify-start text-left font-normal"}
                      >
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, yyyy")} -{" "}
                              {format(dateRange.to, "LLL dd, yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, yyyy")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        initialFocus
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Listing */}
          {(isLoading || isFetching) ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading exciting events...</p>
            </div>
          ) : events && events.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {events.map((event) => (
                viewMode === 'grid'
                  ? <EventCard key={event.id} event={event} onPreview={handlePreviewEvent} onBook={handleBookEvent} onShare={handleShareEvent} />
                  : <EventListItem key={event.id} event={event} handleBookEvent={handleBookEvent} handleShareEvent={handleShareEvent} handlePreviewEvent={handlePreviewEvent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Found</h3>
              <p className="text-md text-gray-600 mb-8">
                {searchTerm || selectedEventType !== 'All' || priceFilter !== 'all' || dateRange?.from
                  ? 'No events match your current search and filter criteria. Try adjusting them!'
                  : `There are no upcoming events in Nairobi right now. Check back soon for exciting new listings!`
                }
              </p>
              <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md flex items-center gap-2">
                <Filter className="h-5 w-5" /> Clear All Filters
              </Button>
            </div>
          )}
        </div>

        <EventBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          event={selectedEvent}
        />

        {/* Updated Event Preview Modal */}
        <EventPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          event={selectedEvent}
          onBook={handleBookEvent}
          onShare={handleShareEvent}
        />
      </div>
    </MainLayout>
  );
};

// --- Event List Item Component (New for List View) ---
interface EventListItemProps {
  event: Event;
  handleBookEvent: (event: Event) => void;
  handleShareEvent: (event: Event) => void;
  handlePreviewEvent: (event: Event) => void; // New prop for preview
}

const EventListItem = React.memo(({ event, handleBookEvent, handleShareEvent, handlePreviewEvent }: EventListItemProps) => {
  const isFree = event.price === 0;
  const isFull = event.max_attendees && event.current_attendees && event.current_attendees >= event.max_attendees;
  const isPastEvent = isPast(new Date(event.date));

  return (
    <Card
      className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
        isPastEvent ? 'opacity-70 bg-gray-100 cursor-not-allowed' : 'hover:shadow-lg hover:border-orange-400 bg-white'
      }`}
    >
      <div
        className="flex items-start sm:items-center flex-1 min-w-0 mb-4 sm:mb-0 sm:pr-4 cursor-pointer" // Add cursor-pointer
        onClick={() => handlePreviewEvent(event)} // Handle preview on image/text click
      >
        <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-gray-200 relative overflow-hidden rounded-lg mr-4">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-white/70" />
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 text-xs font-semibold">
            {event.event_type}
          </Badge>
          {isPastEvent && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs px-2 py-0.5 animate-pulse">Ended</Badge>
            </div>
          )}
          {isFull && !isPastEvent && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="secondary" className="text-xs bg-blue-500 text-white px-2 py-0.5 animate-pulse">Sold Out</Badge>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <CardTitle className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-orange-700 transition-colors">
            {event.title}
          </CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>{format(new Date(event.date), 'EEE, MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.time && (
             <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xl font-extrabold text-orange-600">
              {isFree ? 'FREE' : `KSh ${event.price.toLocaleString()}`}
            </span>
            {event.max_attendees && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>{event.current_attendees || 0}/{event.max_attendees}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
        <Button
          size="sm"
          onClick={() => handleBookEvent(event)}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
          disabled={isFull || isPastEvent}
        >
          <Ticket className="h-4 w-4 mr-1" />
          {isPastEvent ? 'Ended' : isFull ? 'Sold Out' : 'Book'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShareEvent(event)}
          className="border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
});

// --- Updated Event Preview Modal Component ---
interface EventPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onBook: (event: Event) => void;
  onShare: (event: Event) => void;
}

const EventPreviewModal: React.FC<EventPreviewModalProps> = ({ isOpen, onClose, event, onBook, onShare }) => {
  if (!event) return null;

  const isFree = event.price === 0;
  const isFull = event.max_attendees && event.current_attendees && event.current_attendees >= event.max_attendees;
  const isPastEvent = isPast(new Date(event.date));

  const handleBookClick = () => {
    onBook(event);
    onClose();
  };

  const handleShareClick = () => {
    onShare(event);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          p-0 overflow-hidden flex flex-col
          max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
          max-h-[90vh] sm:max-h-[90vh]
        " // Adjusted classes for mobile size and max height
      >
        <div className="flex-shrink-0"> {/* Ensure image doesn't stretch */}
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Calendar className="h-20 w-20 text-white/70" />
            </div>
          )}
        </div>
        <div className="p-6 flex-1 overflow-y-auto"> {/* Added overflow-y-auto for scrollable content */}
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">{event.title}</DialogTitle>
            <DialogDescription className="text-gray-700 mt-2 text-base leading-relaxed">
              {event.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span>
                {format(new Date(event.date), 'EEE, MMM d, yyyy')}
                {event.end_date && ` - ${format(new Date(event.end_date), 'MMM d, yyyy')}`}
              </span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-orange-500" />
              <span>{event.event_type}</span>
            </div>
            {event.organizer && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-500" />
                <span>By {event.organizer}</span>
              </div>
            )}
            {event.max_attendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                <span>Attendees: {event.current_attendees || 0}/{event.max_attendees}</span>
                {isFull && <Badge variant="secondary" className="bg-blue-500 text-white">Sold Out</Badge>}
              </div>
            )}
          </div>
        </div> {/* End of scrollable content div */}

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center p-6 pt-4 border-t border-gray-100 flex-shrink-0">
          <span className="text-3xl font-extrabold text-orange-600 mb-4 sm:mb-0">
            {isFree ? 'FREE' : `KSh ${event.price.toLocaleString()}`}
          </span>
          <div className="flex gap-3">
            <Button
              onClick={handleBookClick}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
              disabled={isFull || isPastEvent}
            >
              <Ticket className="h-4 w-4 mr-1" />
              {isPastEvent ? 'Event Ended' : isFull ? 'Sold Out' : 'Book Now'}
            </Button>
            <Button
              variant="outline"
              onClick={handleShareClick}
              className="border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm"
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Events;