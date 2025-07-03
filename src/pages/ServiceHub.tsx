import React, { useState, useEffect, useCallback } from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  User, 
  Star, 
  MapPin, 
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2 
} from 'lucide-react';
import HeroSection from '@/components/shared/HeroSection';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client'; 
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentBookingModal from '@/components/AppointmentBookingModal';

interface ServiceCategory {
  id: string;
  name: string;
  icon_emoji?: string;
  description?: string;
}

// FIX: ServiceProvider interface updated based on "column does not exist" errors
// These properties are removed/made optional because your DB is reporting them missing from select('*')
interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;        // Provider's business name/full name (assumed to exist)
  
  // Properties below were explicitly reported as "column does not exist"
  // You need to find their correct names in your DB and add them back with their actual names
  // rating: number;              
  total_reviews?: number | null; 
  // completed_jobs: number;    
  // location: string;            
  // hourly_rate: number;         

  avatar_url?: string | null;   
  phone?: string | null;        
  email?: string | null;        
  is_active?: boolean | null;
  is_verified?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  
  business_description?: string | null;
  documents?: Json | null;
  location_address?: string | null; 
  location_coordinates?: any | null;
  verification_status?: string | null;

  // IMPORTANT: If your DB has alternative names for the removed fields, add them here.
  // Example:
  // average_rating?: number | null;
  // jobs_completed_count?: number | null;
  // provider_location_name?: string | null;
  // price_per_hour?: number | null;
  // service_type_name?: string | null; // For specialization
}

interface ServiceBookingData {
  providerId: string;
  serviceName: string;
  bookingDate: Date;
  timeSlot: string;
}

const ServiceHub = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ServiceProvider | null>(null);

  const { data: serviceCategories, isLoading: categoriesLoading, error: categoriesError } = useQuery<ServiceCategory[]>({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching service categories:", error.message);
        toast.error("Failed to load service categories.");
        throw error;
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: featuredProviders, isLoading: providersLoading, error: providersError } = useQuery<ServiceProvider[]>({
    queryKey: ['featuredProviders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        // FIX: Explicitly select ONLY the columns that exist and are needed.
        // Removed 'specialization', 'rating', 'completed_jobs', 'location', 'hourly_rate'
        // due to "column does not exist" errors.
        .select(`
          id, user_id, business_name, avatar_url, phone, email,
          is_active, is_verified, created_at, updated_at,
          business_description, documents, location_address, location_coordinates, verification_status
          -- You MUST add columns here if they exist under different names (e.g., avg_rating, jobs_done, city)
          -- and update the ServiceProvider interface accordingly.
        `) 
        .eq('is_active', true)
        .eq('is_verified', true)
        // If 'rating' column does not exist, ordering by it will cause an error.
        // Temporarily remove or replace this line if 'rating' truly isn't there.
        // .order('rating', { ascending: false, nullsFirst: false }) 
        .limit(2);

      if (error) {
        console.error("Error fetching featured providers:", error.message);
        toast.error("Failed to load featured providers.");
        throw error;
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const bookServiceMutation = useMutation({
    mutationFn: async ({ providerId, serviceName, bookingDate, timeSlot }: ServiceBookingData) => {
      if (!user) throw new Error("User not authenticated.");

      const { data, error } = await supabase
        .from('service_bookings')
        .insert({
          user_id: user.id,
          provider_id: providerId,
          booking_date: bookingDate.toISOString().split('T')[0],
          time_slot: timeSlot,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Service booked successfully! Awaiting provider confirmation.");
      setIsBookingModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['serviceBookings', user?.id] });
    },
    onError: (error: any) => {
      console.error("Error booking service:", error.message);
      toast.error(`Failed to book service: ${error.message}`);
    },
  });

  const handleApplyProvider = useCallback(() => {
    navigate('/service-provider-registration');
  }, [navigate]);

  const handleManageServices = useCallback(() => {
    if (authLoading) {
      toast.info("Loading user data, please wait...");
      return;
    }
    if (!user) {
      toast.warning("Please log in to manage services.");
      navigate('/auth');
      return;
    }
    navigate('/services-dashboard');
  }, [navigate, user, authLoading]);

  const handleContactProvider = useCallback((provider: ServiceProvider) => {
    if (provider.phone) {
      alert(`Contacting ${provider.business_name} at ${provider.phone}.`);
    } else if (provider.email) {
      alert(`Emailing ${provider.business_name} at ${provider.email}.`);
    } else {
      toast.info(`No direct contact info available for ${provider.business_name}.`);
    }
  }, []);

  const handleBookService = useCallback((provider: ServiceProvider) => {
    if (authLoading) {
      toast.info("Loading user data, please wait...");
      return;
    }
    if (!user) {
      toast.warning("Please log in to book a service.");
      navigate('/auth');
      return;
    }
    setSelectedProviderForBooking(provider);
    setIsBookingModalOpen(true);
  }, [user, authLoading, navigate]);

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <HeroSection
            title="Service Hub"
            subtitle="Join Our Community"
            description="Apply to become a service provider and grow your business with Kenya's largest marketplace"
            imageUrl="photo-1560472354-b33ff0c44a43"
            className="mb-8 h-64 rounded-3xl"
          />

          <div className="max-w-6xl mx-auto">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={handleApplyProvider}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-14 text-lg font-semibold"
              >
                <User className="h-5 w-5 mr-2" />
                Apply to Become a Provider
              </Button>
              <Button 
                onClick={handleManageServices}
                variant="outline"
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 h-14 text-lg font-semibold bg-white"
              >
                <Wrench className="h-5 w-5 mr-2" />
                Manage My Services
              </Button>
            </div>

            {/* Service Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Service Categories</h2>
              {categoriesLoading ? (
                <div className="text-center py-6">
                  <Loader2 className="h-8 w-8 text-orange-600 animate-spin mx-auto" />
                  <p className="text-gray-600">Loading categories...</p>
                </div>
              ) : categoriesError ? (
                <div className="text-center py-6 text-red-600">
                  <p>Error loading categories: {categoriesError.message}</p>
                </div>
              ) : (serviceCategories || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(serviceCategories || []).map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow bg-white border-orange-100">
                      <CardHeader className="text-center">
                        <div className="text-4xl mb-2">{category.icon_emoji || '⚙️'}</div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg. Rating:</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">4.5+</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Providers:</span>
                          <span className="font-medium">20+</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-semibold text-orange-600">KSh 1500</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600">
                  <p>No service categories found.</p>
                </div>
              )}
            </div>

            {/* Featured Providers */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Service Providers</h2>
              {providersLoading ? (
                <div className="text-center py-6">
                  <Loader2 className="h-8 w-8 text-orange-600 animate-spin mx-auto" />
                  <p className="text-gray-600">Loading featured providers...</p>
                </div>
              ) : providersError ? (
                <div className="text-center py-6 text-red-600">
                  <p>Error loading providers: {providersError.message}</p>
                </div>
              ) : (featuredProviders || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(featuredProviders || []).map((provider) => (
                    <Card key={provider.id} className="hover:shadow-lg transition-shadow bg-white border-orange-100">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={provider.avatar_url || '/placeholder-avatar.png'}
                            alt={provider.business_name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{provider.business_name}</h3>
                            <p className="text-orange-600 font-medium mb-2">Service Provider</p> {/* Placeholder */}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                {/* FIX: Removed rating display, as column doesn't exist */}
                                <Star className="h-4 w-4 text-gray-400 mr-1" />
                                <span>N/A</span> 
                              </div>
                              <div className="flex items-center">
                                {/* FIX: Removed completed_jobs display, as column doesn't exist */}
                                <CheckCircle className="h-4 w-4 text-gray-400 mr-1" />
                                <span>N/A jobs</span>
                              </div>
                              <div className="flex items-center">
                                {/* FIX: Removed location display, as column doesn't exist */}
                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                <span>N/A</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-orange-600 font-semibold">
                                {/* FIX: Removed hourly_rate display, as column doesn't exist */}
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span>KSh N/A/hr</span>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                                  onClick={() => handleContactProvider(provider)}
                                >
                                  <Phone className="h-4 w-4 mr-1" />
                                  Contact
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                  onClick={() => handleBookService(provider)}
                                >
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Book
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600">
                  <p>No featured service providers found.</p>
                </div>
              )}
            </div>

            {/* Provider Benefits */}
            <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-900">
                  Why Join as a Service Provider?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Earn More</h3>
                    <p className="text-gray-600">Set your own rates and increase your income by reaching more customers.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
                    <p className="text-gray-600">Work on your own terms and choose jobs that fit your schedule.</p>
                  </div>
                  <div className="text-center"> 
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Build Reputation</h3>
                    <p className="text-gray-600">Gain reviews and build a strong reputation to attract more clients.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointment Booking Modal */}
        {selectedProviderForBooking && (
          <AppointmentBookingModal
            open={isBookingModalOpen}
            onOpenChange={(open) => {
              setIsBookingModalOpen(open);
              if (!open) setSelectedProviderForBooking(null);
            }}
            providerName={selectedProviderForBooking.business_name}
            serviceType={"Service Provider"}
            onBookingSubmit={({ date, time }) => {
              bookServiceMutation.mutate({
                providerId: selectedProviderForBooking.id,
                serviceName: selectedProviderForBooking.business_name,
                bookingDate: date,
                timeSlot: time,
              });
            }}
            isLoading={bookServiceMutation.isPending}
          />
        )}
      </div>
    </FrontendLayout>
  );
};

export default ServiceHub;