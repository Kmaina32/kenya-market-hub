
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock seeded data for admin panel
const seedUsers = [
  { id: '1', email: 'john.doe@email.com', full_name: 'John Doe', role: 'customer', created_at: '2024-01-15' },
  { id: '2', email: 'jane.smith@email.com', full_name: 'Jane Smith', role: 'vendor', created_at: '2024-01-14' },
  { id: '3', email: 'admin@sokosmart.com', full_name: 'Admin User', role: 'admin', created_at: '2024-01-13' },
  { id: '4', email: 'driver@sokosmart.com', full_name: 'Driver Mike', role: 'driver', created_at: '2024-01-12' },
];

const seedProducts = [
  { id: '1', name: 'iPhone 15 Pro', category: 'Electronics', price: 120000, in_stock: true, stock_quantity: 25 },
  { id: '2', name: 'Samsung Galaxy S24', category: 'Electronics', price: 95000, in_stock: true, stock_quantity: 15 },
  { id: '3', name: 'MacBook Pro M3', category: 'Electronics', price: 250000, in_stock: false, stock_quantity: 0 },
  { id: '4', name: 'Nike Air Max', category: 'Fashion', price: 12000, in_stock: true, stock_quantity: 30 },
];

const seedOrders = [
  { id: '1', user_id: '1', total_amount: 120000, status: 'pending', created_at: '2024-01-20', customer_name: 'John Doe' },
  { id: '2', user_id: '2', total_amount: 95000, status: 'completed', created_at: '2024-01-19', customer_name: 'Jane Smith' },
  { id: '3', user_id: '1', total_amount: 12000, status: 'shipped', created_at: '2024-01-18', customer_name: 'John Doe' },
];

const seedNotifications = [
  { id: '1', title: 'New Order Received', message: 'Order #1001 has been placed', type: 'info', is_read: false, created_at: '2024-01-20T10:30:00Z' },
  { id: '2', title: 'Payment Confirmed', message: 'Payment for order #1000 confirmed', type: 'success', is_read: false, created_at: '2024-01-20T09:15:00Z' },
  { id: '3', title: 'Low Stock Alert', message: 'MacBook Pro M3 is out of stock', type: 'warning', is_read: true, created_at: '2024-01-19T16:45:00Z' },
  { id: '4', title: 'New User Registration', message: 'New user registered: john.doe@email.com', type: 'info', is_read: false, created_at: '2024-01-19T14:20:00Z' },
];

export const useAdminUsers = () => {
  const [users, setUsers] = useState(seedUsers);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(prev => prev.filter(user => user.id !== userId));
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    deleteUser,
  };
};

export const useAdminProducts = () => {
  const [products, setProducts] = useState(seedProducts);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const deleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(prev => prev.filter(product => product.id !== productId));
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
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productData: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
      };
      setProducts(prev => [newProduct, ...prev]);
      toast({
        title: 'Success',
        description: 'Product added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    deleteProduct,
    addProduct,
  };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState(seedOrders);
  const [isLoading, setIsLoading] = useState(false);

  return {
    orders,
    isLoading,
  };
};

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState(seedNotifications);
  const [isLoading, setIsLoading] = useState(false);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, is_read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, is_read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
