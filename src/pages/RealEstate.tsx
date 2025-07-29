// src/pages/RealEstate.tsx

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
  Eye
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useProperties } from '@/hooks/useProperties';
import { Link } from 'react-router-dom';
import SEOManager from '@/components/seo/SEOManager'; // FIX: Import SEOManager

const RealEstate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: properties = [], isLoading, error } = useProperties();

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      {/* FIX: Add SEOManager component here for Real Estate page */}
      <SEOManager
        title="Rent or Buy Houses in Nairobi & Kenya | Sokko Sasa Real Estate"
        description="Discover houses, apartments, and commercial properties for rent and sale in Nairobi and across Kenya. Find your dream home or investment with Sokko Sasa."
        keywords="rent house Nairobi, buy house Nairobi, apartments for rent Nairobi, houses for sale Kenya, property Nairobi, real estate Kenya, Sokko Sasa property"
        url={`${window.location.origin}/real-estate`} // Replace with your actual domain
        type="website"
        // If you have specific structured data for a listing page, you can add it here.
        // structuredData={{
        //   "@context": "https://schema.org",
        //   "@type": "WebPage", // Or CollectionPage if it's a listing of properties
        //   "name": "Sokko Sasa Real Estate Listings",
        //   "description": "Browse houses and apartments for sale or rent in Kenya.",
        //   "url": `${window.location.origin}/real-estate`,
        // }}
      />

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
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search properties by location or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-orange-200 focus:border-orange-400 rounded-xl"
              />
            </div>
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
                    <img 
                      src={property.image_url || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="p-2 rounded-full bg-white/90">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="p-2 rounded-full bg-white/90">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                      {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-200 capitalize">
                        {property.property_type}
                      </Badge>
                      <span className="text-2xl font-bold text-orange-600">
                        KSh {property.price >= 1000000 ? `${(property.price / 1000000).toFixed(1)}M` : property.price.toLocaleString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-gray-900 line-clamp-2">
                      {property.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>{property.location_address}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {property.description}
                    </p>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4 text-orange-500" />
                        <span>{property.bedrooms || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-orange-500" />
                        <span>{property.bathrooms || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4 text-orange-500" />
                        <span>1</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4 text-orange-500" />
                        <span>{property.area_sqm || 0}m²</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        <Link to={`/property/${property.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RealEstate;