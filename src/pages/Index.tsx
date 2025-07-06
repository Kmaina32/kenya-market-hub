
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Building, 
  Car, 
  Wrench, 
  Stethoscope, 
  Shield, 
  UtensilsCrossed, 
  Calendar, 
  Briefcase, 
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useHomeStats } from '@/hooks/useHomeStats';
import LoadingSpinner from '@/components/LoadingSpinner';

const Index = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useHomeStats();

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const heroSlides = [
    {
      id: 1,
      title: "Kenya's Complete Digital Marketplace",
      subtitle: "Everything you need in one place",
      description: "From shopping to services, we connect you to the best Kenya has to offer",
      image: "photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Start Shopping",
      ctaAction: () => navigate('/shop')
    },
    {
      id: 2,
      title: "Find Your Dream Property",
      subtitle: "Real Estate Made Simple",
      description: "Discover homes and commercial properties across Kenya's prime locations",
      image: "photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Browse Properties",
      ctaAction: () => navigate('/real-estate')
    },
    {
      id: 3,
      title: "Professional Services at Your Fingertips",
      subtitle: "Trusted Service Providers",
      description: "Connect with verified professionals for all your service needs",
      image: "photo-1473091534298-04dcbce3278c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Book Services",
      ctaAction: () => navigate('/services')
    },
    {
      id: 4,
      title: "Ride & Delivery Solutions",
      subtitle: "Get Moving with Ease",
      description: "Safe, reliable transportation and delivery services across Kenya",
      image: "photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Book a Ride",
      ctaAction: () => navigate('/rides')
    },
    {
      id: 5,
      title: "Join Our Growing Community",
      subtitle: "Become a Partner",
      description: "Grow your business with thousands of customers across Kenya",
      image: "photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Become a Partner",
      ctaAction: () => navigate('/service-hub')
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = heroSlides[currentSlide];

  const miniApps = [
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Buy and sell products online',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-500',
      route: '/shop',
      image: 'photo-1649972904349-6e44c42644a7',
      stats: `${stats?.products || 0}+ Products`
    },
    {
      id: 'real-estate',
      title: 'Real Estate',
      description: 'Find your dream home or property',
      icon: Building,
      color: 'from-orange-500 to-red-500',
      route: '/real-estate',
      image: 'photo-1483058712412-4245e9b90334',
      stats: `${stats?.properties || 0}+ Properties`
    },
    {
      id: 'transportation',
      title: 'Transportation',
      description: 'Book rides and delivery services',
      icon: Car,
      color: 'from-orange-500 to-red-500',
      route: '/rides',
      image: 'photo-1487887235947-a955ef187fcc',
      stats: `${stats?.rides || 0}+ Rides`
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Book professional services and experts',
      icon: Wrench,
      color: 'from-orange-500 to-red-500',
      route: '/services',
      image: 'photo-1473091534298-04dcbce3278c',
      stats: `${stats?.vendors || 0}+ Providers`
    },
    {
      id: 'medical',
      title: 'Medical',
      description: 'Access health services and appointments',
      icon: Stethoscope,
      color: 'from-orange-500 to-red-500',
      route: '/medical',
      image: 'photo-1581090464777-f3220bbe1b8b',
      stats: '0+ Doctors'
    },
    {
      id: 'insurance',
      title: 'Insurance',
      description: 'Compare and subscribe to insurance plans',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      route: '/insurance',
      image: 'photo-1524230572899-a752b3835840',
      stats: '0+ Plans'
    },
    {
      id: 'food',
      title: 'Food Delivery',
      description: 'Order from restaurants',
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-red-500',
      route: '/food',
      image: 'photo-1721322800607-8c38375eef04',
      stats: `${stats?.vendors || 0}+ Restaurants`
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Book and discover events',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      route: '/events',
      image: 'photo-1605810230434-7631ac76ec81',
      stats: '0+ Events'
    },
    {
      id: 'jobs',
      title: 'Job Board',
      description: 'Apply for jobs and hire talent',
      icon: Briefcase,
      color: 'from-orange-500 to-red-500',
      route: '/jobs',
      image: 'photo-1486312338219-ce68d2c6f44d',
      stats: '0+ Jobs'
    },
    {
      id: 'chat',
      title: 'Chat & Forums',
      description: 'Chat privately or post in community groups',
      icon: MessageCircle,
      color: 'from-orange-500 to-red-500',
      route: '/chat-forums',
      image: 'photo-1460925895917-afdab827c52f',
      stats: `${stats?.users || 0}+ Members`
    }
  ];

  if (statsLoading) {
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Slideshow - Added proper padding */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8 rounded-3xl">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out rounded-3xl"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/${currentSlideData.image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent rounded-3xl" />
          
          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          {/* Hero Content */}
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-4xl mx-auto">
              {/* Brand Name - Fixed size and normal weight */}
              <h1 className="text-3xl md:text-7xl font-normal mb-4 animate-fade-in drop-shadow-lg">
                <span className="text-white">Sokko</span>{' '}
                <span className="text-orange-500">Sasa</span>
              </h1>

              {/* Slide Content */}
              <div className="animate-fade-in" key={currentSlide}>
                <p className="text-orange-200 text-sm font-medium mb-2">
                  {currentSlideData.subtitle}
                </p>
                <h2 className="text-xl md:text-3xl font-bold mb-3">
                  {currentSlideData.title}
                </h2>
                <p className="text-base md:text-lg text-orange-100 mb-6 max-w-3xl mx-auto">
                  {currentSlideData.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button
                    size="sm"
                    onClick={currentSlideData.ctaAction}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 text-sm rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {currentSlideData.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/service-hub')}
                    className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-6 py-2 text-sm rounded-xl backdrop-blur-sm bg-white/10"
                  >
                    Become a Partner
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Mini Apps Grid */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All Services in One Platform
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              From shopping to services, we've got everything you need to live, work, and thrive in Kenya
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {miniApps.map((app) => (
              <Card 
                key={app.id} 
                className="group hover:shadow-lg transition-all duration-300 border hover:border-orange-200 cursor-pointer rounded-2xl overflow-hidden transform hover:scale-105"
                onClick={() => navigate(app.route)}
              >
                <div className="relative overflow-hidden aspect-square">
                  <div 
                    className="h-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(https://images.unsplash.com/${app.image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-gray-800 text-xs rounded-lg">
                      {app.stats}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${app.color} text-white`}>
                      <app.icon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm group-hover:text-orange-600 transition-colors">
                    {app.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="sm"
                    className={`w-full bg-gradient-to-r ${app.color} hover:opacity-90 text-white text-xs rounded-xl`}
                  >
                    Explore
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </FrontendLayout>
  );
};

export default Index;
