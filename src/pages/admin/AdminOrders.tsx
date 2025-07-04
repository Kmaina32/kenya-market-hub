
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Search, Edit, Trash2, Eye, Package, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: {
    name: string;
  };
}

interface OrderData {
  id: string;
  user_id: string;
  total_amount: number;
  payment_status: string;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

interface ViewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderData | null;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-blue-700">Order Details #{order.id.slice(-8)}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Comprehensive details for order ID: {order.id}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
            <div className="mt-2 space-y-2">
              <p><strong>Customer ID:</strong> {order.user_id}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
            <div className="mt-2 space-y-2">
              <p><strong>Total Amount:</strong> KSh {Number(order.total_amount).toLocaleString()}</p>
              <p><strong>Payment Status:</strong> <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="capitalize">{order.payment_status}</Badge></p>
              <p><strong>Order Status:</strong> <Badge variant={getOrderStatusColor(order.status)} className="capitalize">{order.status}</Badge></p>
              <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Order Items ({order.order_items?.length || 0})</h3>
          {order.order_items && order.order_items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.products?.name || 'N/A'}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>KSh {Number(item.unit_price).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-sm">No items found for this order.</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-700">Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Helper function for status color (moved outside to be accessible by ViewOrderModal)
const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'default';
    case 'shipped': return 'default';
    case 'processing': return 'secondary';
    case 'pending': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const AdminOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for search term and modal visibility
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showViewOrder, setShowViewOrder] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery<OrderData[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          total_amount,
          payment_status,
          status,
          created_at,
          order_items (product_id, quantity, unit_price, products (name))
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      return data || [];
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) {
        console.error('Supabase update status error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: "Order status updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating status",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      if (error) {
        console.error('Supabase delete order error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: "Order deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting order",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  });

  const handleStatusChange = (id: string, status: string) => {
    updateOrderStatusMutation.mutate({ id, status });
  };

  const confirmDeleteOrder = (orderId: string) => {
    setOrderToDeleteId(orderId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteOrder = () => {
    if (orderToDeleteId) {
      deleteOrderMutation.mutate(orderToDeleteId);
      setIsDeleteDialogOpen(false);
      setOrderToDeleteId(null);
    }
  };

  const filteredOrders = (orders || []).filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClick = (order: OrderData) => {
    setSelectedOrder(order);
    setShowViewOrder(true);
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 p-4 md:p-6 animate-fade-in">
          {/* Page Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingBag className="h-9 w-9" />
                Order Management
              </h1>
              <p className="text-blue-100 mt-2 text-lg">Oversee and manage all customer orders.</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Order ID or Customer ID..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxLength={100}
                aria-label="Search orders"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
              disabled={isLoading}
              className="text-gray-600 hover:bg-gray-100"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Refresh
            </Button>
          </div>

          {/* Orders Table Card */}
          <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-6 bg-white border-b border-gray-100">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-800">All Orders</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  A comprehensive list of all orders placed in your marketplace. ({filteredOrders.length} orders)
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && (!orders || orders.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <span className="text-lg font-medium">Loading orders...</span>
                  <p className="text-sm mt-1">Fetching the latest order data.</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order, index) => {
                        const isUpdatingStatus = updateOrderStatusMutation.isPending && updateOrderStatusMutation.variables?.id === order.id;
                        const isDeletingOrder = deleteOrderMutation.isPending && deleteOrderMutation.variables === order.id;

                        return (
                          <TableRow
                            key={order.id}
                            className="hover:bg-blue-50 transition-colors duration-200 ease-in-out"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <TableCell className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                              #{order.id.slice(-8)}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="font-medium text-gray-900">Customer</div>
                                <div className="text-sm text-gray-500">{order.user_id.slice(-8)}</div>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-gray-700">
                                <Package className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{order.order_items?.length || 0} items</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                              KSh {Number(order.total_amount).toLocaleString()}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
                                className={`capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                              >
                                {order.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <Select
                                value={order.status}
                                onValueChange={(value: string) => handleStatusChange(order.id, value)}
                                disabled={isUpdatingStatus || isDeletingOrder}
                              >
                                <SelectTrigger className="w-36 h-9 text-gray-700 border-gray-300 hover:border-blue-400">
                                  {isUpdatingStatus ? (
                                    <span className="flex items-center gap-1">
                                      <Loader2 className="h-3 w-3 animate-spin" /> Updating...
                                    </span>
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleViewClick(order)}
                                  className="h-9 w-9 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-full"
                                  aria-label={`View order ${order.id.slice(-8)}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => confirmDeleteOrder(order.id)}
                                  disabled={isDeletingOrder || isUpdatingStatus}
                                  className="h-9 w-9 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 rounded-full"
                                  aria-label={`Delete order ${order.id.slice(-8)}`}
                                >
                                  {isDeletingOrder ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <p className="text-xl font-semibold">No Orders Found</p>
                  <p className="text-md mt-2">
                    {searchTerm ? 'No orders match your search criteria.' : 'Orders will appear here once customers start making purchases.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* View Order Modal */}
        {selectedOrder && (
          <ViewOrderModal
            open={showViewOrder}
            onOpenChange={setShowViewOrder}
            order={selectedOrder}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure you want to delete this order? This action cannot be undone and will permanently remove the order and its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteOrderMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteOrder}
                disabled={deleteOrderMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteOrderMutation.isPending ? (
                  <span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</span>
                ) : (
                  'Delete Order'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminOrders;
