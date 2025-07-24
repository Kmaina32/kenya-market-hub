
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, UtensilsCrossed, Clock, CheckCircle, Store } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminRestaurants = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredMenuItems = menuItems?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = [
    {
      title: 'Total Menu Items',
      value: menuItems?.length || 0,
      icon: UtensilsCrossed,
      color: 'text-blue-600'
    },
    {
      title: 'Available Items',
      value: menuItems?.filter(item => item.is_available).length || 0,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Out of Stock',
      value: menuItems?.filter(item => !item.is_available).length || 0,
      icon: Clock,
      color: 'text-red-600'
    },
    {
      title: 'Categories',
      value: new Set(menuItems?.map(item => item.category)).size || 0,
      icon: Store,
      color: 'text-purple-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Restaurant Management</h1>
            <p className="text-gray-600">Manage restaurants and menu items</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="menu-items" className="space-y-4">
          <TabsList>
            <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="orders">Food Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="menu-items" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Menu Items</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading menu items...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
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
                        {filteredMenuItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>KSh {item.price}</TableCell>
                            <TableCell>
                              <Badge variant={item.is_available ? 'default' : 'destructive'}>
                                {item.is_available ? 'Available' : 'Out of Stock'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  {item.is_available ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Restaurants</h3>
                  <p className="text-gray-600">Restaurant management coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Food Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Food Orders</h3>
                  <p className="text-gray-600">Food order management coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminRestaurants;
