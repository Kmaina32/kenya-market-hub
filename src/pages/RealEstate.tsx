
import React, { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import MainLayout from '@/components/MainLayout';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { UnifiedInput, UnifiedSelect } from '@/components/ui/UnifiedForm';
import HeroSection from '@/components/shared/HeroSection';
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Phone,
  Mail,
  Eye
} from 'lucide-react';

const RealEstate = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [listingType, setListingType] = useState('');
  const [location, setLocation] = useState('');
  const { data: properties = [], isLoading } = useProperties();

  const propertyTypes = [
    { value: '', label: 'All Property Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office' }
  ];

  const listingTypes = [
    { value: '', label: 'For Sale & Rent' },
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' }
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'Nairobi', label: 'Nairobi' },
    { value: 'Mombasa', label: 'Mombasa' },
    { value: 'Kisumu', label: 'Kisumu' },
    { value: 'Nakuru', label: 'Nakuru' },
    { value: 'Eldoret', label: 'Eldoret' }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !propertyType || property.property_type === propertyType;
    const matchesListing = !listingType || property.listing_type === listingType;
    const matchesLocation = !location || property.city === location;
    return matchesSearch && matchesType && matchesListing && matchesLocation;
  });

  const featuredProperties = properties.filter(property => property.is_featured).slice(0, 6);

  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
    
    return listingType === 'rent' ? `${formatted}/month` : formatted;
  };

  const getPropertyFeatures = (property: any) => {
    const features = [];
    if (property.bedrooms) features.push(`${property.bedrooms} bed`);
    if (property.bathrooms) features.push(`${property.bathrooms} bath`);
    if (property.area_sqm) features.push(`${property.area_sqm} m²`);
    return features.join(' • ');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection
          title="Find Your Dream Property"
          subtitle="TukoPlace Real Estate"
          description="Discover the perfect home or investment opportunity from our extensive listings across Kenya."
          imageUrl="photo-1560518883-ce09059eeffa"
          searchPlaceholder="Search by location, property type, or features..."
          onSearch={setSearchQuery}
          primaryAction={{
            text: 'Browse Properties',
            onClick: () => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' }),
          }}
          secondaryAction={{
            text: 'List Property',
            onClick: () => {},
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <UnifiedInput
                label=""
                name="search"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search properties..."
                icon={<Search className="h-4 w-4" />}
              />
              <UnifiedSelect
                label=""
                name="propertyType"
                value={propertyType}
                onChange={setPropertyType}
                options={propertyTypes}
                placeholder="Property Type"
              />
              <UnifiedSelect
                label=""
                name="listingType"
                value={listingType}
                onChange={setListingType}
                options={listingTypes}
                placeholder="Listing Type"
              />
              <UnifiedSelect
                label=""
                name="location"
                value={location}
                onChange={setLocation}
                options={locations}
                placeholder="Location"
              />
            </div>
          </div>

          {/* Featured Properties */}
          {featuredProperties.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <UnifiedCard
                    key={property.id}
                    title={property.title}
                    subtitle={getPropertyFeatures(property)}
                    description={property.description}
                    imageUrl={property.images?.[0]}
                    price={formatPrice(property.price, property.listing_type)}
                    location={`${property.city}, ${property.county}`}
                    badge="Featured"
                    badgeVariant="default"
                    actions={
                      <div className="grid grid-cols-3 gap-2">
                        <UnifiedButton size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </UnifiedButton>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Properties */}
          <div id="properties" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Properties
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredProperties.length} listings)
                </span>
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Most Viewed</option>
              </select>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <UnifiedButton 
                  onClick={() => {
                    setSearchQuery('');
                    setPropertyType('');
                    setListingType('');
                    setLocation('');
                  }}
                >
                  Clear Filters
                </UnifiedButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <UnifiedCard
                    key={property.id}
                    title={property.title}
                    subtitle={getPropertyFeatures(property)}
                    description={property.description}
                    imageUrl={property.images?.[0]}
                    price={formatPrice(property.price, property.listing_type)}
                    location={`${property.city}, ${property.county}`}
                    badge={property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                    badgeVariant={property.listing_type === 'sale' ? 'default' : 'secondary'}
                    actions={
                      <div className="grid grid-cols-3 gap-2">
                        <UnifiedButton size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </UnifiedButton>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RealEstate;
