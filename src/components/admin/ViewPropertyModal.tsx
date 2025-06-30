
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar } from 'lucide-react';

interface ViewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

const ViewPropertyModal: React.FC<ViewPropertyModalProps> = ({ isOpen, onClose, property }) => {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Images */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {property.images.slice(0, 6).map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Property Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-lg text-green-600">
                      KSh {Number(property.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline">{property.property_type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Listing:</span>
                    <Badge variant="secondary">{property.listing_type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                      {property.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-gray-500" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-gray-500" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  {property.area_sqm && (
                    <div className="flex items-center gap-2">
                      <Maximize className="h-4 w-4 text-gray-500" />
                      <span>{property.area_sqm} sqm</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Views: {property.views_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">{property.location_address}</p>
                      {property.city && property.county && (
                        <p className="text-gray-600">{property.city}, {property.county}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2">
                  {property.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{property.contact_phone}</span>
                    </div>
                  )}
                  {property.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{property.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Property Features */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Property Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Virtual Tour */}
          {property.virtual_tour_url && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Virtual Tour</h3>
              <a
                href={property.virtual_tour_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Virtual Tour
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPropertyModal;
