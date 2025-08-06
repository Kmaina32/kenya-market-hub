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
  Loader2,
  ShoppingBag,
  Car,
  Building,
  Stethoscope,
  Shield,
  PartyPopper,
  Home,
  Users,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentBookingModal from '@/components/AppointmentBookingModal';

interface ServiceCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  requirements?: string[];
}

interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  total_reviews?: number | null;
  avatar_url?: string | null;
  email?: string | null;
  is_active?: boolean | null;
  verification_status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  location_address?: string | null;
  location_coordinates?: any | null;
  rating?: number | null;
  completed_jobs?: number | null;
  location?: string | null;
  hourly_rate?: number | null;
}

interface ApplicationStatus {
  category: string;
  status: 'none' | 'pending' | 'approved' | 'rejected';
  application_id?: string;
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

  const [isBookingModalOpen, setIsBookingModal] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ServiceProvider | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Service provider categories
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'vendor',
      name: 'Product Vendor',
      icon: ShoppingBag,
      description: 'Sell products on our marketplace platform',
      color: 'from-orange-500 to-red-600',
      requirements: ['Valid business license', 'Product catalog', 'Tax compliance']
    },
    {
      id: 'driver',
      name: 'Ride Driver',
      icon: Car,
      description: 'Provide taxi, motorbike or delivery services',
      color: 'from-blue-500 to-indigo-600',
      requirements: ['Valid driving license', 'Vehicle registration', 'Insurance cover']
    },
    {
      id: 'property_agent',
      name: 'Real Estate Agent',
      icon: Building,
      description: 'Help clients buy, sell or rent properties',
      color: 'from-purple-500 to-violet-600',
      requirements: ['Real estate license', 'Professional certification', 'Property portfolio']
    },
    {
      id: 'service_provider',
      name: 'Service Provider',
      icon: Wrench,
      description: 'Offer professional services like plumbing, electrical work',
      color: 'from-green-500 to-teal-600',
      requirements: ['Professional certification', 'Insurance cover', 'Work portfolio']
    },
    {
      id: 'medical_provider',
      name: 'Medical Professional',
      icon: Stethoscope,
      description: 'Provide healthcare and medical consultation services',
      color: 'from-red-500 to-pink-600',
      requirements: ['Medical license', 'Professional registration', 'Insurance cover']
    },
    {
      id: 'insurance_broker',
      name: 'Insurance Broker',
      icon: Shield,
      description: 'Help clients find the best insurance coverage',
      color: 'from-indigo-500 to-blue-600',
      requirements: ['Broker license', 'Professional certification', 'Regulatory compliance']
    },
    {
      id: 'event_promoter',
      name: 'Event Promoter',
      icon: PartyPopper,
      description: 'Organize and promote events and entertainment',
      color: 'from-pink-500 to-rose-600',
      requirements: ['Event management certification', 'Portfolio of events', 'Vendor network']
    }
  ];

  // Fetch user's application statuses
  const { data: applicationStatuses, isLoading: statusLoading } = useQuery<ApplicationStatus[]>({
    queryKey: ['userApplicationStatuses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const statuses: ApplicationStatus[] = [];
      
      // Check vendor applications
      const { data: vendorApp } = await supabase
        .from('vendor_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      statuses.push({
        category: 'vendor',
        status: vendorApp ? (vendorApp.status as 'pending' | 'approved' | 'rejected') : 'none',
        application_id: vendorApp?.id
      });

      // Check driver applications
      const { data: driverApp } = await supabase
        .from('driver_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      statuses.push({
        category: 'driver',
        status: driverApp ? (driverApp.status as 'pending' | 'approved' | 'rejected') : 'none',
        application_id: driverApp?.id
      });

      // Check service provider applications
      const { data: serviceApp } = await supabase
        .from('service_provider_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      statuses.push({
        category: 'service_provider',
        status: serviceApp ? (serviceApp.status as 'pending' | 'approved' | 'rejected') : 'none',
        application_id: serviceApp?.id
      });

      // Check medical provider applications
      const { data: medicalApp } = await supabase
        .from('medical_provider_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      statuses.push({
        category: 'medical_provider',
        status: medicalApp ? (medicalApp.status as 'pending' | 'approved' | 'rejected') : 'none',
        application_id: medicalApp?.id
      });

      // For other categories, default to 'none' for now
      ['property_agent', 'insurance_broker', 'event_promoter'].forEach(category => {
        statuses.push({
          category,
          status: 'none'
        });
      });

      return statuses;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const { data: featuredProviders, isLoading: providersLoading, error: providersError } = useQuery<ServiceProvider[]>({
    queryKey: ['featuredProviders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select(`
          id, user_id, business_name, email,
          is_active, created_at, updated_at,
          location_address, verification_status
        `)
        .eq('is_active', true)
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
      setIsBookingModal(false);
      queryClient.invalidateQueries({ queryKey: ['serviceBookings', user?.id] });
    },
    onError: (error: any) => {
      console.error("Error booking service:", error.message);
      toast.error(`Failed to book service: ${error.message}`);
    },
  });

  const getApplicationStatus = (categoryId: string): ApplicationStatus => {
    return applicationStatuses?.find(status => status.category === categoryId) || { category: categoryId, status: 'none' };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Applied</Badge>;
    }
  };

  const handleApplyForCategory = (categoryId: string) => {
    if (!user) {
      toast.warning("Please log in to apply");
      navigate('/auth');
      return;
    }
    navigate(`/service-provider-registration?type=${categoryId}`);
  };

  const handleAccessDashboard = (categoryId: string) => {
    switch (categoryId) {
      case 'vendor':
        navigate('/vendor-dashboard');
        break;
      case 'driver':
        navigate('/driver-dashboard');
        break;
      case 'property_agent':
        navigate('/property-owner-dashboard');
        break;
      case 'medical_provider':
        navigate('/medical-dashboard');
        break;
      default:
        navigate('/services-dashboard');
    }
  };

  const handleContactProvider = useCallback((provider: ServiceProvider) => {
    if (provider.email) {
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
    setIsBookingModal(true);
  }, [user, authLoading, navigate]);

  const heroImageUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=2070&q=80";
  const heroTitle = "Service Provider Hub";
  const heroSubtitle = "Join Our Marketplace";
  const heroDescription = "Apply to become a service provider across multiple categories and grow your business with Kenya's largest marketplace.";

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8 shadow-xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${heroImageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Wrench className="h-16 w-16 mx-auto mb-4 text-orange-100 drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">{heroTitle}</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                {heroSubtitle}
                {heroDescription && <span className="block">{heroDescription}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Service Provider Categories Grid */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Provider Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose your category and apply to join our marketplace. Each category has specific requirements and benefits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {serviceCategories.map((category) => {
                const status = getApplicationStatus(category.id);
                const IconComponent = category.icon;
                
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${category.color} text-white mb-4`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                        
                        <div className="mb-4">
                          {getStatusBadge(status.status)}
                        </div>

                        {/* Requirements */}
                        <div className="text-left mb-4">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Requirements:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {category.requirements?.slice(0, 2).map((req, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                            {category.requirements && category.requirements.length > 2 && (
                              <li className="text-gray-500">+{category.requirements.length - 2} more...</li>
                            )}
                          </ul>
                        </div>

                        {/* Action Button */}
                        {status.status === 'approved' ? (
                          <Button 
                            onClick={() => handleAccessDashboard(category.id)}
                            className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90`}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Access Dashboard
                          </Button>
                        ) : status.status === 'pending' ? (
                          <Button variant="outline" disabled className="w-full">
                            <Clock className="h-4 w-4 mr-2" />
                            Under Review
                          </Button>
                        ) : status.status === 'rejected' ? (
                          <Button 
                            onClick={() => handleApplyForCategory(category.id)}
                            variant="outline"
                            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Reapply
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleApplyForCategory(category.id)}
                            className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90`}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">5,000+</h3>
              <p className="text-gray-600">Active Providers</p>
            </Card>
            <Card className="text-center p-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">15,000+</h3>
              <p className="text-gray-600">Jobs Completed</p>
            </Card>
            <Card className="text-center p-6">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
              <p className="text-gray-600">Average Rating</p>
            </Card>
            <Card className="text-center p-6">
              <DollarSign className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">KSh 2M+</h3>
              <p className="text-gray-600">Total Earnings</p>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How to Join as a Service Provider</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Choose Category</h3>
                <p className="text-gray-600">Select the service category that matches your expertise and business.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Submit Application</h3>
                <p className="text-gray-600">Complete the application form with your business details and requirements.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Start Earning</h3>
                <p className="text-gray-600">Once approved, access your dashboard and start receiving bookings.</p>
              </div>
            </div>
          </div>

          {/* Provider Benefits */}
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900">
                Why Join Our Marketplace?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Earn More</h3>
                  <p className="text-gray-600">Set your own rates and increase your income by reaching more customers across multiple categories.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
                  <p className="text-gray-600">Work on your own terms and choose jobs that fit your schedule and expertise.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Multiple Categories</h3>
                  <p className="text-gray-600">Apply for multiple service categories and diversify your income streams.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of service providers who are growing their businesses with our platform. 
              Apply today and start earning tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => !user ? navigate('/auth') : window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg"
              >
                {user ? 'Choose Category Above' : 'Sign Up to Apply'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Appointment Booking Modal */}
        {selectedProviderForBooking && (
          <AppointmentBookingModal
            open={isBookingModalOpen}
            onOpenChange={(open) => {
              setIsBookingModal(open);
              if (!open) setSelectedProviderForBooking(null);
            }}
            providerName={selectedProviderForBooking.business_name}
            serviceType="Service Provider"
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
