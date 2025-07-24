
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAdminProducts, useDeleteProduct, useUpdateProduct } from '@/hooks/useAdminProducts';
import { useAdminUsers, useDeleteUser, useUpdateUserRole } from '@/hooks/useAdminUsers';
import { Settings, Users, Package, BarChart3, Activity, DollarSign, TrendingUp } from 'lucide-react';
import AdminProductsTab from './AdminProductsTab';
import AdminUsersTab from './AdminUsersTab';
import AdminSettingsManager from './AdminSettingsManager';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  // Product management
  const { data: products, isLoading: productsLoading } = useAdminProducts();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  // User management
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(productId);
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser.mutateAsync(userId);
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete user',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddProduct = () => {
    toast({
      title: 'Coming Soon',
      description: 'Product creation form will be implemented soon',
    });
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole.mutateAsync({ userId, role: newRole as any });
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  // Dashboard stats
  const stats = [
    {
      title: 'Total Products',
      value: products?.length || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Products',
      value: products?.filter(p => p.in_stock).length || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Revenue',
      value: 'KSH 0',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform from here</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          System Online
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New product added</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">User registered</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Settings updated</p>
                    <p className="text-xs text-gray-500">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <AdminProductsTab
            products={products}
            isLoading={productsLoading}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            isDeleting={deleteProduct.isPending}
          />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersTab
            users={users}
            isLoading={usersLoading}
            onDeleteUser={handleDeleteUser}
            isDeleting={deleteUser.isPending}
          />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
