
import React, { useState } from 'react';
import ServicesLayout from '@/components/layouts/ServicesLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  User, 
  Settings,
  Plus,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useProviderBookings, useUpdateBookingStatus } from '@/hooks/useServiceBookings';
import { useAuth } from '@/contexts/AuthContext';

const ServiceProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useProviderBookings();
  const updateBookingStatus = useUpdateBookingStatus();
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.total_amount, 0);

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length.toString(),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Requests",
      value: pendingBookings.length.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Completed Jobs",
      value: completedBookings.length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Earnings",
      value: `KSh ${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus.mutate({
      bookingId,
      status: 'confirmed',
      notes: 'Booking accepted by service provider'
    });
  };

  const handleDeclineBooking = (bookingId: string) => {
    updateBookingStatus.mutate({
      bookingId,
      status: 'rejected',
      notes: 'Booking declined by service provider'
    });
  };

  if (isLoading) {
    return (
      <ServicesLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </ServicesLayout>
    );
  }

  return (
    <ServicesLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Service Provider Dashboard</h1>
              <p className="text-orange-100">
                Welcome back! Manage your services and bookings from here.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent hover:bg-white/10 text-white border-white/30"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{booking.service_type}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {booking.service_description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.booking_address}
                          </span>
                          <span className="font-medium text-green-600">
                            KSh {booking.total_amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No bookings yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Service
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Bookings
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Earnings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{booking.service_type}</h4>
                          <p className="text-sm text-gray-600">
                            {booking.customer?.full_name || 'Unknown Customer'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {booking.service_description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <p className="font-medium">{booking.booking_time}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="font-medium">{booking.booking_address}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-medium text-green-600">
                            KSh {booking.total_amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptBooking(booking.id)}
                            disabled={updateBookingStatus.isPending}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineBooking(booking.id)}
                            disabled={updateBookingStatus.isPending}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No bookings found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>My Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Service management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Profile management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ServicesLayout>
  );
};

export default ServiceProviderDashboard;
