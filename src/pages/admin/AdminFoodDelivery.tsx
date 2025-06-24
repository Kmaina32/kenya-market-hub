import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UtensilsCrossed, Search, Star, Clock, MapPin } from 'lucide-react';

const AdminFoodDelivery = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch restaurants from database
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
      return data;
    }
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Delivery Management</h1>
            <p className="text-gray-600">Manage all restaurants and food orders</p>
          </div>
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
              Restaurants ({restaurants?.length || 0})
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
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Cuisine Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Delivery Info</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurants.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{restaurant.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {restaurant.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{restaurant.cuisine_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{Number(restaurant.rating || 0).toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-400" />
                              <span>{restaurant.delivery_time_minutes} min</span>
                            </div>
                            <div className="text-green-600 font-medium">
                              KSh {Number(restaurant.delivery_fee || 0).toLocaleString()} delivery
                            </div>
                            <div className="text-gray-500">
                              Min order: KSh {Number(restaurant.minimum_order || 0).toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate max-w-32">{restaurant.address || 'Not specified'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={restaurant.is_active ? 'default' : 'secondary'}>
                            {restaurant.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <UtensilsCrossed className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Restaurants Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No restaurants match your search criteria.' : 'Restaurants will appear here once they register.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFoodDelivery;
