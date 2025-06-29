import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Building, Search, Edit, Trash2, Eye } from 'lucide-react';
import { EditButton, DeleteButton, ViewButton } from '@/components/ui/action-buttons';
import CreatePropertyModal from '@/components/admin/CreatePropertyModal';

const AdminProperties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location_address.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const handleEdit = (propertyId: string) => {
    console.log('Edit property:', propertyId);
    // TODO: Open edit modal
  };

  const handleDelete = (propertyId: string) => {
    console.log('Delete property:', propertyId);
    // TODO: Implement delete functionality
  };

  const handleView = (propertyId: string) => {
    console.log('View property:', propertyId);
    // TODO: Open view modal
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-1">Manage property listings and inquiries</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
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
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{property.property_type}</Badge>
                      </TableCell>
                      <TableCell>{property.location_address}</TableCell>
                      <TableCell className="font-semibold">
                        KSh {Number(property.price).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={property.status === 'available' ? 'default' : 'secondary'}
                          className={property.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ViewButton onClick={() => handleView(property.id)} />
                          <EditButton onClick={() => handleEdit(property.id)} />
                          <DeleteButton onClick={() => handleDelete(property.id)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first property listing.</p>
              <Button 
                onClick={() => {}}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePropertyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AdminProperties;
