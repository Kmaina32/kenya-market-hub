
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Home, 
  MapPin, 
  BedDouble, 
  Bath, 
  Car,
  Square,
  Heart,
  Phone,
  Eye,
  Plus
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import CreatePropertyModal from '@/components/modals/CreatePropertyModal';
import { useProperties, useDeleteProperty } from '@/hooks/useProperties';
import { toast } from 'sonner';

const RealEstate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: properties, isLoading } = useProperties();
  const deleteProperty = useDeleteProperty();

  const filteredProperties = properties?.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewDetails = (property: any) => {
    toast.info(`Viewing details for ${property.title}`);
  };

  const handleContactOwner = (property: any) => {
    toast.info(`Contacting owner for ${property.title}`);
  };

  const handleDelete = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty.mutate(propertyId);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Background Image */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Home className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Dream Home</h1>
              <p className="text-lg text-green-100 mb-6">
                Discover properties for sale and rent across Kenya's prime locations
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search properties by location or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-orange-200 focus:border-orange-400 rounded-xl"
              />
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Available</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'No properties match your search criteria.' : 'Property listings will be available soon. Check back later!'}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {property.image_url ? (
                      <img 
                        src={property.image_url} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Home className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="p-2 rounded-full bg-white/90">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="p-2 rounded-full bg-white/90"
                        onClick={() => handleViewDetails(property)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white capitalize">
                      {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-200 capitalize">
                        {property.property_type}
                      </Badge>
                      <span className="text-2xl font-bold text-orange-600">
                        KSh {(property.price / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <CardTitle className="text-lg text-gray-900 line-clamp-2">
                      {property.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>{property.city}, {property.county}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {property.description}
                    </p>
                    
                    {property.bedrooms && (
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4 text-orange-500" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-orange-500" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4 text-orange-500" />
                          <span>1</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4 text-orange-500" />
                          <span>{property.area_sqm}m²</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        onClick={() => handleViewDetails(property)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                        onClick={() => handleContactOwner(property)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <CreatePropertyModal 
          open={showCreateModal} 
          onOpenChange={setShowCreateModal} 
        />
      </div>
    </MainLayout>
  );
};

export default RealEstate;
