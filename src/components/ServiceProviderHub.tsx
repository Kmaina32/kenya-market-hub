
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui/responsive-container';
import { 
  ShoppingBag, 
  Car, 
  Home as HomeIcon, 
  Wrench,
  Stethoscope,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useAllServiceProviderProfiles } from '@/hooks/useServiceProviders';
import { Link } from 'react-router-dom';

const ServiceProviderHub = () => {
  const { data: vendorProfile } = useMyVendorProfile();
  const { data: allProfiles } = useAllServiceProviderProfiles();

  // Helper function to get profile by provider type
  const getProfileByType = (type: string) => {
    return allProfiles?.find(profile => profile.provider_type === type);
  };

  const serviceTypes = [
    {
      id: 'vendor',
      title: 'Product Vendor',
      icon: ShoppingBag,
      description: 'Sell products on our marketplace',
      profile: vendorProfile,
      color: 'orange',
      dashboardPath: '/vendor',
      registrationPath: '/vendor-registration'
    },
    {
      id: 'driver',
      title: 'Ride Driver',
      icon: Car,
      description: 'Provide taxi or motorbike rides',
      profile: getProfileByType('driver'),
      color: 'blue',
      dashboardPath: '/driver-app',
      registrationPath: '/driver-registration'
    },
    {
      id: 'property_owner',
      title: 'Property Owner',
      icon: HomeIcon,
      description: 'List properties for sale or rent',
      profile: getProfileByType('property_owner'),
      color: 'purple',
      dashboardPath: '/property-owner',
      registrationPath: '/property-owner-registration'
    },
    {
      id: 'service_provider',
      title: 'Service Provider',
      icon: Wrench,
      description: 'Offer professional services',
      profile: getProfileByType('service_provider'),
      color: 'green',
      dashboardPath: '/services-app',
      registrationPath: '/service-provider-registration'
    },
    {
      id: 'medical_provider',
      title: 'Medical Provider',
      icon: Stethoscope,
      description: 'Provide healthcare services',
      profile: null,
      color: 'red',
      dashboardPath: '/medical-provider',
      registrationPath: '/medical-provider-registration'
    }
  ];

  const getStatusBadge = (status?: string) => {
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
            Pending
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
            Not Registered
          </Badge>
        );
    }
  };

  const getActionButton = (service: any) => {
    const isApproved = service.profile?.verification_status === 'approved';
    const isPending = service.profile?.verification_status === 'pending';
    const isRejected = service.profile?.verification_status === 'rejected';

    if (isApproved) {
      return (
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link to={service.dashboardPath}>
            <span>Access Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      );
    }

    if (isPending) {
      return (
        <Button disabled className="w-full bg-yellow-100 text-yellow-800 cursor-not-allowed">
          <Clock className="w-4 h-4 mr-2" />
          <span>Application Under Review</span>
        </Button>
      );
    }

    if (isRejected) {
      return (
        <Button asChild variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
          <Link to={service.registrationPath}>
            <span>Reapply Now</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      );
    }

    // Not registered or no status
    return (
      <Button asChild variant="outline" className="w-full">
        <Link to={service.registrationPath}>
          <span>Apply Now</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
    );
  };

  return (
    <ResponsiveContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Service Provider Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our platform as a service provider and grow your business with access to thousands of customers.
          </p>
        </div>

        {/* Service Types Grid */}
        <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }}>
          {serviceTypes.map((service) => {
            const ServiceIcon = service.icon;
            
            return (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-60">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl bg-${service.color}-100`}>
                      <ServiceIcon className={`h-6 w-6 text-${service.color}-600`} />
                    </div>
                    {getStatusBadge(service.profile?.verification_status)}
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2">
                    {getActionButton(service)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </ResponsiveGrid>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-blue-900">
              Need Help Getting Started?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto space-y-2">
                <div className="text-2xl">📚</div>
                <span className="font-medium">Read Guidelines</span>
                <span className="text-xs text-gray-600">Learn about requirements</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto space-y-2">
                <div className="text-2xl">💬</div>
                <span className="font-medium">Contact Support</span>
                <span className="text-xs text-gray-600">Get help from our team</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto space-y-2">
                <div className="text-2xl">📈</div>
                <span className="font-medium">Success Stories</span>
                <span className="text-xs text-gray-600">See how others succeed</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveContainer>
  );
};

export default ServiceProviderHub;
