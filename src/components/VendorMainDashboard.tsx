import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, Store, Users, TrendingUp
} from 'lucide-react';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useVendorAnalytics } from '@/hooks/useVendorAnalytics';
import { useProducts } from '@/hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';

const VendorMainDashboard = () => {
  const { data: vendorProfile } = useMyVendorProfile();
  const analytics = useVendorAnalytics();
  const { data: products = [] } = useProducts({ vendorId: vendorProfile?.id });
  const navigate = useNavigate();

  // Orders fetching (recent 5)
  const { data: recentOrders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['vendor-recent-orders', vendorProfile?.id],
    enabled: !!vendorProfile?.id,
    queryFn: async () => {
      if (!vendorProfile?.id) return [];
      // Fetch recent orders for this vendor via their products
      const { data: orderItems, error } = await supabase
        .from('order_items').select(`
          order_id, orders(created_at, user_id, total_amount, status), 
          product_id, quantity, total_price, products(name)
        `)
        .eq('products.vendor_id', vendorProfile.id)
        .order('orders.created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      const summarized = {};
      // Group by order
      (orderItems || []).forEach((item) => {
        const oid = item.order_id;
        if (!summarized[oid]) {
          summarized[oid] = {
            orderId: oid,
            createdAt: item.orders?.created_at,
            userId: item.orders?.user_id,
            status: item.orders?.status || 'n/a',
            total: item.orders?.total_amount || 0,
            products: []
          };
        }
        summarized[oid].products.push(item.products?.name);
      });
      // Return summary
      return Object.values(summarized).slice(0, 5);
    }
  });

  // Top products (by sales)
  const { data: topProducts = [], isLoading: isTopLoading } = useQuery({
    queryKey: ['vendor-top-products', vendorProfile?.id],
    enabled: !!vendorProfile?.id,
    queryFn: async () => {
      if (!vendorProfile?.id) return [];
      // Aggregate sales per product
      const { data: orderItems, error } = await supabase
        .from('order_items').select(`
          product_id, quantity, products(name)
        `)
        .eq('products.vendor_id', vendorProfile.id);

      if (error) throw error;
      // Aggregate sales by product
      const byProduct: Record<string, { name: string; sales: number }> = {};
      (orderItems || []).forEach((item) => {
        const pid = item.product_id;
        if (!byProduct[pid]) {
          byProduct[pid] = { 
            name: item.products?.name,
            sales: 0
          };
        }
        byProduct[pid].sales += item.quantity || 0;
      });
      // Return sorted
      return Object.values(byProduct)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 3);
    }
  });


  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new product in your store',
      icon: Plus,
      color: 'bg-orange-500',
      action: () => navigate('/vendor/products/add')
    },
    {
      title: 'View Store',
      description: 'See how customers view your store',
      icon: Store,
      color: 'bg-blue-500',
      action: () => navigate('/vendor/store')
    },
    {
      title: 'Customers',
      description: 'Manage customer relationships',
      icon: Users,
      color: 'bg-purple-500',
      action: () => navigate('/vendor/customers')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Store className="h-8 w-8" />
          Vendor Dashboard
        </h1>
        <p className="text-orange-100 mt-2">
          Welcome back! Manage your store and grow your business
        </p>
        {vendorProfile && (
          <div className="mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {vendorProfile.business_name}
            </Badge>
          </div>
        )}
      </div>
      {/* --- Vendor Analytics Section --- */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left space-y-2 hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Real Analytics */}
      {analytics.isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner /> <span>Loading analytics...</span>
        </div>
      ) : analytics.error ? (
        <Card><CardContent className="text-red-500">Error loading analytics data.</CardContent></Card>
      ) : analytics.data ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp /> Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <div className="text-xs text-gray-500">Revenue</div>
                <div className="font-bold text-lg text-green-600">KSh {analytics.data.totalRevenue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Orders</div>
                <div className="font-bold text-lg">{analytics.data.totalOrders}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Products</div>
                <div className="font-bold text-lg">{analytics.data.totalProducts}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Avg. Rating</div>
                <div className="font-bold text-lg">{analytics.data.averageRating || '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Recent Orders */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isOrdersLoading ? (
            <div><LoadingSpinner /> Loading...</div>
          ) : (
            <div className="space-y-4">
              {recentOrders.length === 0 && (
                <div className="text-center text-gray-400">No orders yet.</div>
              )}
              {recentOrders.map((order: any, i: number) => (
                <div key={order.orderId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{String(order.orderId).slice(0, 7)}</p>
                    <p className="text-sm text-gray-600">{order.products.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-orange-800">KSh {order.total ? Number(order.total).toLocaleString() : '-'}</div>
                    <Badge variant="outline" className="text-xs">{order.status || 'n/a'}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Top Products */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isTopLoading ? <LoadingSpinner /> : (
            <div className="space-y-4">
              {topProducts && topProducts.length > 0 ? topProducts.map((product: any, idx: number) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.sales} sold</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-400">No sales yet.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorMainDashboard;
