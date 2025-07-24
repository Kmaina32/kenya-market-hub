
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Car, Home as HomeIcon, Briefcase } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-xl mb-8">Your one-stop destination for shopping, rides, real estate, and more</p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Shopping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Browse and buy products from local vendors</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Car className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Book rides and transportation services</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <HomeIcon className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Real Estate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Find properties and real estate opportunities</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Briefcase className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <CardTitle>Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Discover job opportunities and career paths</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of users who trust our platform</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
