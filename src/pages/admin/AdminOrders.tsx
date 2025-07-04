import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Search, Edit, Trash2, Eye, Package, Loader2 } from 'lucide-react'; // Added Loader2 for spinners
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
} from '@/components/ui/alert-dialog'; // Shadcn UI AlertDialog for confirmation

/**
 * @typedef {object} OrderItem
 * @property {string} product_id - The ID of the product.
 * @property {number} quantity - The quantity of the product in the order.
 * @property {number} price_at_purchase - The price of the product at the time of purchase.
 * @property {object} products - Nested product details (if joined).
 * @property {string} products.name - Name of the product.
 * // Add other relevant order item properties
 */
interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  products?: {
    name: string;
  };
}

/**
 * @typedef {object} OrderProfile
 * @property {string} full_name - The full name of the customer.
 * @property {string} email - The email of the customer.
 * // Add other relevant profile properties
 */
interface OrderProfile {
  full_name?: string;
  email?: string;
}

/**
 * @typedef {object} OrderData
 * @property {string} id - Unique identifier for the order.
 * @property {string} customer_id - The ID of the customer who placed the order.
 * @property {number} total_amount - The total amount of the order.
 * @property {string} payment_status - The payment status of the order (e.g., 'pending', 'paid', 'failed').
 * @property {string} status - The current status of the order (e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled').
 * @property {string} created_at - Timestamp of order creation.
 * @property {OrderItem[]} [order_items] - Array of items in the order.
 * @property {OrderProfile} [profiles] - Customer profile details.
 */
interface OrderData {
  id: string;
  customer_id: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
  profiles?: OrderProfile;
}

/**
 * Placeholder for ViewOrderModal component.
 * In a real application, this would be a separate file.
 */
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
            <p><strong>Name:</strong> {order.profiles?.full_name || 'N/A'}</p>
            <p><strong>Email:</strong> {order.profiles?.email || 'N/A'}</p>
            <p><strong>Customer ID:</strong> {order.customer_id}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
            <p><strong>Total Amount:</strong> KSh {Number(order.total_amount).toLocaleString()}</p>
            <p><strong>Payment Status:</strong> <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="capitalize">{order.payment_status}</Badge></p>
            <p><strong>Order Status:</strong> <Badge variant={getOrderStatusColor(order.status)} className="capitalize">{order.status}</Badge></p>
            <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
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
                    <TableCell>KSh {Number(item.price_at_purchase).toLocaleString()}</TableCell>
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


/**
 * `AdminOrders` component provides an administrative interface for managing customer orders.
 * It allows viewing, updating order statuses, and deleting orders in the marketplace.
 * It uses `react-query` for data fetching and mutations, and Shadcn UI for styling.
 */
const AdminOrders = () => {
  const { toast } = useToast(); // Hook for displaying toast notifications
  const queryClient = useQueryClient(); // Client for invalidating react-query caches

  // State for search term and modal visibility
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showViewOrder, setShowViewOrder] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);

  /**
   * Fetches all orders from the 'orders' table, joining with 'profiles' and 'order_items'.
   * Uses `react-query` for caching and state management.
   */
  const { data: orders, isLoading } = useQuery<OrderData[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          customer_id,
          total_amount,
          payment_status,
          status,
          created_at,
          profiles (full_name, email),
          order_items (product_id, quantity, price_at_purchase, products (name))
        `)
        .order('created_at', { ascending: false }); // Order by creation date

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      return data;
    }
  });

  /**
   * Mutation for updating an order's status.
   * On success, invalidates the 'admin-orders' query and shows a toast.
   * On error, shows a destructive toast.
   */
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderData['status'] }) => {
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
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); // Refetch orders
      toast({ title: "Order status updated successfully", variant: "success" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating status",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  });

  /**
   * Mutation for deleting an order.
   * On success, invalidates the 'admin-orders' query and shows a toast.
   * On error, shows a destructive toast.
   */
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
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); // Refetch orders
      toast({ title: "Order deleted successfully", variant: "success" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting order",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  });

  /**
   * Handles the change of an order's status.
   * @param {string} id - The ID of the order.
   * @param {OrderData['status']} status - The new status.
   */
  const handleStatusChange = (id: string, status: OrderData['status']) => {
    updateOrderStatusMutation.mutate({ id, status });
  };

  /**
   * Opens the delete confirmation dialog for a specific order.
   * @param {string} orderId - The ID of the order to be deleted.
   */
  const confirmDeleteOrder = (orderId: string) => {
    setOrderToDeleteId(orderId);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Executes the delete mutation after user confirmation.
   */
  const handleDeleteOrder = () => {
    if (orderToDeleteId) {
      deleteOrderMutation.mutate(orderToDeleteId);
      setIsDeleteDialogOpen(false); // Close the dialog
      setOrderToDeleteId(null); // Reset the ID
    }
  };

  /**
   * Filters orders based on search term (Order ID, Customer Name, Customer Email).
   */
  const filteredOrders = orders?.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  /**
   * Handles click on the "View" button for an order.
   * Sets the selected order and opens the View Order modal.
   * @param {OrderData} order - The order data to be viewed.
   */
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
            {/* No "Add Order" button as orders are typically created by customers */}
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Order ID, Customer Name, or Email..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxLength={100}
                aria-label="Search orders"
              />
            </div>
            {/* Optional: Add filters for status, date range etc. */}
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
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && orders?.length === 0 ? ( // Show full loading spinner only on initial load without data
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <span className="text-lg font-medium">Loading orders...</span>
                  <p className="text-sm mt-1">Fetching the latest order data.</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                // Display table if orders are available
                <div className="overflow-x-auto">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</TableHead>
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
                            style={{ animationDelay: `${index * 0.05}s` }} // Subtle staggered animation
                          >
                            <TableCell className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                              #{order.id.slice(-8)}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="font-medium text-gray-900">{order.profiles?.full_name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{order.profiles?.email || 'N/A'}</div>
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
                                className={`capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} border-${order.payment_status === 'paid' ? 'green' : 'yellow'}-200`}
                              >
                                {order.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <Select
                                value={order.status}
                                onValueChange={(value: OrderData['status']) => handleStatusChange(order.id, value)}
                                disabled={isUpdatingStatus || isDeletingOrder} // Disable select during operations
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
                                {/* View Order Button */}
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleViewClick(order)}
                                  className="h-9 w-9 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-full"
                                  aria-label={`View order ${order.id.slice(-8)}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {/* Edit Order Button (currently only status is editable via select) */}
                                {/* You might add a full EditOrderModal here if more fields are editable */}
                                {/* <Button
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleEditClick(order)}
                                  className="h-9 w-9 text-yellow-600 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-200 rounded-full"
                                  aria-label={`Edit order ${order.id.slice(-8)}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button> */}
                                {/* Delete Order Button */}
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => confirmDeleteOrder(order.id)}
                                  disabled={isDeletingOrder || isUpdatingStatus} // Disable during operations
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
                // Empty state when no orders are found after loading
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