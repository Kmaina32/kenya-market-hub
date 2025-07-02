
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { useProperty } from '@/hooks/useProperties';
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Car, 
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  Eye
} from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id || '');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Property Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={property.image_url || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {property.images?.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img src={image} alt={`Property ${index + 2}`} className="w-full h-full object-cover" />
                </div>
              )) || (
                <>
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <span>{property.location_address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      KSh {property.price >= 1000000 ? `${(property.price / 1000000).toFixed(1)}M` : property.price.toLocaleString()}
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <BedDouble className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-semibold">{property.bedrooms || 0}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Bath className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-semibold">{property.bathrooms || 0}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Square className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-semibold">{property.area_sqm || 0}</div>
                      <div className="text-sm text-gray-600">Sqm</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Eye className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-semibold">{property.views_count || 0}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description || 'No description available for this property.'}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Interested in this property?</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setIsInquiryModalOpen(true)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Send Inquiry
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Property Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium capitalize">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="outline" className="capitalize">{property.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available From</span>
                      <span className="font-medium">
                        {property.available_from ? new Date(property.available_from).toLocaleDateString() : 'Immediately'}
                      </span>
                    </div>
                    {property.contact_phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium">{property.contact_phone}</span>
                      </div>
                    )}
                    {property.contact_email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{property.contact_email}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <PropertyInquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          property={property}
        />
      </div>
    </MainLayout>
  );
};

export default PropertyDetail;
