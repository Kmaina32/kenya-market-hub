
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Calendar, Star, MapPin, Clock } from 'lucide-react';
import AppointmentBookingModal from './AppointmentBookingModal';
import ContactProviderModal from './ContactProviderModal';

interface ServiceProvider {
  id: string;
  business_name: string;
  provider_type: string;
  business_description?: string;
  location_address?: string;
  phone_number?: string;
  email?: string;
  rating?: number;
  is_verified: boolean;
  is_active: boolean;
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onApply?: (providerType: string) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider, onApply }) => {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleBookAppointment = () => {
    setShowAppointmentModal(true);
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                {provider.business_name || 'Service Provider'}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {provider.provider_type}
                </Badge>
                {provider.is_verified && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            {provider.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {provider.business_description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {provider.business_description}
            </p>
          )}

          {provider.location_address && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{provider.location_address}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Available for booking</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleContact}
              className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
            >
              <Phone className="h-3 w-3 mr-1" />
              Contact
            </Button>
            <Button
              size="sm"
              onClick={handleBookAppointment}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Book
            </Button>
          </div>
        </CardContent>
      </Card>

      <AppointmentBookingModal
        open={showAppointmentModal}
        onOpenChange={setShowAppointmentModal}
        providerName={provider.business_name || 'Service Provider'}
        serviceType={provider.provider_type}
      />

      <ContactProviderModal
        open={showContactModal}
        onOpenChange={setShowContactModal}
        providerName={provider.business_name || 'Service Provider'}
        providerPhone={provider.phone_number}
        providerEmail={provider.email}
        serviceType={provider.provider_type}
      />
    </>
  );
};

export default ServiceProviderCard;
