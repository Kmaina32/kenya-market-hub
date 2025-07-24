
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UtensilsCrossed, Search, ChefHat, Edit, Trash2, Eye } from 'lucide-react';
import { EditButton, DeleteButton, ViewButton } from '@/components/ui/action-buttons';
import CreateRestaurantModal from '@/components/admin/CreateRestaurantModal';
import EditRestaurantModal from '@/components/admin/EditRestaurantModal';
import CreateMenuItemModal from '@/components/admin/CreateMenuItemModal';
import EditMenuItemModal from '@/components/admin/EditMenuItemModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { useMenuItems, useDeleteMenuItem, MenuItem } from '@/hooks/useMenuItems';

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  address: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

const RestaurantManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCreateRestaurantModalOpen, setIsCreateRestaurantModalOpen] = useState(false);
  const [isEditRestaurantModalOpen, setIsEditRestaurantModalOpen] = useState(false);
  const [isCreateMenuItemModalOpen, setIsCreateMenuItemModalOpen] = useState(false);
  const [isEditMenuItemModalOpen, setIsEditMenuItemModalOpen] = useState(false);

  const { data: restaurants, isLoading: restaurantsLoading } = useQuery({
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

  const { data: menuItems, isLoading: menuItemsLoading } = useMenuItems(selectedRestaurant?.id);

  const restaurantDeleteConfirmation = useDeleteConfirmation({
    tableName: 'restaurants',
    queryKey: ['admin-restaurants'],
    itemName: 'restaurant'
  });

  const deleteMenuItemMutation = useDeleteMenuItem();
  const [menuItemToDelete, setMenuItemToDelete] = useState<string | null>(null);

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditRestaurantModalOpen(true);
  };

  const handleDeleteRestaurant = (restaurantId: string) => {
    restaurantDeleteConfirmation.openConfirmation(restaurantId);
  };

  const handleViewRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsEditMenuItemModalOpen(true);
  };

  const handleDeleteMenuItem = (menuItemId: string) => {
    setMenuItemToDelete(menuItemId);
  };

  const confirmDeleteMenuItem = () => {
    if (menuItemToDelete) {
      deleteMenuItemMutation.mutate(menuItemToDelete);
      setMenuItemToDelete(null);
    }
  };

  const formatPrice = (price: number) => `KSH ${price.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-gray-600 mt-1">Manage restaurants, menus, and food delivery operations</p>
        </div>
        <Button
          onClick={() => setIsCreateRestaurantModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      <Tabs defaultValue="restaurants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="menu" disabled={!selectedRestaurant}>
            Menu Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurants" className="space-y-4">
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
              {restaurantsLoading ? (
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
                        <TableRow 
                          key={restaurant.id}
                          className={selectedRestaurant?.id === restaurant.id ? 'bg-orange-50' : ''}
                        >
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
                              <ViewButton 
                                onClick={() => handleViewRestaurant(restaurant)}
                                className={selectedRestaurant?.id === restaurant.id ? 'bg-orange-100' : ''}
                              />
                              <EditButton onClick={() => handleEditRestaurant(restaurant)} />
                              <DeleteButton onClick={() => handleDeleteRestaurant(restaurant.id)} />
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
                    onClick={() => setIsCreateRestaurantModalOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Restaurant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          {selectedRestaurant && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRestaurant.name} - Menu</h2>
                  <p className="text-gray-600">{selectedRestaurant.cuisine_type} • {selectedRestaurant.address}</p>
                </div>
                <Button
                  onClick={() => setIsCreateMenuItemModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ChefHat className="h-5 w-5 mr-2" />
                    Menu Items ({menuItems?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {menuItemsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      <span className="ml-2">Loading menu items...</span>
                    </div>
                  ) : menuItems && menuItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {menuItems.map((menuItem) => (
                            <TableRow key={menuItem.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{menuItem.name}</div>
                                  {menuItem.description && (
                                    <div className="text-sm text-gray-500 mt-1">{menuItem.description}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{menuItem.category}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{formatPrice(menuItem.price)}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={menuItem.is_available ? 'default' : 'secondary'}
                                  className={menuItem.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                >
                                  {menuItem.is_available ? 'Available' : 'Unavailable'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <EditButton onClick={() => handleEditMenuItem(menuItem)} />
                                  <DeleteButton onClick={() => handleDeleteMenuItem(menuItem.id)} />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items found</h3>
                      <p className="text-gray-600 mb-4">Start by adding menu items for this restaurant.</p>
                      <Button 
                        onClick={() => setIsCreateMenuItemModalOpen(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Menu Item
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateRestaurantModal
        isOpen={isCreateRestaurantModalOpen}
        onClose={() => setIsCreateRestaurantModalOpen(false)}
      />

      <EditRestaurantModal
        isOpen={isEditRestaurantModalOpen}
        onClose={() => {
          setIsEditRestaurantModalOpen(false);
          setSelectedRestaurant(null);
        }}
        restaurantId={selectedRestaurant?.id}
        restaurantData={selectedRestaurant}
      />

      {selectedRestaurant && (
        <CreateMenuItemModal
          isOpen={isCreateMenuItemModalOpen}
          onClose={() => setIsCreateMenuItemModalOpen(false)}
          restaurantId={selectedRestaurant.id}
        />
      )}

      <EditMenuItemModal
        isOpen={isEditMenuItemModalOpen}
        onClose={() => {
          setIsEditMenuItemModalOpen(false);
          setSelectedMenuItem(null);
        }}
        menuItem={selectedMenuItem}
      />

      <DeleteConfirmationModal
        isOpen={restaurantDeleteConfirmation.isOpen}
        onClose={restaurantDeleteConfirmation.closeConfirmation}
        onConfirm={restaurantDeleteConfirmation.confirmDelete}
        isLoading={restaurantDeleteConfirmation.isDeleting}
        itemName="restaurant"
        title="Delete Restaurant"
        description="Are you sure you want to delete this restaurant? This will also remove all associated menu items."
      />

      <DeleteConfirmationModal
        isOpen={!!menuItemToDelete}
        onClose={() => setMenuItemToDelete(null)}
        onConfirm={confirmDeleteMenuItem}
        isLoading={deleteMenuItemMutation.isPending}
        itemName="menu item"
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
      />
    </div>
  );
};

export default RestaurantManagement;
