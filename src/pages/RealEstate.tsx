
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Building, 
  Home, 
  Filter,
  Phone,
  Eye
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useProperties } from '@/hooks/useProperties';
import HeroSection from '@/components/shared/HeroSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location_address: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  images?: string[];
  status: string;
  listing_type: string;
  contact_phone?: string;
  contact_email?: string;
}

const RealEstate = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: '',
    location: ''
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { data: properties = [], isLoading, error } = useProperties();

  console.log('Properties data:', properties);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  const filteredProperties = properties?.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location_address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.propertyType || property.property_type === filters.propertyType;
    const matchesLocation = !filters.location || property.location_address?.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  }) || [];

  const handleViewDetails = (property: Property) => {
    console.log('Viewing property details:', property);
    navigate(`/property/${property.id}`);
    toast.success(`Viewing details for ${property.title}`);
  };

  const handleContactOwner = (property: Property) => {
    console.log('Contacting owner for property:', property);
    setSelectedProperty(property);
    setIsContactModalOpen(true);
  };

  const handleCall = () => {
    if (selectedProperty?.contact_phone) {
      window.location.href = `tel:${selectedProperty.contact_phone}`;
      toast.success('Opening phone dialer...');
    } else {
      toast.error('Phone number not available');
    }
  };

  const handleEmail = () => {
    if (selectedProperty?.contact_email) {
      window.location.href = `mailto:${selectedProperty.contact_email}?subject=Inquiry about ${selectedProperty.title}`;
      toast.success('Opening email client...');
    } else {
      toast.error('Email not available');
    }
  };

  const propertyTypes = ['house', 'apartment', 'land', 'commercial'];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <HeroSection
            title="Real Estate"
            subtitle="Find Your Dream Property"
            description="Discover amazing properties across Kenya's prime locations."
            imageUrl="photo-1483058712412-4245e9b90334"
            className="mb-8 h-64"
          />

          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl shadow-sm bg-white"
                />
              </div>
              
              <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-6 py-3 rounded-xl shadow-sm font-medium bg-white"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">Filter Properties</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold mb-3 block text-gray-700">Property Type</label>
                      <Select value={filters.propertyType} onValueChange={(value) => setFilters({...filters, propertyType: value})}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-500 rounded-lg bg-white">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="">All Types</SelectItem>
                          {propertyTypes.map(type => (
                            <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-3 block text-gray-700">Location</label>
                      <Input
                        placeholder="Enter location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-lg bg-white"
                      />
                    </div>
                    <Button 
                      onClick={() => setIsFilterModalOpen(false)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-3 rounded-xl font-medium shadow-md"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-orange-300 bg-white rounded-2xl overflow-hidden group">
                    <div className="aspect-video bg-gray-200 relative">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop)` }}
                        >
                          <div className="w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
                            <Home className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md">
                        {property.property_type}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-gray-900 line-clamp-1 font-semibold">{property.title}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="truncate">{property.location_address}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                      <p className="text-sm text-gray-700 line-clamp-2">{property.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        {property.area_sqm && (
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span>{property.area_sqm} sqm</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xl font-bold text-orange-600">
                          KSh {property.price.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(property)}
                            className="bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-medium shadow-md"
                            onClick={() => handleContactOwner(property)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Modal */}
        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Contact Property Owner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">How would you like to contact the owner of "{selectedProperty?.title}"?</p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleCall}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                >
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default RealEstate;
