
import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HomeHeroSection from '@/components/shared/HomeHeroSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Car, Home, Briefcase, Calendar, MessageCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOManager from '@/components/seo/SEOManager';

const Index = () => {
  const services = [
    {
      title: 'Shop Products',
      description: 'Browse and buy from thousands of products',
      icon: ShoppingBag,
      link: '/shop',
      color: 'bg-orange-50 hover:bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Book Rides',
      description: 'Safe and reliable transportation services',
      icon: Car,
      link: '/rides',
      color: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Real Estate',
      description: 'Find your dream property',
      icon: Home,
      link: '/real-estate',
      color: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Professional Services',
      description: 'Connect with skilled professionals',
      icon: Briefcase,
      link: '/services',
      color: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Events',
      description: 'Discover and book amazing events',
      icon: Calendar,
      link: '/events',
      color: 'bg-pink-50 hover:bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Community',
      description: 'Join discussions and forums',
      icon: MessageCircle,
      link: '/chat-forums',
      color: 'bg-indigo-50 hover:bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <FrontendLayout>
      <SEOManager
        title="Sokko Sasa - Africa's Smart Marketplace | Shop, Ride, Connect"
        description="Discover everything you need on Sokko Sasa - Kenya's premier marketplace. Shop products, book rides, find properties, hire services, and connect with your community all in one place."
        keywords="Sokko Sasa, Kenya marketplace, online shopping Kenya, taxi booking Kenya, property Kenya, services Kenya, events Kenya"
        url={window.location.origin}
        type="website"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HomeHeroSection />

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From shopping to transportation, real estate to professional services - 
              Sokko Sasa connects you to what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className={`${service.color} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full`}>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4">
                      <service.icon className={`h-8 w-8 ${service.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button variant="ghost" className="group">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Sokko Sasa?
              </h2>
              <p className="text-lg text-gray-600">
                Built for Africa, designed for convenience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Trusted</h3>
                <p className="text-gray-600">
                  Your safety and security are our top priorities. All transactions are protected.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is always here to help you succeed.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Focus</h3>
                <p className="text-gray-600">
                  Designed specifically for African markets with local payment methods.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of users who trust Sokko Sasa for their daily needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3">
                  Sign Up Today
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-3">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Index;
