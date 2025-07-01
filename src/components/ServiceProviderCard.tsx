
import React from 'react';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  Award
} from 'lucide-react';

interface ServiceProvider {
  id: string;
  user_id: string;
  provider_type: string;
  business_name?: string;
  business_description?: string;
  phone_number?: string;
  email?: string;
  location_address?: string;
  verification_status: string;
  is_active: boolean;
  documents?: any;
  rating?: number;
  reviews_count?: number;
  experience_years?: number;
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onBookService: (provider: ServiceProvider) => void;
  onContactProvider: (provider: ServiceProvider) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onBookService,
  onContactProvider
}) => {
  const getProviderImage = (type: string) => {
    const images = {
      plumber: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      electrician: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
      carpenter: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
      painter: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
      cleaner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      gardener: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      mechanic: 'https://images.unsplash.com/photo-1632053002002-85aca12da26c?w=400&h=300&fit=crop',
      tutor: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    };
    return images[type as keyof typeof images] || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop';
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatProviderType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <UnifiedCard
      title={provider.business_name || `Professional ${formatProviderType(provider.provider_type)}`}
      subtitle={formatProviderType(provider.provider_type)}
      description={provider.business_description || `Experienced ${formatProviderType(provider.provider_type)} providing quality services.`}
      imageUrl={getProviderImage(provider.provider_type)}
      rating={provider.rating || 4.5}
      reviews={provider.reviews_count || Math.floor(Math.random() * 50) + 10}
      location={provider.location_address || 'Nairobi, Kenya'}
      className="h-full group hover:shadow-lg transition-all duration-300"
    >
      <div className="space-y-3 mt-4">
        {/* Status and Experience */}
        <div className="flex items-center justify-between">
          {getVerificationBadge(provider.verification_status)}
          {provider.experience_years && (
            <div className="flex items-center text-sm text-gray-600">
              <Award className="h-4 w-4 mr-1 text-orange-500" />
              {provider.experience_years}+ years
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2 text-sm text-gray-600">
          {provider.phone_number && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{provider.phone_number}</span>
            </div>
          )}
          {provider.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{provider.email}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <UnifiedButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onContactProvider(provider);
            }}
            className="text-sm"
          >
            <Phone className="h-4 w-4 mr-1" />
            Contact
          </UnifiedButton>
          <UnifiedButton
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onBookService(provider);
            }}
            disabled={provider.verification_status !== 'approved' || !provider.is_active}
            className="text-sm"
          >
            Book Service
          </UnifiedButton>
        </div>
      </div>
    </UnifiedCard>
  );
};

export default ServiceProviderCard;
