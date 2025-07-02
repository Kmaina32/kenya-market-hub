import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wrench,
  Home,
  Car,
  Scissors,
  Truck,
  PaintBucket,
  Search,
  Star,
  MapPin,
  Phone,
  Calendar,
  Filter,
  Loader2,
  ArrowUpNarrowWide,
  ShieldCheck,
  Sparkles,
  Eye,
  Share2,
  DollarSign // Fixed: Added DollarSign import
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceBookingModal from '@/components/modals/ServiceBookingModal';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';


// --- Interfaces for better type safety and clarity ---
// Extending the service provider profile interface
interface ServiceProvider {
  id: string;
  business_name: string;
  business_description?: string;
  provider_type: string; // e.g., "Home Services", "Automotive", "Beauty"
  location_address?: string; // Full address string
  latitude?: number; // For map integration if desired
  longitude?: number; // For map integration if desired
  phone_number?: string;
  email?: string;
  is_active: boolean;
  // Fixed: Ensure this matches your Supabase ENUM type exactly
  verification_status: 'pending' | 'verified' | 'rejected';
  average_rating?: number; // e.g., 4.5
  total_reviews?: number; // e.g., 120
  profile_image_url?: string; // For provider's profile picture/logo
  banner_image_url?: string; // For a banner on their profile/card
  hourly_rate_min?: number; // New: Minimum hourly rate
  hourly_rate_max?: number; // New: Maximum hourly rate
  created_at: string; // To identify new providers
}

// --- Constants for better maintainability and structured filters ---
const SERVICE_CATEGORIES = [
  { id: 'all', name: 'All Services', icon: Wrench },
  { id: 'home', name: 'Home Services', icon: Home },
  { id: 'automotive', name: 'Automotive', icon: Car },
  { id: 'beauty', name: 'Beauty & Wellness', icon: Scissors },
  { id: 'moving', name: 'Moving & Delivery', icon: Truck },
  { id: 'maintenance', name: 'Maintenance', icon: PaintBucket },
  { id: 'cleaning', name: 'Cleaning', icon: Home },
  { id: 'electronics', name: 'Electronics Repair', icon: Wrench },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Providers' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  // Fixed: Adjusted type for selectedService to match the expected format for ServiceBookingModal
  const [selectedService, setSelectedService] = useState<({
    id: string;
    title: string;
    provider: string;
    type: string;
    location?: string;
    phone_number?: string;
    description?: string;
  }) | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Debounced search term for better performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: services, isLoading, isFetching, refetch } = useQuery<ServiceProvider[]>({
    queryKey: ['service-providers', debouncedSearchTerm, selectedCategory, sortBy, minRating, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('service_provider_profiles')
        .select('*')
        .eq('is_active', true)
        // Removed eq('verification_status', 'verified') here to allow filtering,
        // or ensure your DB schema matches 'verified' string literal if you keep it.
        // It's better to filter the data client-side if the DB column is generic string.
        // If you want to strictly query verified, ensure your DB enum and generated types support it.
        ;

      if (debouncedSearchTerm) {
        query = query.or(`business_name.ilike.%${debouncedSearchTerm}%,business_description.ilike.%${debouncedSearchTerm}%,provider_type.ilike.%${debouncedSearchTerm}%`);
      }
      if (selectedCategory !== 'all') {
        query = query.eq('provider_type', selectedCategory);
      }
      if (minRating > 0) {
        query = query.gte('average_rating', minRating);
      }
      query = query.gte('hourly_rate_min', priceRange[0]).lte('hourly_rate_max', priceRange[1]);


      switch (sortBy) {
        case 'rating_desc': query = query.order('average_rating', { ascending: false, nullsFirst: true }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        case 'price_low': query = query.order('hourly_rate_min', { ascending: true, nullsFirst: true }); break;
        case 'price_high': query = query.order('hourly_rate_max', { ascending: false, nullsFirst: true }); break;
        default: query = query.order('business_name', { ascending: true });
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching services:", error.message);
        toast.error("Failed to load services. Please try again.");
        throw error;
      }

      // Fixed: Explicitly map and cast incoming data to ServiceProvider interface
      // This is crucial for matching the strict union types like 'verification_status'
      const processedData: ServiceProvider[] = (data || []).map((d: any) => ({
        id: d.id,
        business_name: d.business_name,
        business_description: d.business_description,
        provider_type: d.provider_type,
        location_address: d.location_address,
        latitude: d.latitude,
        longitude: d.longitude,
        phone_number: d.phone_number,
        email: d.email,
        is_active: d.is_active,
        // Fixed: Safely cast to the union type, assuming your DB values conform
        verification_status: d.verification_status as 'pending' | 'verified' | 'rejected',
        average_rating: d.average_rating,
        total_reviews: d.total_reviews,
        profile_image_url: d.profile_image_url,
        banner_image_url: d.banner_image_url,
        hourly_rate_min: d.hourly_rate_min,
        hourly_rate_max: d.hourly_rate_max,
        created_at: d.created_at,
      }));

      // If you want to ensure only 'verified' status is shown client-side:
      const filteredOnClient = processedData.filter(service => service.verification_status === 'verified');
      return filteredOnClient; // Or return processedData if you want to show all statuses
    },
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const handleBookService = useCallback((service: ServiceProvider) => {
    // Fixed: Transform service object to match ServiceBookingModal's expected props
    setSelectedService({
      id: service.id,
      title: service.business_name, // Map business_name to title
      provider: service.business_name, // Keep business_name as provider
      type: service.provider_type, // Keep provider_type as type
      location: service.location_address, // Add location
      phone_number: service.phone_number, // Add phone_number
      description: service.business_description, // Add description
    });
    setShowBookingModal(true);
    toast.info(`Initiating booking for ${service.business_name}.`);
  }, []);

  const handleContactProvider = useCallback((service: ServiceProvider) => {
    if (service.phone_number) {
      window.location.href = `tel:${service.phone_number}`;
      toast.success('Opening phone dialer...');
    } else {
      toast.error('Phone number not available for this provider.');
    }
  }, []);

  const handleViewProfile = useCallback((service: ServiceProvider) => {
    toast.info(`Opening profile for ${service.business_name} (feature under development).`);
    console.log("Viewing profile for service ID:", service.id);
  }, []);

  const handleShareService = useCallback((service: ServiceProvider) => {
    const serviceLink = `${window.location.origin}/services/${service.id}`;
    navigator.clipboard.writeText(serviceLink);
    toast.success("Service link copied to clipboard!");
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('relevance');
    setMinRating(0);
    setPriceRange([0, 10000]);
    refetch();
    toast.info("All filters cleared!");
  }, [refetch]);

  // Memoized Service Provider Card Component
  const ServiceProviderCard = React.memo(({ service }: { service: ServiceProvider }) => {
    const isNewProvider = new Date(service.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const displayRating = service.average_rating ? service.average_rating.toFixed(1) : 'N/A';
    const displayReviews = service.total_reviews ? `(${service.total_reviews})` : '';
    const displayPriceRange = service.hourly_rate_min !== undefined && service.hourly_rate_max !== undefined
      ? `KSh ${service.hourly_rate_min.toLocaleString()} - ${service.hourly_rate_max.toLocaleString()}/hr`
      : 'Contact for price';

    return (
      <Card className="group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:border-orange-400 bg-white">
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          {service.banner_image_url ? (
            <img
              src={service.banner_image_url}
              alt={service.business_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Wrench className="h-16 w-16 text-white/70" />
            </div>
          )}
          {service.profile_image_url && (
            <div className="absolute bottom-3 left-3 w-16 h-16 rounded-full border-3 border-white overflow-hidden shadow-lg transform translate-y-1/3 group-hover:translate-y-0 transition-transform duration-300">
              <img
                src={service.profile_image_url}
                alt={`${service.business_name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {isNewProvider && (
            <Badge className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-3 py-1 font-semibold shadow-md">
              <Sparkles className="h-3 w-3 mr-1" /> New
            </Badge>
          )}
          {service.verification_status === 'verified' && (
            <Badge className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 font-semibold shadow-md">
              <ShieldCheck className="h-3 w-3 mr-1" /> Verified
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3 pt-8 px-4">
          <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-orange-700 transition-colors">
            {service.business_name}
          </CardTitle>
          <Badge variant="outline" className="text-xs text-gray-600 w-fit">{service.provider_type}</Badge>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
            {service.business_description || 'Professional service provider.'}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="truncate">{service.location_address || 'Location not specified'}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-700">{displayRating}</span>
              <span className="text-xs text-gray-500">{displayReviews}</span>
            </div>
            <span className="text-lg font-bold text-orange-600">
              {displayPriceRange}
            </span>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              size="sm"
              onClick={() => handleBookService(service)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md transition-all duration-200"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Book Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewProfile(service)}
              className="border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShareService(service)}
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
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Wrench className="h-16 w-16 mx-auto mb-4 text-orange-100 drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Find & Book Top Services</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Connect with verified professionals for home, auto, beauty, and more services across Kenya.
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
                    placeholder="Search for providers or services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    aria-label="Search services"
                  />
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

                {/* Rating Filter (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="rating-select" className="block text-sm font-medium text-gray-700 mb-2">Min. Rating</label>
                  <Select value={String(minRating)} onValueChange={(value) => setMinRating(Number(value))}>
                    <SelectTrigger id="rating-select" className="w-full">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5 Stars & Up</SelectItem>
                      <SelectItem value="4">4 Stars & Up</SelectItem>
                      <SelectItem value="3">3 Stars & Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                 {/* Price Range Filter (Desktop) */}
                <div className="hidden sm:block">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Hourly Rate: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={(val: [number, number]) => setPriceRange(val)}
                    className="w-full"
                  />
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
                        {/* Mobile Category Tabs (retained for consistency with desktop) */}
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Wrench className="h-4 w-4" /> Service Category
                            </label>
                          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                            <TabsList className="grid grid-cols-2 gap-2 h-auto p-2">
                              {SERVICE_CATEGORIES.map((category) => {
                                const Icon = category.icon;
                                return (
                                  <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="flex flex-col items-center gap-2 p-3 text-center data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 rounded-xl"
                                  >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs">{category.name}</span>
                                  </TabsTrigger>
                                );
                              })}
                            </TabsList>
                          </Tabs>
                        </div>

                        {/* Mobile Sort By */}
                        <div>
                          <label htmlFor="mobile-sort-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <ArrowUpNarrowWide className="h-4 w-4" /> Sort By
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

                        {/* Mobile Rating Filter */}
                        <div>
                          <label htmlFor="mobile-rating-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Star className="h-4 w-4" /> Minimum Rating
                          </label>
                          <Select value={String(minRating)} onValueChange={(value) => setMinRating(Number(value))}>
                            <SelectTrigger id="mobile-rating-select" className="w-full">
                              <SelectValue placeholder="Any Rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Any Rating</SelectItem>
                              <SelectItem value="4.5">4.5 Stars & Up</SelectItem>
                              <SelectItem value="4">4 Stars & Up</SelectItem>
                              <SelectItem value="3">3 Stars & Up</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Price Range Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> Hourly Rate: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                          </label>
                          <Slider
                            min={0}
                            max={10000}
                            step={100}
                            value={priceRange}
                            onValueChange={(val: [number, number]) => setPriceRange(val)}
                            className="w-full"
                          />
                        </div>

                        <Button onClick={handleClearFilters} variant="outline" className="w-full mt-4">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              {/* Desktop Category Tabs (main display) */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mt-6 hidden sm:block">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2">
                  {SERVICE_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex flex-col items-center gap-2 p-3 text-center data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 rounded-xl"
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Service Provider Listing */}
          {(isLoading || isFetching) ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading professional services...</p>
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceProviderCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wrench className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Services Found</h3>
              <p className="text-md text-gray-600 mb-8">
                {searchTerm || selectedCategory !== 'all' || minRating !== 0 || priceRange[0] !== 0 || priceRange[1] !== 10000
                  ? 'No service providers match your current search and filter criteria. Try adjusting them!'
                  : 'It looks a bit empty here! Professional service providers will be added soon. Check back later!'
                }
              </p>
              <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md flex items-center gap-2">
                <Filter className="h-5 w-5" /> Clear All Filters
              </Button>
            </div>
          )}
        </div>

        <ServiceBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          service={selectedService}
        />
      </div>
    </MainLayout>
  );
};

export default Services;