import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Building, Search, MapPin, Bed, Bath } from 'lucide-react';

const AdminProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch properties from database
  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location_address.ilike.%${searchTerm}%,property_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'sold': return 'destructive';
      case 'rented': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-green-100 text-green-800';
      case 'rent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600">Manage all real estate listings</p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search properties..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              All Properties ({properties?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading properties...</span>
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Listing</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{property.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {property.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{property.property_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getListingTypeColor(property.listing_type)}`}>
                            {property.listing_type}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          KSh {Number(property.price).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3 text-sm">
                            {property.bedrooms && (
                              <div className="flex items-center">
                                <Bed className="h-3 w-3 mr-1 text-gray-400" />
                                <span>{property.bedrooms}</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-center">
                                <Bath className="h-3 w-3 mr-1 text-gray-400" />
                                <span>{property.bathrooms}</span>
                              </div>
                            )}
                            {property.area_sqm && (
                              <span className="text-gray-500">{property.area_sqm}m²</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate max-w-32">{property.location_address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(property.status)}>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={property.is_featured ? 'default' : 'outline'}>
                            {property.is_featured ? 'Featured' : 'Standard'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No properties match your search criteria.' : 'Start by adding your first property listing.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
