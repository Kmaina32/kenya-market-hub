
import React, { useState } from 'react';
import { useServiceProviders } from '@/hooks/useServiceProviders';
import { useCreateServiceBooking } from '@/hooks/useServiceBookings';
import MainLayout from '@/components/MainLayout';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { UnifiedInput, UnifiedSelect } from '@/components/ui/UnifiedForm';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import HeroSection from '@/components/shared/HeroSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Wrench, 
  Zap, 
  Paintbrush, 
  Hammer, 
  Scissors,
  GraduationCap,
  Camera,
  Utensils,
  Car
} from 'lucide-react';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const { data: providers = [], isLoading } = useServiceProviders();
  const { mutate: createBooking, isPending: isBookingPending } = useCreateServiceBooking();
  const { toast } = useToast();

  const serviceCategories = [
    { value: '', label: 'All Services', icon: Wrench },
    { value: 'plumber', label: 'Plumbing', icon: Wrench },
    { value: 'electrician', label: 'Electrical', icon: Zap },
    { value: 'painter', label: 'Painting', icon: Paintbrush },
    { value: 'carpenter', label: 'Carpentry', icon: Hammer },
    { value: 'barber', label: 'Hair & Beauty', icon: Scissors },
    { value: 'tutor', label: 'Tutoring', icon: GraduationCap },
    { value: 'photographer', label: 'Photography', icon: Camera },
    { value: 'caterer', label: 'Catering', icon: Utensils },
    { value: 'mechanic', label: 'Auto Repair', icon: Car }
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'Nairobi', label: 'Nairobi' },
    { value: 'Mombasa', label: 'Mombasa' },
    { value: 'Kisumu', label: 'Kisumu' },
    { value: 'Nakuru', label: 'Nakuru' },
    { value: 'Eldoret', label: 'Eldoret' }
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.provider_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || provider.provider_type === selectedCategory;
    const matchesLocation = !location || provider.location_address?.includes(location);
    const isActive = provider.is_active && provider.verification_status === 'approved';
    return matchesSearch && matchesCategory && matchesLocation && isActive;
  });

  const handleBookService = (provider: any) => {
    setSelectedProvider(provider);
    setIsBookingModalOpen(true);
  };

  const handleContactProvider = (provider: any) => {
    setSelectedProvider(provider);
    setIsContactModalOpen(true);
  };

  const submitBooking = (bookingData: any) => {
    createBooking({
      service_type: selectedProvider.provider_type,
      service_description: bookingData.description,
      booking_date: bookingData.date,
      booking_time: bookingData.time,
      booking_address: bookingData.address,
      total_amount: 0, // Will be determined by provider
      provider_id: selectedProvider.user_id
    }, {
      onSuccess: () => {
        setIsBookingModalOpen(false);
        setSelectedProvider(null);
        toast({
          title: 'Booking Request Sent',
          description: 'The service provider will contact you shortly to confirm details and pricing.'
        });
      }
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection
          title="Professional Services at Your Doorstep"
          subtitle="TukoPlace Services"
          description="Connect with skilled and verified professionals for all your service needs. From home repairs to personal services, find trusted providers near you."
          imageUrl="photo-1581578731548-c64695cc6952"
          searchPlaceholder="Search for services or providers..."
          onSearch={setSearchQuery}
          primaryAction={{
            text: 'Browse Services',
            onClick: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }),
          }}
          secondaryAction={{
            text: 'Become a Provider',
            onClick: () => {},
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Service Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {serviceCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <category.icon className="h-6 w-6 mb-2" />
                  <span className="text-xs font-medium text-center">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UnifiedInput
                label=""
                name="search"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search providers..."
                icon={<Search className="h-4 w-4" />}
              />
              <UnifiedSelect
                label=""
                name="category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={serviceCategories.map(cat => ({ value: cat.value, label: cat.label }))}
                placeholder="Service Category"
              />
              <UnifiedSelect
                label=""
                name="location"
                value={location}
                onChange={setLocation}
                options={locations}
                placeholder="Location"
              />
            </div>
          </div>

          {/* Service Providers */}
          <div id="services" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Providers
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredProviders.length} providers)
                </span>
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Sort by: Rating</option>
                <option>Most Reviews</option>
                <option>Nearest</option>
                <option>Most Experienced</option>
              </select>
            </div>

            {filteredProviders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or location</p>
                <UnifiedButton 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setLocation('');
                  }}
                >
                  Clear Filters
                </UnifiedButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <ServiceProviderCard
                    key={provider.id}
                    provider={provider}
                    onBookService={handleBookService}
                    onContactProvider={handleContactProvider}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        <ServiceBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          provider={selectedProvider}
          onSubmit={submitBooking}
          isLoading={isBookingPending}
        />

        {/* Contact Modal */}
        <ProviderContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          provider={selectedProvider}
        />
      </div>
    </MainLayout>
  );
};

// Service Booking Modal Component
const ServiceBookingModal = ({ isOpen, onClose, provider, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '09:00',
    address: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Service with {provider?.business_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UnifiedInput
            label="Preferred Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={(value) => setFormData({...formData, date: value})}
            required
          />
          <UnifiedInput
            label="Preferred Time"
            name="time"
            type="time"
            value={formData.time}
            onChange={(value) => setFormData({...formData, time: value})}
            required
          />
          <UnifiedInput
            label="Service Address"
            name="address"
            value={formData.address}
            onChange={(value) => setFormData({...formData, address: value})}
            placeholder="Where should the service be performed?"
            required
          />
          <UnifiedInput
            label="Service Description"
            name="description"
            value={formData.description}
            onChange={(value) => setFormData({...formData, description: value})}
            placeholder="Describe what you need help with..."
            required
          />
          <div className="flex gap-3 pt-4">
            <UnifiedButton type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </UnifiedButton>
            <UnifiedButton type="submit" loading={isLoading} className="flex-1">
              Send Booking Request
            </UnifiedButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Provider Contact Modal Component  
const ProviderContactModal = ({ isOpen, onClose, provider }: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {provider?.business_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">
                {provider?.business_name?.charAt(0) || 'P'}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{provider?.business_name}</h3>
            <p className="text-gray-600">{provider?.provider_type}</p>
          </div>
          
          <div className="space-y-3">
            {provider?.phone_number && (
              <UnifiedButton 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open(`tel:${provider.phone_number}`)}
              >
                📞 Call {provider.phone_number}
              </UnifiedButton>
            )}
            {provider?.email && (
              <UnifiedButton 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${provider.email}`)}
              >
                ✉️ Email {provider.email}
              </UnifiedButton>
            )}
          </div>
          
          <UnifiedButton onClick={onClose} className="w-full">
            Close
          </UnifiedButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Services;
