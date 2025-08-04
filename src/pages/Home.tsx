
import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, MapPin, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/60" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Car className="h-20 w-20 mx-auto mb-6 text-orange-100" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Sokko Sasa
              </h1>
              <p className="text-xl text-orange-100 font-light leading-relaxed mb-8">
                Your reliable ride-hailing service across Kenya
              </p>
              <Link to="/rides">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg font-semibold rounded-xl">
                  Book a Ride Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Sokko Sasa?</h2>
            <p className="text-lg text-gray-600">Safe, reliable, and affordable transportation at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Car className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>Multiple Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from taxis, cars, and motorbikes to suit your needs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your driver's location and get accurate ETAs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>Safe & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All drivers are verified and background-checked
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>24/7 Available</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Book rides anytime, anywhere across Kenya
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Home;
