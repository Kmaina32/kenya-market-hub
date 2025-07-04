
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Eye, Package, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useToast } from '@/hooks/use-toast';

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch orders with user profiles separately
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;

      // Fetch user profiles separately
      const userIds = [...new Set(ordersData.map(order => order.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;

      // Combine the data
      const ordersWithProfiles = ordersData.map(order => ({
        ...order,
        user_profile: profilesData.find(profile => profile.id === order.user_id)
      }));

      return ordersWithProfiles || [];
    }
  });

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ orderId, newStatus });
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8" />
              Order Management
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">Monitor and manage all customer orders</p>
          </div>

          {/* Order Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{pendingOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{completedOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">KSH {totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Orders</CardTitle>
              <CardDescription className="text-sm">View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading orders...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Order ID</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Customer</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm font-mono">
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="font-medium">{order.user_profile?.full_name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{order.user_profile?.email || 'No email'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm font-medium">
                            KSH {Number(order.total_amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleView(order)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Order Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </DialogTitle>
                <DialogDescription>
                  Order #{selectedOrder?.id?.slice(0, 8)}
                </DialogDescription>
              </DialogHeader>
              
              {selectedOrder && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">Customer Information</h3>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedOrder.user_profile?.full_name || 'Unknown'}</p>
                          <p><span className="font-medium">Email:</span> {selectedOrder.user_profile?.email || 'No email'}</p>
                          <p><span className="font-medium">Phone:</span> {selectedOrder.user_profile?.phone || 'No phone'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold">Order Information</h3>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Order ID:</span> #{selectedOrder.id}</p>
                          <p><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                          <p><span className="font-medium">Payment Method:</span> {selectedOrder.payment_method || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">Order Summary</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span className="font-bold text-green-600">KSH {Number(selectedOrder.total_amount).toLocaleString()}</span>
                          </div>
                          {selectedOrder.discount_amount > 0 && (
                            <div className="flex justify-between text-red-600">
                              <span>Discount:</span>
                              <span>-KSH {Number(selectedOrder.discount_amount).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold">Status</h3>
                        <div className="mt-2">
                          <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                            {selectedOrder.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedOrder.payment_status && (
                        <div>
                          <h3 className="text-lg font-bold">Payment Status</h3>
                          <div className="mt-2">
                            <Badge variant={selectedOrder.payment_status === 'completed' ? 'default' : 'secondary'}>
                              {selectedOrder.payment_status}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedOrder.shipping_address && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
                      <div className="text-sm">
                        {typeof selectedOrder.shipping_address === 'object' ? (
                          <div className="space-y-1">
                            <p>{selectedOrder.shipping_address.street}</p>
                            <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}</p>
                            <p>{selectedOrder.shipping_address.postal_code}</p>
                            <p>{selectedOrder.shipping_address.country}</p>
                          </div>
                        ) : (
                          <p>{selectedOrder.shipping_address}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminOrders;
