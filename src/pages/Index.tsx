
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/shared/HeroSection';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { 
  ShoppingBag, 
  Car, 
  Home as HomeIcon, 
  Wrench, 
  Stethoscope, 
  Calendar,
  TrendingUp,
  Star,
  Users
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const mainServices = [
    {
      id: 'shop',
      title: 'Marketplace',
      description: 'Browse thousands of products from verified vendors',
      icon: ShoppingBag,
      path: '/shop',
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      stats: '10,000+ Products',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      id: 'rides',
      title: 'Ride Hailing',
      description: 'Book safe and reliable rides with verified drivers',
      icon: Car,
      path: '/rides',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      stats: '500+ Drivers',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
    },
    {
      id: 'real-estate',
      title: 'Real Estate',
      description: 'Find your dream home or investment property',
      icon: HomeIcon,
      path: '/real-estate',
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      stats: '2,000+ Properties',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'
    },
    {
      id: 'services',
      title: 'Professional Services',
      description: 'Connect with skilled professionals for any task',
      icon: Wrench,
      path: '/services',
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      stats: '1,000+ Providers',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'
    },
    {
      id: 'medical',
      title: 'Healthcare',
      description: 'Access quality healthcare services and consultations',
      icon: Stethoscope,
      path: '/medical',
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      stats: '200+ Providers',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      id: 'events',
      title: 'Events & Community',
      description: 'Discover local events and community activities',
      icon: Calendar,
      path: '/events',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      stats: '50+ Events',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Growing Marketplace',
      description: 'Join thousands of users in Kenya\'s fastest-growing digital marketplace'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'All vendors and service providers are verified for your safety'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by Kenyans, for Kenyans - supporting local businesses'
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Kenya's Digital Marketplace"
          subtitle="Welcome to TukoPlace"
          description="Your one-stop platform for shopping, services, rides, real estate, and healthcare. Connecting Kenyan communities with trusted local businesses."
          imageUrl="photo-1559757148-5c350d0d3c56"
          primaryAction={{
            text: 'Explore Marketplace',
            onClick: () => navigate('/shop'),
          }}
          secondaryAction={{
            text: 'Join as Provider',
            onClick: () => navigate('/service-provider-hub'),
          }}
          searchPlaceholder="Search for products, services, or properties..."
          onSearch={(query) => navigate(`/shop?search=${encodeURIComponent(query)}`)}
        />

        {/* Main Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From daily essentials to professional services, we've got you covered with trusted local providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service) => (
              <UnifiedCard
                key={service.id}
                title={service.title}
                description={service.description}
                imageUrl={service.image}
                badge={service.stats}
                onClick={() => navigate(service.path)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                actions={
                  <UnifiedButton
                    size="sm"
                    className={`w-full ${service.color} text-white hover:opacity-90`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.path);
                    }}
                  >
                    <service.icon className="h-4 w-4 mr-2" />
                    Explore {service.title}
                  </UnifiedButton>
                }
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose TukoPlace?
              </h2>
              <p className="text-xl text-gray-600">
                Built with Kenyan values and modern technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join thousands of Kenyans who trust TukoPlace for their daily needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <UnifiedButton
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
                onClick={() => navigate('/shop')}
              >
                Start Shopping
              </UnifiedButton>
              <UnifiedButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/service-provider-hub')}
              >
                Become a Provider
              </UnifiedButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
