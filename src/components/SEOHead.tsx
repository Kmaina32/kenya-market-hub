import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HomeHeroSection from '@/components/shared/HomeHeroSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ShoppingBag, 
  Car, 
  Home, 
  Briefcase, 
  Calendar, 
  MessageCircle, 
  Shield, 
  Package, 
  Truck,
  Plane, // For flights
  Hotel, // For accommodations/Airbnbs
  Utensils // For restaurants
} from 'lucide-react'; 
import { Link } from 'react-router-dom';
import SEOManager from '@/components/seo/SEOManager'; // Assuming this is your SEOHead component
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
      title: 'Car Hire',
      description: 'Rent vehicles for self-drive or with a chauffeur',
      icon: Truck, // Using Truck for car hire, could also be a different car icon
      link: '/car-hire',
      color: 'bg-teal-50 hover:bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      title: 'Real Estate',
      description: 'Find your dream property for sale or rent',
      icon: Home,
      link: '/real-estate',
      color: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Book Flights',
      description: 'Compare and book cheap flights locally & internationally',
      icon: Plane,
      link: '/flights',
      color: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Find Accommodations',
      description: 'Discover hotels, Airbnbs, and holiday rentals',
      icon: Hotel,
      link: '/accommodations',
      color: 'bg-amber-50 hover:bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Professional Services',
      description: 'Connect with skilled professionals for any need',
      icon: Briefcase,
      link: '/services',
      color: 'bg-pink-50 hover:bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Restaurants',
      description: 'Explore and book tables at top restaurants',
      icon: Utensils,
      link: '/restaurants',
      color: 'bg-cyan-50 hover:bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Events',
      description: 'Discover and book amazing events and experiences',
      icon: Calendar,
      link: '/events',
      color: 'bg-red-50 hover:bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Community Forums',
      description: 'Join discussions, ask questions, and connect with locals',
      icon: MessageCircle,
      link: '/chat-forums',
      color: 'bg-indigo-50 hover:bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  // Schema for the homepage, reflecting a multi-service marketplace
  const homePageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Sokko Sasa",
        "url": window.location.origin,
        "logo": `${window.location.origin}/lovable-uploads/79fe9f77-6c77-4b5c-b7e0-4c0f7d6b4b4b.png`,
        "description": "Africa's Smart Marketplace for online shopping, taxi booking, real estate, car hire, flights, accommodations, professional services, events, and community discussions across Kenya.",
        "sameAs": [
          "https://www.facebook.com/sokkosasa", // Replace with actual Facebook URL
          "https://twitter.com/SokkoSasa",    // Replace with actual Twitter URL
          "https://www.linkedin.com/company/sokkosasa" // Replace with actual LinkedIn URL
        ],
        "areaServed": [
            { "@type": "AdministrativeArea", "name": "Nairobi County" },
            { "@type": "AdministrativeArea", "name": "Mombasa County" },
            { "@type": "AdministrativeArea", "name": "Kisumu County" },
            { "@type": "AdministrativeArea", "name": "Nakuru County" },
            { "@type": "AdministrativeArea", "name": "Eldoret" },
            { "@type": "AdministrativeArea", "name": "Diani" },
            { "@type": "AdministrativeArea", "name": "Malindi" },
            { "@type": "AdministrativeArea", "name": "Naivasha" }
            // Add more key counties/cities served
        ],
        "offers": { // Indicate the range of products/services offered
          "@type": "AggregateOffer",
          "highPrice": 10000000, // Example high price (e.g., for real estate)
          "lowPrice": 100, // Example low price (e.g., for small products/rides)
          "priceCurrency": "KES",
          "offerCount": "100000" // Indicative number of items/listings
        }
      },
      {
        "@type": "WebSite",
        "url": window.location.origin,
        "name": "Sokko Sasa",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <FrontendLayout>
      <SEOManager
        title="Sokko Sasa Kenya: Online Marketplace for Shopping, Rides, Car Hire, Flights, Real Estate, Accommodations, Services & Events"
        description="Sokko Sasa is Kenya's comprehensive marketplace. Shop products, book taxis, hire cars, find properties, book flights, discover Airbnbs, connect with professionals, explore restaurants, and find events across Nairobi, Mombasa, Kisumu, and all major towns in Kenya."
        keywords="Sokko Sasa, Kenya marketplace, online shopping Kenya, taxi booking Nairobi, ride hailing Kenya, car hire Kenya, rent a car Nairobi, cheap car rental Mombasa, flight booking Kenya, cheap flights Nairobi, international flights Kenya, real estate Kenya, houses for sale Nairobi, apartments for rent Mombasa, land for sale Kenya, Airbnb Kenya, holiday homes Diani, hotels Nairobi, professional services Kenya, electricians Nairobi, plumbers Mombasa, digital marketing Kenya, events Nairobi, concerts Kenya, restaurants Nairobi, best restaurants Mombasa, Kisumu dining, community forums Kenya, local businesses Kenya, buy electronics Kenya"
        url={window.location.origin}
        type="website"
        schemaData={homePageSchema} // Pass the enhanced schema for the homepage
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