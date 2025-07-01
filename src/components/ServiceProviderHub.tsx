
import React from 'react';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui/responsive-container';
import ServiceTypeCard from '@/components/service-hub/ServiceTypeCard';
import HelpSection from '@/components/service-hub/HelpSection';
import { 
  ShoppingBag, 
  Car, 
  Home as HomeIcon, 
  Wrench,
  Stethoscope
} from 'lucide-react';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useAllServiceProviderProfiles } from '@/hooks/useServiceProviders';

const ServiceProviderHub = () => {
  const { data: vendorProfile } = useMyVendorProfile();
  const { data: allProfiles } = useAllServiceProviderProfiles();

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
          {serviceTypes.map((service) => (
            <ServiceTypeCard key={service.id} service={service} />
          ))}
        </ResponsiveGrid>

        {/* Help Section */}
        <HelpSection />
      </div>
    </ResponsiveContainer>
  );
};

export default ServiceProviderHub;
