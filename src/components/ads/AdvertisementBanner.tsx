import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, MapPin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

interface AdvertisementBannerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({ 
  className = "", 
  size = 'medium' 
}) => {
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Change ad every 5 seconds

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  useEffect(() => {
    if (ads.length > 0) {
      setCurrentAd(ads[currentIndex]);
    }
  }, [currentIndex, ads]);

  const fetchAdvertisements = async () => {
    try {
      // Fetch latest products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch services (using jobs table)
      const { data: services } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(2);

      const advertisements: Advertisement[] = [];

      // Convert products to advertisements
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

      // Convert services to advertisements
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

      setAds(advertisements);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  if (!isVisible || !currentAd) return null;

  const sizeClasses = {
    small: 'h-24 text-sm',
    medium: 'h-32 text-base',
    large: 'h-40 text-lg'
  };

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-gradient-to-r from-orange-500 to-red-600';
      case 'property': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'service': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className={`${getAdTypeColor(currentAd.type)} rounded-lg p-4 text-white relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-10 text-white hover:bg-white/20 rounded-full p-1 h-6 w-6"
        >
          <X className="h-3 w-3" />
        </Button>

        <div className="flex items-center space-x-4 h-full">
          {currentAd.image_url && (
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white/10">
              <LazyImage 
                src={currentAd.image_url} 
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                {currentAd.type.toUpperCase()}
              </Badge>
              {currentAd.category && (
                <Badge variant="outline" className="border-white/30 text-white text-xs">
                  {currentAd.category}
                </Badge>
              )}
            </div>
            
            <h3 className="font-semibold truncate mb-1">{currentAd.title}</h3>
            <p className="text-sm opacity-90 line-clamp-2">{currentAd.description}</p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-3 text-sm">
                {currentAd.price && (
                  <span className="font-medium">KSh {currentAd.price.toLocaleString()}</span>
                )}
                {currentAd.location && (
                  <span className="flex items-center opacity-90">
                    <MapPin className="h-3 w-3 mr-1" />
                    {currentAd.location}
                  </span>
                )}
              </div>
              
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs px-3 py-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-5000 ease-linear"
            style={{ width: `${((currentIndex + 1) / ads.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvertisementBanner;