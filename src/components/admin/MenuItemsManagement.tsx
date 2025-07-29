
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
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';

const MenuItemsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all');

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['admin-menu-items', searchTerm, selectedRestaurant],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select(`
          *,
          restaurants!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedRestaurant !== 'all') {
        query = query.eq('restaurant_id', selectedRestaurant);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants-for-menu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const deleteConfirmation = useDeleteConfirmation({
    tableName: 'menu_items',
    queryKey: ['admin-menu-items'],
    itemName: 'menu item'
  });

  const handleEdit = (menuItem: any) => {
    console.log('Edit menu item:', menuItem);
    // TODO: Implement edit functionality
  };

  const handleDelete = (menuItemId: string) => {
    deleteConfirmation.openConfirmation(menuItemId);
  };

  const handleView = (menuItemId: string) => {
    console.log('View menu item:', menuItemId);
    // TODO: Implement view functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Items Management</h2>
          <p className="text-gray-600 mt-1">Manage restaurant menu items and availability</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search menu items..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border rounded-md px-3 py-2"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option value="all">All Restaurants</option>
          {restaurants?.map(restaurant => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UtensilsCrossed className="h-5 w-5 mr-2" />
            Menu Items ({menuItems?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading menu items...</span>
            </div>
          ) : menuItems && menuItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=50'} 
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.restaurants?.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>KSh {item.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.is_available ? 'default' : 'secondary'}
                          className={item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ViewButton onClick={() => handleView(item.id)} />
                          <EditButton onClick={() => handleEdit(item)} />
                          <DeleteButton onClick={() => handleDelete(item.id)} />
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-600 mb-4">Start by adding menu items to your restaurants.</p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                <Plus className="h-5 w-5 mr-2" />
                Add Menu Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.closeConfirmation}
        onConfirm={deleteConfirmation.confirmDelete}
        isLoading={deleteConfirmation.isDeleting}
        itemName="menu item"
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
      />
    </div>
  );
};

export default MenuItemsManagement;
