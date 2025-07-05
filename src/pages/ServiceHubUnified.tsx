
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Car, 
  Building, 
  Wrench,
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight,
  Plus,
  UserPlus,
  Stethoscope,
  UtensilsCrossed,
  Calendar,
  Users,
  Briefcase,
  Heart
} from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/shared/HeroSection';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import VendorApplicationModal from '@/components/VendorApplicationModal';

const ServiceHubUnified = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const serviceProviderTypes = [
    {
      id: 'restaurant',
      title: 'Restaurant Owner',
      description: 'List your restaurant and manage food delivery services',
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-orange-600',
      applicationUrl: '/service-provider-registration?type=restaurant'
    },
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'Sell products online and manage your e-commerce business',
      icon: Store,
      color: 'from-blue-500 to-blue-600',
      isModal: true
    },
    {
      id: 'medical',
      title: 'Medical Provider',
      description: 'Offer medical services and connect with patients',
      icon: Stethoscope,
      color: 'from-green-500 to-green-600',
      applicationUrl: '/service-provider-registration?type=medical'
    },
    {
      id: 'event_organizer',
      title: 'Event Organizer',
      description: 'Create and manage events, sell tickets, coordinate logistics',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      applicationUrl: '/service-provider-registration?type=event_organizer'
    },
    {
      id: 'driver',
      title: 'Driver',
      description: 'Provide transportation services and earn money driving',
      icon: Car,
      color: 'from-yellow-500 to-yellow-600',
      applicationUrl: '/service-provider-registration?type=driver'
    },
    {
      id: 'property_owner',
      title: 'Property Owner',
      description: 'List and manage your real estate properties',
      icon: Building,
      color: 'from-indigo-500 to-indigo-600',
      applicationUrl: '/service-provider-registration?type=property_owner'
    },
    {
      id: 'service_provider',
      title: 'Service Provider',
      description: 'Offer professional services like plumbing, electrical, cleaning',
      icon: Wrench,
      color: 'from-red-500 to-red-600',
      applicationUrl: '/service-provider-registration?type=service_provider'
    },
    {
      id: 'agent',
      title: 'Sales Agent',
      description: 'Become a regional sales representative and earn commissions',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      applicationUrl: '/service-provider-registration?type=agent'
    },
    {
      id: 'employer',
      title: 'Employer',
      description: 'Post job listings and hire talented professionals',
      icon: Briefcase,
      color: 'from-pink-500 to-pink-600',
      applicationUrl: '/service-provider-registration?type=employer'
    }
  ];

  const handleApply = (provider: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (provider.isModal) {
      setIsVendorModalOpen(true);
    } else {
      navigate(provider.applicationUrl);
    }
  };

  return (
    <FrontendLayout>
      <div className="space-y-8">
        <HeroSection
          title="Service Hub"
          subtitle="Join Our Community"
          description="Apply to become a service provider and grow your business with Kenya's largest marketplace"
          imageUrl="photo-1460925895917-afdab827c52f"
        />

        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="apply" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="apply">Apply to Become a Provider</TabsTrigger>
              <TabsTrigger value="manage">Manage My Services</TabsTrigger>
            </TabsList>

            <TabsContent value="apply">
              {/* Introduction */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Choose Your Service Category
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Select the category that best describes your business. Each application is reviewed by our team 
                  to ensure quality and reliability for our customers.
                </p>
              </div>

              {/* Service Provider Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {serviceProviderTypes.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${provider.color} text-white`}>
                          <provider.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">{provider.title}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-600">
                        {provider.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleApply(provider)}
                        className={`w-full bg-gradient-to-r ${provider.color} hover:opacity-90 text-white`}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Process Steps */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-center mb-8">Application Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Submit Application</h4>
                    <p className="text-sm text-gray-600">Fill out the application form with your business details</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Document Review</h4>
                    <p className="text-sm text-gray-600">Our team reviews your documents and credentials</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Verification</h4>
                    <p className="text-sm text-gray-600">We verify your business registration and licenses</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold">4</span>
                    </div>
                    <h4 className="font-semibold mb-2">Get Approved</h4>
                    <p className="text-sm text-gray-600">Once approved, access your service provider dashboard</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manage">
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold mb-4">Manage Your Services</h3>
                <p className="text-gray-600 mb-6">
                  Access your service provider dashboard to manage your listings, bookings, and earnings.
                </p>
                <Button onClick={() => navigate('/service-provider-hub')} className="bg-orange-600 hover:bg-orange-700">
                  Go to Service Provider Hub
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Benefits Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Why Join Sokko Sasa?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Large Customer Base</h4>
                <p className="text-gray-600">Access thousands of potential customers across Kenya</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Trusted Platform</h4>
                <p className="text-gray-600">Join a verified marketplace that customers trust</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Easy Management</h4>
                <p className="text-gray-600">Powerful dashboard tools to manage your business</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VendorApplicationModal open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen} />
    </FrontendLayout>
  );
};

export default ServiceHubUnified;
