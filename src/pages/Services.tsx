
import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceBookingModal from '@/components/modals/ServiceBookingModal';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery({
    queryKey: ['service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .eq('is_active', true)
        .eq('verification_status', 'verified');
      
      if (error) throw error;
      return data || [];
    }
  });

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: Wrench },
    { id: 'home', name: 'Home Services', icon: Home },
    { id: 'automotive', name: 'Automotive', icon: Car },
    { id: 'beauty', name: 'Beauty & Wellness', icon: Scissors },
    { id: 'moving', name: 'Moving & Delivery', icon: Truck },
    { id: 'maintenance', name: 'Maintenance', icon: PaintBucket },
  ];

  const filteredServices = services?.filter(service => {
    const matchesSearch = service.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.business_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           service.provider_type?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  }) || [];

  const handleBookService = (service: any) => {
    setSelectedService({
      id: service.id,
      title: service.business_name,
      provider: service.business_name,
      type: service.provider_type
    });
    setShowBookingModal(true);
  };

  const handleContactProvider = (service: any) => {
    if (service.phone_number) {
      window.location.href = `tel:${service.phone_number}`;
      toast({
        title: "Calling Provider",
        description: "Opening phone dialer...",
      });
    } else {
      toast({
        title: "Contact Information",
        description: "Phone number not available for this provider.",
        variant: "destructive"
      });
    }
  };

  const handleViewProfile = (serviceId: string) => {
    toast({
      title: "Provider Profile",
      description: "Opening provider profile...",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Background Image - Added proper padding and rounded borders */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Wrench className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Professional Services</h1>
              <p className="text-lg text-orange-100 mb-6">
                Connect with verified professionals for home services, repairs, beauty treatments, and more across Kenya
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Categories */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base border-orange-200 focus:border-orange-400 rounded-xl"
                />
              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2">
                {serviceCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No services match your current criteria.' 
                  : 'Service providers will be available soon.'
                }
              </p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        {service.provider_type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-900 line-clamp-1">
                      {service.business_name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {service.business_description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="truncate">{service.location_address || 'Location available'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge 
                        variant={service.verification_status === 'verified' ? 'default' : 'secondary'}
                        className={service.verification_status === 'verified' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {service.verification_status === 'verified' ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleBookService(service)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactProvider(service)}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
