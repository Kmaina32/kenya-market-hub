
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Search, 
  Star, 
  MapPin, 
  Phone,
  Calendar,
  ChevronDown
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ContactProviderModal from './ContactProviderModal';
import BookingModal from './BookingModal';
import { toast } from 'sonner';

const MedicalProvidersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Mock data for medical providers
  const providers = [
    {
      id: '1',
      full_name: 'Dr. Lucy Mwangi',
      provider_type: 'dentist',
      specialization: 'Dentistry',
      rating: 5.0,
      location: 'Westlands, Nairobi',
      experience_years: 8,
      consultation_fee: 3000,
      phone: '+254 712 345 678',
      email: 'dr.lucy@dental.co.ke',
      description: 'Experienced dentist specializing in cosmetic and general dentistry.',
      availability: 'Mon-Fri 9AM-5PM',
      languages: ['English', 'Swahili']
    },
    {
      id: '2',
      full_name: 'Dr. Fatuma Ali',
      provider_type: 'doctor',
      specialization: 'General Medicine',
      rating: 4.8,
      location: 'Kilimani, Nairobi',
      experience_years: 12,
      consultation_fee: 2500,
      phone: '+254 722 456 789',
      email: 'dr.fatuma@clinic.co.ke',
      description: 'General practitioner with extensive experience in family medicine.',
      availability: 'Mon-Sat 8AM-6PM',
      languages: ['English', 'Swahili', 'Arabic']
    },
    {
      id: '3',
      full_name: 'Dr. James Kimani',
      provider_type: 'specialist',
      specialization: 'Cardiology',
      rating: 4.9,
      location: 'Upper Hill, Nairobi',
      experience_years: 15,
      consultation_fee: 5000,
      phone: '+254 733 567 890',
      email: 'dr.james@heart.co.ke',
      description: 'Cardiologist specializing in heart disease prevention and treatment.',
      availability: 'Tue-Thu 10AM-4PM',
      languages: ['English', 'Swahili']
    }
  ];

  const filteredProviders = providers.filter(provider =>
    provider.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.consultation_fee - b.consultation_fee;
      case 'experience':
        return b.experience_years - a.experience_years;
      default:
        return 0;
    }
  });

  const handleBookAppointment = (provider: any) => {
    setSelectedProvider(provider);
    setBookingModalOpen(true);
    toast.success(`Opening booking form for ${provider.full_name}`);
  };

  const handleContact = (provider: any) => {
    setSelectedProvider(provider);
    setContactModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-orange-200 focus:border-orange-400"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48 bg-white border-orange-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="price">Sort by Price</SelectItem>
            <SelectItem value="experience">Sort by Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow bg-white border-orange-100">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {provider.full_name}
                    </CardTitle>
                    <p className="text-orange-600 font-medium">{provider.provider_type}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  {provider.specialization}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                {provider.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="ml-1">rating</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{provider.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Experience:</span>
                  <span className="ml-2 font-medium">{provider.experience_years} years</span>
                </div>
                <div>
                  <span className="text-gray-500">Fee:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    KSh {provider.consultation_fee.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Available:</span>
                <span className="ml-2">{provider.availability}</span>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Languages:</span>
                <span className="ml-2">{provider.languages.join(', ')}</span>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => handleBookAppointment(provider)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <Button
                  onClick={() => handleContact(provider)}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {sortedProviders.length === 0 && (
        <div className="text-center py-12">
          <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'Medical providers will appear here.'}
          </p>
        </div>
      )}

      {/* Contact Modal */}
      <ContactProviderModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        providerName={selectedProvider?.full_name || ''}
        providerPhone={selectedProvider?.phone}
        providerEmail={selectedProvider?.email}
        serviceType="medical"
        serviceName={selectedProvider?.specialization || 'Medical Service'}
      />

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        serviceName={selectedProvider?.specialization || 'Medical Consultation'}
        providerName={selectedProvider?.full_name || ''}
        serviceType="medical consultation"
      />
    </div>
  );
};

export default MedicalProvidersList;
