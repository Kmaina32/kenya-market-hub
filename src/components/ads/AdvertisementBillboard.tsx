
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Star, Eye, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import LazyImage from '@/components/LazyImage';

interface Advertisement {
  id: string;
  type: 'product' | 'property' | 'service';
  title: string;
  description: string;
  price?: number;
  image_url?: string;
  location?: string;
  rating?: number;
  vendor?: string;
  category?: string;
}

interface AdvertisementBillboardProps {
  className?: string;
  layout?: 'horizontal' | 'vertical';
  showCategories?: string[];
  maxItems?: number;
}

const AdvertisementBillboard: React.FC<AdvertisementBillboardProps> = ({ 
  className = "",
  layout = 'horizontal',
  showCategories = ['product', 'service', 'property'],
  maxItems = 20
}) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const shuffleArray = (array: Advertisement[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchAdvertisements = async () => {
    setIsLoading(true);
    try {
      const advertisements: Advertisement[] = [];

      // Fetch products if included
      if (showCategories.includes('product')) {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('created_at', { ascending: false })
          .limit(Math.ceil(maxItems * 0.6));

        if (products) {
          products.forEach(product => {
            advertisements.push({
              id: product.id,
              type: 'product',
              title: product.name,
              description: product.description || 'Quality product available now',
              price: product.price,
              image_url: product.image_url,
              location: product.location,
              vendor: product.vendor,
              category: product.category
            });
          });
        }
      }

      // Fetch services if included
      if (showCategories.includes('service')) {
        const { data: services } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(Math.ceil(maxItems * 0.3));

        if (services) {
          services.forEach(service => {
            advertisements.push({
              id: service.id.toString(),
              type: 'service',
              title: service.title,
              description: service.description,
              location: service.location,
              category: service.category
            });
          });
        }
      }

      // Fetch properties if included
      if (showCategories.includes('property')) {
        const { data: properties } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false })
          .limit(Math.ceil(maxItems * 0.1));

        if (properties) {
          properties.forEach(property => {
            let imageUrl: string | undefined;
            if (property.images && Array.isArray(property.images) && property.images.length > 0) {
              imageUrl = property.images[0] as string;
            }

            advertisements.push({
              id: property.id,
              type: 'property',
              title: property.title,
              description: property.description || 'Premium property available',
              price: property.price,
              image_url: imageUrl,
              location: property.location_address,
              category: property.property_type
            });
          });
        }
      }

      const shuffledAds = shuffleArray(advertisements);
      setAds(shuffledAds.slice(0, maxItems));
    } catch (error) {
      console.error('Error fetching billboard advertisements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, [JSON.stringify(showCategories), maxItems]);

  useEffect(() => {
    if (ads.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [ads]);

  const refreshAds = () => {
    fetchAdvertisements();
  };

  const handleExploreNow = () => {
    const currentAd = ads[currentIndex];
    if (currentAd) {
      switch (currentAd.type) {
        case 'product':
          navigate('/products');
          break;
        case 'property':
          navigate('/properties');
          break;
        case 'service':
          navigate('/jobs');
          break;
        default:
          navigate('/');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading advertisements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No advertisements available</p>
            <Button onClick={refreshAds} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentIndex];

  const getAdTypeGradient = (type: string) => {
    switch (type) {
      case 'product': return 'from-orange-500/90 to-red-600/90';
      case 'property': return 'from-blue-500/90 to-cyan-600/90';
      case 'service': return 'from-green-500/90 to-emerald-600/90';
      default: return 'from-gray-500/90 to-gray-600/90';
    }
  };

  const getAdTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return '🛍️';
      case 'property': return '🏠';
      case 'service': return '💼';
      default: return '📦';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Background Image */}
        {currentAd.image_url && (
          <div className="absolute inset-0">
            <LazyImage 
              src={currentAd.image_url} 
              alt={currentAd.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getAdTypeGradient(currentAd.type)}`} />

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-12 text-white">
          <div className={`${layout === 'horizontal' ? 'flex flex-col lg:flex-row items-center justify-between' : 'space-y-6'}`}>
            <div className={`${layout === 'horizontal' ? 'flex-1 pr-0 lg:pr-8' : ''}`}>
              {/* Header */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  {getAdTypeIcon(currentAd.type)} {currentAd.type.toUpperCase()}
                </Badge>
                {currentAd.category && (
                  <Badge variant="outline" className="border-white/30 text-white text-xs">
                    {currentAd.category}
                  </Badge>
                )}
              </div>

              {/* Title and Description */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 leading-tight line-clamp-2">
                {currentAd.title.length > 60 ? `${currentAd.title.substring(0, 60)}...` : currentAd.title}
              </h2>
              
              {currentAd.vendor && (
                <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-2 line-clamp-1">by {currentAd.vendor}</p>
              )}
              
              <p className="text-sm sm:text-base lg:text-lg opacity-95 mb-4 sm:mb-6 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
                {currentAd.description?.length > 120 ? 
                  `${currentAd.description.substring(0, 120)}...` : 
                  currentAd.description
                }
              </p>

              {/* Details */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                {currentAd.price && (
                  <div className="text-2xl lg:text-3xl font-bold">
                    KSh {currentAd.price.toLocaleString()}
                  </div>
                )}
                
                {currentAd.location && (
                  <div className="flex items-center text-lg opacity-90">
                    <MapPin className="h-5 w-5 mr-2" />
                    {currentAd.location}
                  </div>
                )}

                {currentAd.rating && (
                  <div className="flex items-center text-lg">
                    <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                    {currentAd.rating}
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg"
                  onClick={handleExploreNow}
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg group"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Explore Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-6 py-3 text-lg"
                  onClick={refreshAds}
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  More Ads
                </Button>
              </div>
            </div>

            {/* Image (visible on all screen sizes in horizontal layout) */}
            {layout === 'horizontal' && currentAd.image_url && (
              <div className="flex-shrink-0 w-full lg:w-80 h-48 lg:h-64 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm mt-4 lg:mt-0">
                <LazyImage 
                  src={currentAd.image_url} 
                  alt={currentAd.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicators */}
        {ads.length > 1 && (
          <div className="absolute bottom-4 left-8 flex space-x-2">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementBillboard;
