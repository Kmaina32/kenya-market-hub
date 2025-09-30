
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui/responsive-container';
import MainLayout from '@/components/MainLayout';
import { 
  ShoppingBag, 
  Car, 
  Home as HomeIcon, 
  Wrench,
  Calendar,
  Stethoscope,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Users,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface ServiceProviderApplication {
  id: string;
  service_type: string;
  status: 'pending' | 'approved' | 'rejected';
  business_name: string;
  submitted_at: string;
}

interface ServiceProvider {
  id: string;
  category: string;
  verification_status: 'approved' | 'pending' | 'rejected';
  business_name: string;
  is_active: boolean;
}

const ServiceHub = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('browse');

  // Fetch user's applications
  const { data: myApplications = [] } = useQuery({
    queryKey: ['my-service-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('service_provider_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as ServiceProviderApplication[];
    },
    enabled: !!user
  });

// Fetch user's approved service provider profiles (using profiles table or other sources)
const myServiceProviders: any[] = [];

  const serviceCategories = [
    {
      id: 'vendor',
      title: 'Product Vendor',
      icon: ShoppingBag,
      description: 'Sell products on our marketplace platform',
      color: 'orange',
      dashboardPath: '/vendor-dashboard',
      benefits: ['Access to thousands of customers', 'Built-in payment processing', 'Inventory management tools']
    },
    {
      id: 'event_promoter',
      title: 'Event Promoter',
      icon: Calendar,
      description: 'Organize and promote events in your community',
      color: 'purple',
      dashboardPath: '/event-dashboard',
      benefits: ['Event management tools', 'Ticketing system', 'Marketing support']
    },
    {
      id: 'driver',
      title: 'Ride Driver',
      icon: Car,
      description: 'Provide transportation services (taxi, boda boda)',
      color: 'blue',
      dashboardPath: '/driver-dashboard',
      benefits: ['Flexible working hours', 'GPS navigation', 'Real-time earnings tracking']
    },
    {
      id: 'service_provider',
      title: 'Service Provider',
      icon: Wrench,
      description: 'Offer professional services (repair, maintenance, etc.)',
      color: 'green',
      dashboardPath: '/services-dashboard',
      benefits: ['Job matching system', 'Customer reviews', 'Secure payments']
    },
    {
      id: 'real_estate_agent',
      title: 'Real Estate Agent',
      icon: HomeIcon,
      description: 'List and manage property sales and rentals',
      color: 'teal',
      dashboardPath: '/real-estate-dashboard',
      benefits: ['Property listing tools', 'Lead management', 'Market analytics']
    },
    {
      id: 'medical_provider',
      title: 'Medical Provider',
      icon: Stethoscope,
      description: 'Provide healthcare services and consultations',
      color: 'red',
      dashboardPath: '/medical-dashboard',
      benefits: ['Patient management', 'Appointment scheduling', 'Telemedicine support']
    },
    {
      id: 'insurance_broker',
      title: 'Insurance Broker',
      icon: Shield,
      description: 'Offer insurance products and advisory services',
      color: 'indigo',
      dashboardPath: '/insurance-dashboard',
      benefits: ['Policy management', 'Claims processing', 'Customer portal']
    }
  ];

// Get application status for a category
const getApplicationStatus = (category: string) => {
  const application = myApplications.find(app => app.service_type === category);
  if (application) return application.status;
  return null;
};

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            Not Applied
          </Badge>
        );
    }
  };

  const getActionButton = (category: string, status: string | null) => {
    if (status === 'approved') {
      const service = serviceCategories.find(s => s.id === category);
      return (
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link to={service?.dashboardPath || '/dashboard'}>
            <span>Access Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      );
    }

    if (status === 'pending') {
      return (
        <Button disabled className="w-full bg-yellow-100 text-yellow-800 cursor-not-allowed">
          <Clock className="w-4 h-4 mr-2" />
          <span>Under Review</span>
        </Button>
      );
    }

    const buttonText = status === 'rejected' ? 'Reapply Now' : 'Apply Now';
    return (
      <Button asChild variant="outline" className="w-full">
        <Link to={`/service-provider-registration?category=${category}`}>
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
    );
  };

// Stats for approved and pending based on applications
const approvedCount = myApplications.filter(app => app.status === 'approved').length;
const pendingCount = myApplications.filter(app => app.status === 'pending').length;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Service Provider Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our platform as a service provider and connect with thousands of customers across Kenya
            </p>
          </div>

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Active Services</p>
                      <p className="text-3xl font-bold">{approvedCount}</p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Pending Applications</p>
                      <p className="text-3xl font-bold">{pendingCount}</p>
                    </div>
                    <Clock className="h-10 w-10 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Categories Available</p>
                      <p className="text-3xl font-bold">{serviceCategories.length}</p>
                    </div>
                    <Users className="h-10 w-10 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="browse">Browse Services</TabsTrigger>
              <TabsTrigger value="my-services">My Services</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <ResponsiveGrid cols={{ default: 1, md: 2, xl: 3 }}>
                {serviceCategories.map((service) => {
                  const ServiceIcon = service.icon;
                  const status = getApplicationStatus(service.id);
                  
                  return (
                    <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-4 rounded-2xl bg-${service.color}-100 group-hover:scale-110 transition-transform`}>
                            <ServiceIcon className={`h-8 w-8 text-${service.color}-600`} />
                          </div>
                          {getStatusBadge(status)}
                        </div>
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </CardTitle>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800">Benefits:</h4>
                          <ul className="space-y-1">
                            {service.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="pt-2">
                          {getActionButton(service.id, status)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </ResponsiveGrid>
            </TabsContent>

            <TabsContent value="my-services">
              {!user ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-4">Sign In Required</h3>
                    <p className="text-gray-600 mb-6">Please sign in to view your service applications and dashboards</p>
                    <Button asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Active Services */}
                  {myServiceProviders.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Active Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }}>
                          {myServiceProviders.map((provider) => {
                            const service = serviceCategories.find(s => s.id === provider.category);
                            if (!service) return null;
                            
                            const ServiceIcon = service.icon;
                            
                            return (
                              <Card key={provider.id} className="border-green-200 bg-green-50">
                                <CardHeader className="pb-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl bg-${service.color}-100`}>
                                      <ServiceIcon className={`h-6 w-6 text-${service.color}-600`} />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">{service.title}</h3>
                                      <Badge className="bg-green-100 text-green-800 border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Active
                                      </Badge>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <Button asChild className="w-full">
                                    <Link to={service.dashboardPath}>
                                      Access Dashboard
                                      <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                  </Button>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </ResponsiveGrid>
                      </CardContent>
                    </Card>
                  )}

                  {/* Pending Applications */}
                  {myApplications.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-600" />
                          Application Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
            {myApplications.map((application) => {
              const service = serviceCategories.find(s => s.id === application.service_type);
              if (!service) return null;
                            
                            const ServiceIcon = service.icon;
                            
                            return (
                              <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg bg-${service.color}-100`}>
                                    <ServiceIcon className={`h-5 w-5 text-${service.color}-600`} />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{service.title}</h4>
                                    <p className="text-sm text-gray-600">
                                      Applied on {new Date(application.submitted_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                {getStatusBadge(application.status)}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {myServiceProviders.length === 0 && myApplications.length === 0 && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-4">No Services Yet</h3>
                        <p className="text-gray-600 mb-6">
                          You haven't applied for any services yet. Browse available categories and start your journey as a service provider.
                        </p>
                        <Button onClick={() => setSelectedTab('browse')}>
                          Browse Services
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-12">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Business Journey?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of successful service providers on our platform and grow your business with powerful tools and dedicated support.
              </p>
              {!user ? (
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/auth">Get Started Today</Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" onClick={() => setSelectedTab('browse')}>
                  Explore Service Categories
                </Button>
              )}
            </CardContent>
          </Card>
      </div>
    </MainLayout>
  );
};

export default ServiceHub;
