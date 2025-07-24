
import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Car, MapPin, ShoppingBag, Briefcase, Calendar, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOManager from '@/components/seo/SEOManager';

const Index = () => {
  return (
    <FrontendLayout>
      <SEOManager
        title="Sokko Sasa Kenya: Online Shopping, Taxi, Real Estate & Local Services in Nairobi"
        description="Sokko Sasa is Kenya's smart marketplace. Shop online for products in Nairobi, book rides, find properties for rent/sale, hire professional services, and discover events across Kenya."
        keywords="Sokko Sasa, Kenya marketplace, online shopping Kenya, taxi booking Nairobi, ride hailing Kenya, property for sale Nairobi, apartments for rent Kilimani, professional services Kenya, events Nairobi, local businesses Kenya, buy electronics Kenya, find jobs Kenya, community forums Kenya"
        url={window.location.origin}
        type="website"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Sokko Sasa</h1>
          <p className="text-gray-600 mb-8">Your one-stop solution for rides, services, shopping, and more</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shop Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Browse and buy from thousands of products</p>
              <Link to="/shop">
                <Button>
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Rides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Book rides with ease</p>
              <Link to="/rides">
                <Button>
                  Book a Ride
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Real Estate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Find your dream property</p>
              <Link to="/real-estate">
                <Button>
                  Browse Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Connect with skilled professionals</p>
              <Link to="/services">
                <Button>
                  View Services
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Discover and book amazing events</p>
              <Link to="/events">
                <Button>
                  Explore Events
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Join discussions and forums</p>
              <Link to="/chat-forums">
                <Button>
                  Join Community
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Index;
