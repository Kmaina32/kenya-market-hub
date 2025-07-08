import React, { useState, useEffect } from 'react';
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
  Heart,
  Share2,
  Phone,
  Mail,
  Eye,
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWishlist } from '@/hooks/useWishlist';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  // Ensure id is always a string for useProperty hook
  const propertyId = id || '';
  const { data: property, isLoading, error } = useProperty(propertyId);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Mutation for incrementing view count
  const incrementViewMutation = useMutation({
    mutationFn: async (propId: string) => {
      // Assuming you have an RPC function in Supabase called 'increment_property_views'
      // You can check 'supabase/migrations/20250614123330-add-increment-property-views-function.sql' for its definition
      const { data, error: rpcError } = await supabase.rpc('increment_property_views' as any, { property_id_param: propId });
      if (rpcError) throw rpcError;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the 'property' query to refetch updated view count
      queryClient.invalidateQueries({ queryKey: ['property', variables] });
    },
  });

  // Increment view count when component mounts and property ID is available
  useEffect(() => {
    if (propertyId) {
      incrementViewMutation.mutate(propertyId);
    }
  }, [propertyId, incrementViewMutation]);

  // Wishlist functionality
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const isSaved = wishlistItems.some(item => item.id === property?.id);

  const handleSaveToggle = () => {
    if (property) {
      if (isSaved) {
        removeFromWishlist(property.id);
      } else {
        addToWishlist({ id: property.id, name: property.title || 'Unknown Property' });
      }
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
        console.log('Property shared successfully');
      } catch (shareError) {
        console.error('Error sharing property:', shareError);
        // Fallback for failed share (e.g., user cancels share dialog)
        document.execCommand('copy'); // Use document.execCommand for clipboard copy in iframe
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      document.execCommand('copy'); // Use document.execCommand for clipboard copy in iframe
      alert('Link copied to clipboard!');
    }
  };

  // Call functionality
  const handleCall = () => {
    if (property?.contact_phone) {
      window.location.href = `tel:${property.contact_phone}`;
    } else {
      alert('No phone number available for this property.');
    }
  };

  // Email functionality
  const handleEmail = () => {
    if (property?.contact_email) {
      window.location.href = `mailto:${property.contact_email}`;
    } else {
      alert('No email address available for this property.');
    }
  };

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

  // Prepare images for carousel: prioritize image_url, then property.images array
  const allImages = [
    ...(property.image_url ? [property.image_url] : []),
    ...(property.images && Array.isArray(property.images) ? property.images : [])
  ].filter(Boolean);

  // Use a fallback if no images are available
  const displayImages = allImages.length > 0
    ? allImages
    : ['https://placehold.co/800x450/E0E0E0/ADADAD?text=No+Image'];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Property Images with Carousel */}
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {displayImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {displayImages.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/70" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/70" />
                </>
              )}
            </Carousel>
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
                      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleCall}>
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleEmail}>
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-2 ${isSaved ? 'text-red-500 border-red-300' : 'text-gray-600'}`}
                        onClick={handleSaveToggle}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                        {isSaved ? 'Saved' : 'Save'}
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleShare}>
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
// Note: Ensure you have the necessary CSS styles for the components used in this file.
// This includes styles for the carousel, badges, buttons, and cards to ensure they render correctly
// and are responsive across different screen sizes.
// You may need to adjust the styles based on your project's design system or CSS framework.
// Also, ensure that the Supabase RPC function 'increment_property_views' is correctly set up