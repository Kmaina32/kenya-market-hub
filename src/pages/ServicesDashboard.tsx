
import React, { useState } from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Star,
  MapPin,
  User,
  Phone
} from 'lucide-react';

const ServicesDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data for services
  const mockServices = [
    {
      id: 1,
      title: 'House Cleaning Service',
      provider: 'CleanPro Services',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      location: 'Karen, Nairobi',
      price: 3500,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Plumbing Repair',
      provider: 'FixIt Plumbers',
      date: '2024-01-12',
      time: '2:00 PM',
      status: 'completed',
      location: 'Westlands, Nairobi',
      price: 2800,
      rating: 4.5
    },
    {
      id: 3,
      title: 'Car Wash',
      provider: 'Sparkle Auto Care',
      date: '2024-01-18',
      time: '9:00 AM',
      status: 'pending',
      location: 'Kilimani, Nairobi',
      price: 1200,
      rating: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleBookService = () => {
    console.log('Booking new service...');
    // Navigate to service booking page
  };

  const handleCreatePost = () => {
    console.log('Creating service post...');
    // Navigate to service post creation
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage My Services</h1>
                <p className="text-gray-600 mt-2">Track and manage all your service bookings</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleBookService}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Service
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleCreatePost}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Post
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Services</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Completed</p>
                    <p className="text-3xl font-bold">8</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Pending</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">This Month</p>
                    <p className="text-3xl font-bold">5</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="active">Active Services</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="grid gap-6">
                {mockServices.filter(service => service.status === 'confirmed').map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                            <Badge className={`${getStatusColor(service.status)} flex items-center gap-1`}>
                              {getStatusIcon(service.status)}
                              {service.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{service.provider}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{service.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{service.date} at {service.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-green-600">
                                KSh {service.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:border-orange-200">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-gray-50">
                            <Edit className="h-4 w-4 mr-1" />
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="grid gap-6">
                {mockServices.filter(service => service.status === 'completed').map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                            <Badge className={`${getStatusColor(service.status)} flex items-center gap-1`}>
                              {getStatusIcon(service.status)}
                              {service.status}
                            </Badge>
                            {service.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{service.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{service.provider}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{service.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{service.date} at {service.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-green-600">
                                KSh {service.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                            <Star className="h-4 w-4 mr-1" />
                            Rate Service
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <div className="grid gap-6">
                {mockServices.filter(service => service.status === 'pending').map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                            <Badge className={`${getStatusColor(service.status)} flex items-center gap-1`}>
                              {getStatusIcon(service.status)}
                              Awaiting Confirmation
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{service.provider}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{service.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{service.date} at {service.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-green-600">
                                KSh {service.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200 text-red-600">
                            Cancel Booking
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                            <Phone className="h-4 w-4 mr-1" />
                            Follow Up
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cancelled">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cancelled Services</h3>
                <p className="text-gray-600">You don't have any cancelled services.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ServicesDashboard;
