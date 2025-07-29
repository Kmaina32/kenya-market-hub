import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  User,
  MessageSquare,
  Filter,
  Grid,
  List,
  ChevronRight,
  Briefcase,
  Home,
  Car,
  Wrench,
  Scissors,
  Heart,
  GraduationCap,
  Camera,
  Palette,
  Music,
  Dumbbell,
  ShoppingBag,
  Utensils,
  Package,
  Truck,
  Shield,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import PageContainer from '@/components/shared/PageContainer';
import HeroSection from '@/components/shared/HeroSection';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews_count: number;
  price_range: string;
  location: string;
  phone: string;
  email: string;
  image_url?: string;
  is_verified: boolean;
  response_time: string;
  availability: string;
  services: string[];
  experience_years: number;
  completed_jobs: number;
}

interface BookingRequest {
  provider_id: string;
  service_type: string;
  description: string;
  preferred_date: string;
  preferred_time: string;
  location: string;
  budget: string;
  contact_phone: string;
  contact_email: string;
}

const ServiceHubUnified = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [bookingData, setBookingData] = useState<BookingRequest>({
    provider_id: '',
    service_type: '',
    description: '',
    preferred_date: '',
    preferred_time: '',
    location: '',
    budget: '',
    contact_phone: '',
    contact_email: user?.email || ''
  });

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: Grid, color: 'bg-gray-100' },
    { id: 'home_services', name: 'Home Services', icon: Home, color: 'bg-blue-100' },
    { id: 'automotive', name: 'Automotive', icon: Car, color: 'bg-red-100' },
    { id: 'repair_maintenance', name: 'Repair & Maintenance', icon: Wrench, color: 'bg-orange-100' },
    { id: 'beauty_wellness', name: 'Beauty & Wellness', icon: Scissors, color: 'bg-pink-100' },
    { id: 'health_fitness', name: 'Health & Fitness', icon: Heart, color: 'bg-green-100' },
    { id: 'education_tutoring', name: 'Education & Tutoring', icon: GraduationCap, color: 'bg-purple-100' },
    { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-indigo-100' },
    { id: 'creative_design', name: 'Creative & Design', icon: Palette, color: 'bg-yellow-100' },
    { id: 'entertainment', name: 'Entertainment', icon: Music, color: 'bg-teal-100' },
    { id: 'personal_training', name: 'Personal Training', icon: Dumbbell, color: 'bg-cyan-100' },
    { id: 'shopping_delivery', name: 'Shopping & Delivery', icon: ShoppingBag, color: 'bg-emerald-100' },
    { id: 'food_catering', name: 'Food & Catering', icon: Utensils, color: 'bg-amber-100' },
    { id: 'logistics', name: 'Logistics', icon: Package, color: 'bg-slate-100' },
    { id: 'transportation', name: 'Transportation', icon: Truck, color: 'bg-stone-100' },
    { id: 'security', name: 'Security', icon: Shield, color: 'bg-rose-100' },
    { id: 'consulting', name: 'Consulting', icon: Briefcase, color: 'bg-violet-100' }
  ];

  const locations = [
    'all', 'Nairobi CBD', 'Westlands', 'Karen', 'Kilimani', 'Lavington', 
    'Kileleshwa', 'Parklands', 'Eastleigh', 'South B', 'South C', 
    'Kasarani', 'Thika Road', 'Ngong Road', 'Mombasa Road'
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'budget', label: 'Budget (KSh 500 - 2,000)' },
    { value: 'mid', label: 'Mid-range (KSh 2,000 - 5,000)' },
    { value: 'premium', label: 'Premium (KSh 5,000+)' }
  ];

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, selectedCategory, selectedLocation, priceRange, sortBy]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load service providers');
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = [...providers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.services.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(provider => provider.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(provider => 
        provider.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(provider => provider.price_range === priceRange);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews_count - a.reviews_count;
        case 'experience':
          return b.experience_years - a.experience_years;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProviders(filtered);
  };

  const handleBookService = (provider: ServiceProvider) => {
    if (!user) {
      toast.error('Please log in to book a service');
      return;
    }
    setSelectedProvider(provider);
    setBookingData(prev => ({
      ...prev,
      provider_id: provider.id,
      contact_email: user.email || ''
    }));
    setShowBookingModal(true);
  };

  const submitBookingRequest = async () => {
    try {
      if (!user) {
        toast.error('Please log in to book a service');
        return;
      }

      const { error } = await supabase
        .from('service_bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Booking request submitted successfully!');
      setShowBookingModal(false);
      setBookingData({
        provider_id: '',
        service_type: '',
        description: '',
        preferred_date: '',
        preferred_time: '',
        location: '',
        budget: '',
        contact_phone: '',
        contact_email: user.email || ''
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking request');
    }
  };

  const ServiceProviderCard = ({ provider }: { provider: ServiceProvider }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-orange-100 rounded-2xl overflow-hidden group">
      <div className="relative">
        <img
          src={provider.image_url || '/placeholder.svg'}
          alt={provider.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {provider.is_verified && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
            {provider.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{provider.rating}</span>
            <span className="text-xs text-gray-500">({provider.reviews_count})</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {provider.location}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            Response time: {provider.response_time}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Award className="h-3 w-3 mr-1" />
            {provider.experience_years} years experience
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {provider.services.slice(0, 3).map((service, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {service}
            </Badge>
          ))}
          {provider.services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{provider.services.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500">From </span>
            <span className="font-bold text-orange-600">{provider.price_range}</span>
          </div>
          <Button
            onClick={() => handleBookService(provider)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 text-sm rounded-xl"
          >
            Book Now
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ServiceProviderListItem = ({ provider }: { provider: ServiceProvider }) => (
    <Card className="hover:shadow-md transition-shadow border-orange-100 rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={provider.image_url || '/placeholder.svg'}
            alt={provider.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors">
                  {provider.name}
                  {provider.is_verified && (
                    <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                  )}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{provider.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{provider.rating}</span>
                <span className="text-xs text-gray-500">({provider.reviews_count})</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {provider.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {provider.response_time}
              </div>
              <div className="flex items-center">
                <Award className="h-3 w-3 mr-1" />
                {provider.experience_years} years
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {provider.services.slice(0, 4).map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <span className="text-gray-500">From </span>
                  <span className="font-bold text-orange-600">{provider.price_range}</span>
                </div>
                <Button
                  onClick={() => handleBookService(provider)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 text-sm rounded-xl"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <PageContainer>
        <HeroSection
          title="Multi-Service Hub"
          subtitle="One platform for all your service needs"
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6 border-orange-100 rounded-2xl">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{providers.length}+</div>
            <div className="text-sm text-gray-600">Service Providers</div>
          </Card>
          <Card className="text-center p-6 border-orange-100 rounded-2xl">
            <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Available Services</div>
          </Card>
          <Card className="text-center p-6 border-orange-100 rounded-2xl">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </Card>
          <Card className="text-center p-6 border-orange-100 rounded-2xl">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">5K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </Card>
        </div>

        {/* Service Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl ${
                    selectedCategory === category.id
                      ? 'ring-2 ring-orange-500 bg-orange-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-orange-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search services, providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-500 rounded-xl"
                  />
                </div>
              </div>
              
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-2 border border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none"
              >
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
                <option value="experience">Sort by Experience</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {filteredProviders.length} service providers found
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-xl"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-xl"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Providers */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service providers...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No service providers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocation('all');
                setPriceRange('all');
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredProviders.map((provider) =>
              viewMode === 'grid' ? (
                <ServiceProviderCard key={provider.id} provider={provider} />
              ) : (
                <ServiceProviderListItem key={provider.id} provider={provider} />
              )
            )}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl">
                <CardTitle className="flex items-center justify-between">
                  <span>Book Service with {selectedProvider.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBookingModal(false)}
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      value={bookingData.service_type}
                      onChange={(e) => setBookingData(prev => ({ ...prev, service_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">Select a service</option>
                      {selectedProvider.services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Range
                    </label>
                    <Input
                      placeholder="e.g., KSh 2,000 - 5,000"
                      value={bookingData.budget}
                      onChange={(e) => setBookingData(prev => ({ ...prev, budget: e.target.value }))}
                      className="border-gray-300 focus:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      value={bookingData.preferred_date}
                      onChange={(e) => setBookingData(prev => ({ ...prev, preferred_date: e.target.value }))}
                      className="border-gray-300 focus:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time
                    </label>
                    <Input
                      type="time"
                      value={bookingData.preferred_time}
                      onChange={(e) => setBookingData(prev => ({ ...prev, preferred_time: e.target.value }))}
                      className="border-gray-300 focus:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Input
                      placeholder="Service location"
                      value={bookingData.location}
                      onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                      className="border-gray-300 focus:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <Input
                      placeholder="Your phone number"
                      value={bookingData.contact_phone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, contact_phone: e.target.value }))}
                      className="border-gray-300 focus:border-orange-500 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Description
                  </label>
                  <Textarea
                    placeholder="Describe what you need in detail..."
                    value={bookingData.description}
                    onChange={(e) => setBookingData(prev => ({ ...prev, description: e.target.value }))}
                    className="border-gray-300 focus:border-orange-500 rounded-xl"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={submitBookingRequest}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
                  >
                    Submit Booking Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageContainer>
    </MainLayout>
  );
};

export default ServiceHubUnified;
