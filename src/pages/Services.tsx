
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Car, 
  Home, 
  Briefcase, 
  Heart, 
  Shield, 
  Truck,
  Users,
  MessageSquare,
  Calendar,
  Star,
  ArrowRight
} from 'lucide-react';
import SEOManager from '@/components/seo/SEOManager';

const Services = () => {
  const services = [
    {
      id: 'marketplace',
      title: 'Online Marketplace',
      description: 'Buy and sell products from trusted vendors across Kenya',
      icon: ShoppingBag,
      features: ['Secure payments', 'Product reviews', 'Fast delivery', 'Quality assurance'],
      color: 'from-blue-500 to-cyan-500',
      link: '/shop'
    },
    {
      id: 'rides',
      title: 'Ride Hailing',
      description: 'Safe and affordable rides with verified drivers',
      icon: Car,
      features: ['GPS tracking', 'Fare estimates', 'Emergency contacts', '24/7 support'],
      color: 'from-green-500 to-emerald-500',
      link: '/rides'
    },
    {
      id: 'properties',
      title: 'Real Estate',
      description: 'Find your perfect home or investment property',
      icon: Home,
      features: ['Property listings', 'Virtual tours', 'Agent contacts', 'Market insights'],
      color: 'from-purple-500 to-pink-500',
      link: '/properties'
    },
    {
      id: 'jobs',
      title: 'Job Portal',
      description: 'Connect with top employers and find your dream job',
      icon: Briefcase,
      features: ['Job matching', 'Resume builder', 'Interview prep', 'Career advice'],
      color: 'from-orange-500 to-red-500',
      link: '/jobs'
    },
    {
      id: 'medical',
      title: 'Healthcare Services',
      description: 'Access quality healthcare from certified providers',
      icon: Heart,
      features: ['Doctor consultations', 'Pharmacy services', 'Health records', 'Telemedicine'],
      color: 'from-teal-500 to-cyan-500',
      link: '/medical'
    },
    {
      id: 'insurance',
      title: 'Insurance Plans',
      description: 'Protect what matters most with comprehensive coverage',
      icon: Shield,
      features: ['Life insurance', 'Health coverage', 'Property protection', 'Claims support'],
      color: 'from-indigo-500 to-purple-500',
      link: '/insurance'
    },
    {
      id: 'delivery',
      title: 'Delivery Services',
      description: 'Fast and reliable delivery for all your needs',
      icon: Truck,
      features: ['Same-day delivery', 'Package tracking', 'Secure handling', 'Multiple locations'],
      color: 'from-amber-500 to-orange-500',
      link: '/delivery'
    },
    {
      id: 'community',
      title: 'Community Forum',
      description: 'Connect with like-minded individuals and share knowledge',
      icon: Users,
      features: ['Discussion groups', 'Expert advice', 'Local events', 'Networking'],
      color: 'from-pink-500 to-rose-500',
      link: '/community'
    }
  ];

  const additionalServices = [
    {
      icon: MessageSquare,
      title: 'Customer Support',
      description: '24/7 multilingual support team ready to help you'
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Plan and manage events with our comprehensive tools'
    },
    {
      icon: Star,
      title: 'Premium Membership',
      description: 'Unlock exclusive features and priority support'
    }
  ];

  return (
    <MainLayout>
      <SEOManager
        title="Our Services | Sokko Sasa - Complete Digital Solutions in Kenya"
        description="Discover all services offered by Sokko Sasa including marketplace, rides, real estate, jobs, healthcare, insurance and more in Kenya."
        keywords="services Kenya, online marketplace, ride hailing, real estate, jobs, healthcare, insurance"
        url={`${window.location.origin}/services`}
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Comprehensive digital solutions designed to make your life easier and more connected
            </p>
          </div>
        </div>

        {/* Main Services */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need in one platform - from shopping to healthcare, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-orange-200">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 group"
                      onClick={() => window.location.href = service.link}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Extra features and support to enhance your experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <IconComponent className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of satisfied customers who trust Sokko Sasa for their daily needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100"
                onClick={() => window.location.href = '/auth'}
              >
                Sign Up Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-orange-600"
                onClick={() => window.location.href = '/shop'}
              >
                Explore Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;
