import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HomeHeroSection from '@/components/shared/HomeHeroSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Car, Home, Briefcase, Calendar, MessageCircle, Shield, Package, Truck } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import SEOManager from '@/components/seo/SEOManager';
import AdvertisementPopup from '@/components/ads/AdvertisementPopup';
import AdvertisementBillboard from '@/components/ads/AdvertisementBillboard';

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

      {/* Advertisement Popup */}
      <AdvertisementPopup isEnabled={true} intervalMinutes={5} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HomeHeroSection />
        
        {/* Advertisement Billboard */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <AdvertisementBillboard className="mb-6 sm:mb-8" layout="horizontal" />
        </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Adjusted grid columns */}
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
                  <Package className="h-8 w-8 text-green-600" /> 
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Wide Selection of Local Products</h3>
                <p className="text-gray-600">
                  Support local businesses and find unique products from vendors near you.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Truck className="h-8 w-8 text-blue-600" /> 
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast and Reliable Delivery</h3>
                <p className="text-gray-600">
                  Get your orders delivered quickly and reliably right to your doorstep.
                </p>
              </div>
               
               <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6"> 
                  <MessageCircle className="h-8 w-8 text-purple-600" /> 
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is always here to help you succeed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section - MODIFIED */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-16
         mx-4 sm:mx-6 lg:mx-8 rounded-3xl shadow-xl mt-12 mb-12"> {/* Added these classes */}
          <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 lg:px-12"> {/* Kept inner padding for content */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"> {/* Increased text size for impact */}
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-2xl mx-auto"> {/* Adjusted text size and added max-width */}
              Join thousands of users who trust Sokko Sasa for their daily needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700 font-semibold px-8 py-3 !rounded-full">
                  Sign Up Today
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="border-white text-orange-600 bg-white hover:bg-orange-50 font-semibold px-8 py-3 !rounded-full">
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
