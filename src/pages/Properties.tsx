
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Bed, Bath, Square, Phone, Mail, Eye, Heart, Filter, Search } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { Helmet } from 'react-helmet-async';

const Properties = () => {
  const { data: properties, isLoading, error } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedListingType, setSelectedListingType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<string>('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Properties</h1>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredProperties = properties?.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || property.property_type === selectedType;
    const matchesListingType = selectedListingType === 'all' || property.listing_type === selectedListingType;
    const matchesPrice = !maxPrice || property.price <= parseInt(maxPrice);
    
    return matchesSearch && matchesType && matchesListingType && matchesPrice;
  }) || [];

  const formatPrice = (price: number, listingType: string) => {
    const formatted = price.toLocaleString();
    return listingType === 'rent' ? `KSh ${formatted}/month` : `KSh ${formatted}`;
  };

  return (
    <>
      <Helmet>
        <title>Properties - Sokko Sasa</title>
        <meta name="description" content="Find your dream property in Kenya. Browse apartments, houses, land, and commercial properties for sale or rent." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the perfect property for you from our extensive collection of houses, apartments, and land
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedListingType} onValueChange={setSelectedListingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Listing Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">For Sale & Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Max Price (KSh)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredProperties.length} properties found
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-300 bg-white rounded-2xl overflow-hidden">
                <div className="relative aspect-w-4 aspect-h-3">
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {property.is_featured && (
                    <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      Featured
                    </Badge>
                  )}
                  
                  <Badge className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md capitalize">
                    For {property.listing_type}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatPrice(property.price, property.listing_type)}
                    </p>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm line-clamp-1">{property.location_address}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area_sqm && (
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.area_sqm}m²</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {property.contact_phone && (
                        <Button size="sm" variant="outline" className="p-2">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      {property.contact_email && (
                        <Button size="sm" variant="outline" className="p-2">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="p-2">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedListingType('all');
                  setMaxPrice('');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Properties;
