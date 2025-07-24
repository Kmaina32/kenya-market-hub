
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, CheckCircle, XCircle, Clock, Users, Wrench } from 'lucide-react';
import { useAdminServiceBookings } from '@/hooks/useAdminServiceBookings';

const AdminServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: bookings, isLoading } = useAdminServiceBookings();

  const filteredBookings = bookings?.filter(booking =>
    booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.provider_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'pending': return 'secondary';
      case 'confirmed': return 'outline';
      default: return 'secondary';
    }
  };

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings?.length || 0,
      icon: Wrench,
      color: 'text-blue-600'
    },
    {
      title: 'Active Bookings',
      value: bookings?.filter(b => b.status === 'confirmed').length || 0,
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Completed',
      value: bookings?.filter(b => b.status === 'completed').length || 0,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Service Providers',
      value: new Set(bookings?.map(b => b.provider_id)).size || 0,
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Service Management</h1>
            <p className="text-gray-600">Manage service bookings and providers</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Service Category
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

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Service Bookings</TabsTrigger>
            <TabsTrigger value="providers">Service Providers</TabsTrigger>
            <TabsTrigger value="categories">Service Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Service Bookings</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search bookings..."
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
                    <p className="mt-2 text-gray-600">Loading bookings...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{booking.service_type}</div>
                                <div className="text-sm text-gray-500">{booking.service_description}</div>
                              </div>
                            </TableCell>
                            <TableCell>{booking.customer_name}</TableCell>
                            <TableCell>{booking.provider_name}</TableCell>
                            <TableCell>
                              <div>
                                <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500">{booking.booking_time}</div>
                              </div>
                            </TableCell>
                            <TableCell>KSh {booking.total_amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(booking.status)}>
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  Edit
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

          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Service Providers</h3>
                  <p className="text-gray-600">Service provider management coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Service Categories</h3>
                  <p className="text-gray-600">Service category management coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
