
import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  User, 
  Star, 
  MapPin, 
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import HeroSection from '@/components/shared/HeroSection';

const ServiceHub = () => {
  const handleApplyProvider = () => {
    console.log('Apply to become provider');
  };

  const handleManageServices = () => {
    console.log('Manage services');
  };

  const serviceCategories = [
    {
      id: 1,
      name: 'Home Cleaning',
      icon: '🏠',
      providers: 24,
      avgRating: 4.5,
      startingPrice: 1500
    },
    {
      id: 2,
      name: 'Plumbing',
      icon: '🔧',
      providers: 18,
      avgRating: 4.3,
      startingPrice: 2000
    },
    {
      id: 3,
      name: 'Electrical Work',
      icon: '⚡',
      providers: 15,
      avgRating: 4.6,
      startingPrice: 2500
    }
  ];

  const featuredProviders = [
    {
      id: 1,
      name: 'John Mbugua',
      service: 'Professional Cleaner',
      rating: 4.8,
      completedJobs: 150,
      location: 'Nairobi',
      hourlyRate: 800,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    {
      id: 2,
      name: 'Mary Wanjiku',
      service: 'Plumber',
      rating: 4.9,
      completedJobs: 89,
      location: 'Kiambu',
      hourlyRate: 1200,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
    }
  ];

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <HeroSection
            title="Service Hub"
            subtitle="Join Our Community"
            description="Apply to become a service provider and grow your business with Kenya's largest marketplace"
            imageUrl="photo-1560472354-b33ff0c44a43"
            className="mb-8 h-64"
          />

          <div className="max-w-6xl mx-auto">
            {/* Action Buttons - Fixed spacing */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={handleApplyProvider}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-14 text-lg font-semibold"
              >
                <User className="h-5 w-5 mr-2" />
                Apply to Become a Provider
              </Button>
              <Button 
                onClick={handleManageServices}
                variant="outline"
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 h-14 text-lg font-semibold bg-white"
              >
                <Wrench className="h-5 w-5 mr-2" />
                Manage My Services
              </Button>
            </div>

            {/* Service Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Service Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {serviceCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow bg-white border-orange-100">
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">{category.icon}</div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Providers:</span>
                        <span className="font-medium">{category.providers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{category.avgRating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Starting from:</span>
                        <span className="font-semibold text-green-600">KSh {category.startingPrice.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured Providers */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Service Providers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-shadow bg-white border-orange-100">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={provider.avatar} 
                          alt={provider.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                          <p className="text-orange-600 font-medium mb-2">{provider.service}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{provider.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span>{provider.completedJobs} jobs</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{provider.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-green-600 font-semibold">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>KSh {provider.hourlyRate}/hr</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-white">
                                <Phone className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                Book
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Provider Benefits */}
            <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-900">
                  Why Join as a Service Provider?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Earn More</h3>
                    <p className="text-gray-600">Set your own rates and increase your income by reaching more customers.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
                    <p className="text-gray-600">Work on your own terms and choose jobs that fit your schedule.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Build Reputation</h3>
                    <p className="text-gray-600">Gain reviews and build a strong reputation to attract more clients.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ServiceHub;
