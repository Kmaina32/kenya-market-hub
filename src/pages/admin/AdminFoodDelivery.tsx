import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UtensilsCrossed, Search, Edit, Trash2, Eye } from 'lucide-react';
import { EditButton, DeleteButton, ViewButton } from '@/components/ui/action-buttons';
import CreateRestaurantModal from '@/components/admin/CreateRestaurantModal';

const AdminFoodDelivery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['admin-restaurants', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,cuisine_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const handleEdit = (restaurantId: string) => {
    console.log('Edit restaurant:', restaurantId);
    // TODO: Open edit modal
  };

  const handleDelete = (restaurantId: string) => {
    console.log('Delete restaurant:', restaurantId);
    // TODO: Implement delete functionality
  };

  const handleView = (restaurantId: string) => {
    console.log('View restaurant:', restaurantId);
    // TODO: Open view modal
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Food Delivery Management</h1>
          <p className="text-gray-600 mt-1">Manage restaurants and food delivery operations</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search restaurants..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UtensilsCrossed className="h-5 w-5 mr-2" />
            All Restaurants ({restaurants?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading restaurants...</span>
            </div>
          ) : restaurants && restaurants.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cuisine Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{restaurant.cuisine_type}</Badge>
                      </TableCell>
                      <TableCell>{restaurant.address || 'Not specified'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{restaurant.rating || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={restaurant.is_active ? 'default' : 'secondary'}
                          className={restaurant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {restaurant.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ViewButton onClick={() => handleView(restaurant.id)} />
                          <EditButton onClick={() => handleEdit(restaurant.id)} />
                          <DeleteButton onClick={() => handleDelete(restaurant.id)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UtensilsCrossed className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first restaurant partner.</p>
              <Button 
                onClick={() => {}}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Restaurant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateRestaurantModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AdminFoodDelivery;
