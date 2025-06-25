
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty, useCreatePropertyInquiry } from '@/hooks/useProperties';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye, 
  Calendar,
  Phone,
  Mail,
  Share2,
  Heart,
  ExternalLink
} from 'lucide-react';
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import LazyImage from '@/components/LazyImage';
import SEOHead from '@/components/SEOHead';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  
  const { data: property, isLoading, error } = useProperty(id!);
  const createInquiry = useCreatePropertyInquiry();

  console.log('PropertyDetail - ID:', id);
  console.log('PropertyDetail - Property:', property);
  console.log('PropertyDetail - Loading:', isLoading);
  console.log('PropertyDetail - Error:', error);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Property link copied to clipboard',
      });
    }
  };

  const handleInquiryClick = () => {
    setShowInquiryModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/real-estate')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const primaryImage = property.images?.[0] || '/placeholder.svg';
  const coordinates = property.location_coordinates && 
    typeof property.location_coordinates === 'object' && 
    'lat' in property.location_coordinates && 
    'lng' in property.location_coordinates
    ? [property.location_coordinates.lat as number, property.location_coordinates.lng as number] 
    : null;

  return (
    <>
      <SEOHead 
        title={`${property.title} - Soko Smart`}
        description={property.description || `${property.property_type} for ${property.listing_type} in ${property.county || property.location_address}`}
        image={primaryImage}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Images */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <LazyImage
                    src={primaryImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.is_featured && (
                    <Badge className="absolute top-4 left-4 bg-yellow-500">
                      Featured
                    </Badge>
                  )}
                  <Badge 
                    className="absolute top-4 right-4"
                    variant={property.listing_type === 'sale' ? 'default' : 'secondary'}
                  >
                    For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
                  </Badge>
                </div>
                
                {property.images && property.images.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {property.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-square relative">
                          <LazyImage
                            src={image}
                            alt={`${property.title} - Image ${index + 2}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Property Details */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {property.title}
                      </h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location_address}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {property.views_count || 0} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Listed {new Date(property.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Key Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {property.bedrooms && (
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-gray-400" />
                          <span>{property.bedrooms} Bedrooms</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-2">
                          <Bath className="h-5 w-5 text-gray-400" />
                          <span>{property.bathrooms} Bathrooms</span>
                        </div>
                      )}
                      {property.area_sqm && (
                        <div className="flex items-center gap-2">
                          <Square className="h-5 w-5 text-gray-400" />
                          <span>{property.area_sqm} sq m</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {property.property_type}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    {property.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {property.description}
                        </p>
                      </div>
                    )}

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Virtual Tour */}
                    {property.virtual_tour_url && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Virtual Tour</h3>
                        <Button variant="outline" asChild>
                          <a 
                            href={property.virtual_tour_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Take Virtual Tour
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price & Action */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        KSH {property.price.toLocaleString()}
                        {property.listing_type === 'rent' && (
                          <span className="text-lg text-gray-500">/month</span>
                        )}
                      </div>
                    </div>
                    
                    <Button onClick={handleInquiryClick} className="w-full">
                      Make Inquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {property.contact_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a 
                          href={`tel:${property.contact_phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {property.contact_phone}
                        </a>
                      </div>
                    )}
                    {property.contact_email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a 
                          href={`mailto:${property.contact_email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {property.contact_email}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Location Map */}
              {coordinates && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Location</h3>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Map integration coming soon</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {property.location_address}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Additional Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="capitalize">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listing Type:</span>
                      <span className="capitalize">For {property.listing_type}</span>
                    </div>
                    {property.county && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">County:</span>
                        <span>{property.county}</span>
                      </div>
                    )}
                    {property.available_from && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available From:</span>
                        <span>{new Date(property.available_from).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Property Inquiry Modal */}
        <PropertyInquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          property={property}
        />
      </div>
    </>
  );
};

export default PropertyDetail;
