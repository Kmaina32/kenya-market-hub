
import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { HeroSection } from '@/components/shared/HeroSection';
import { ErrorBoundary } from '@/components/enhanced/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Star, Truck } from 'lucide-react';

const Index = () => {
  return (
    <ErrorBoundary>
      <FrontendLayout>
        <div className="animate-fade-in">
          <HeroSection
            title="Welcome to Sokko Sasa"
            subtitle="Kenya's Smart Marketplace"
            description="Discover amazing products, services, and opportunities all in one place. From shopping to rides, from services to real estate - we've got you covered."
            primaryAction={{
              text: "Start Shopping",
              onClick: () => window.location.href = '/shop'
            }}
            secondaryAction={{
              text: "Explore Services",
              onClick: () => window.location.href = '/services'
            }}
            searchPlaceholder="Search for products, services..."
            onSearch={(query) => {
              window.location.href = `/shop?search=${encodeURIComponent(query)}`;
            }}
          />
          
          <div className="space-y-16 py-8">
            {/* Featured Categories Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Explore Our Categories
                </h2>
                <p className="text-xl text-gray-600">
                  Find exactly what you're looking for
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <ShoppingBag className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                    <CardTitle className="text-lg">Shopping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Browse thousands of products from local vendors
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-lg">Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Connect with trusted service providers
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <Truck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <CardTitle className="text-lg">Rides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Quick and reliable transportation
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <CardTitle className="text-lg">More</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Real estate, jobs, events and more
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Featured Products Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-xl text-gray-600">
                  Trending items from our vendors
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <Card key={item} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                    <CardHeader>
                      <CardTitle className="text-lg">Sample Product {item}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-2">High quality product description</p>
                      <p className="text-xl font-bold text-orange-600">KSh 2,500</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Service Showcase Section */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Our Services
                  </h2>
                  <p className="text-xl text-gray-600">
                    Everything you need, all in one place
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { name: 'Home Services', desc: 'Cleaning, repairs, and maintenance' },
                    { name: 'Professional Services', desc: 'Legal, financial, and consulting' },
                    { name: 'Health & Beauty', desc: 'Wellness and personal care' },
                    { name: 'Education', desc: 'Tutoring and skill development' },
                    { name: 'Events', desc: 'Planning and management services' },
                    { name: 'Transport', desc: 'Moving and delivery services' }
                  ].map((service) => (
                    <Card key={service.name} className="text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{service.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What Our Users Say
                </h2>
                <p className="text-xl text-gray-600">
                  Join thousands of satisfied customers
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Sarah M.', text: 'Amazing platform! Found exactly what I was looking for.' },
                  { name: 'John K.', text: 'Great service providers and quick delivery.' },
                  { name: 'Mary W.', text: 'Love the variety of products and services available.' }
                ].map((testimonial) => (
                  <Card key={testimonial.name} className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </FrontendLayout>
    </ErrorBoundary>
  );
};

export default Index;
