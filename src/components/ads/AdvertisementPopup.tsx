import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, MapPin, Star, ShoppingCart, Phone } from 'lucide-react';
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
  contact?: string;
}

interface AdvertisementPopupProps {
  isEnabled?: boolean;
  intervalMinutes?: number;
}

const AdvertisementPopup: React.FC<AdvertisementPopupProps> = ({ 
  isEnabled = true, 
  intervalMinutes = 5 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [lastShown, setLastShown] = useState<number>(0);

  useEffect(() => {
    if (!isEnabled) return;

    const checkAndShowAd = () => {
      const now = Date.now();
      const timeSinceLastShown = now - lastShown;
      const intervalMs = intervalMinutes * 60 * 1000;

      if (timeSinceLastShown >= intervalMs) {
        fetchAndShowAd();
        setLastShown(now);
      }
    };

    // Initial check after 30 seconds
    const initialTimeout = setTimeout(checkAndShowAd, 30000);
    
    // Regular interval check
    const interval = setInterval(checkAndShowAd, 60000); // Check every minute

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isEnabled, intervalMinutes, lastShown]);

  const fetchAndShowAd = async () => {
    try {
      // Randomly choose ad type
      const adTypes = ['product', 'service'];
      const randomType = adTypes[Math.floor(Math.random() * adTypes.length)];

      let ad: Advertisement | null = null;

      if (randomType === 'product') {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (products && products.length > 0) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          ad = {
            id: randomProduct.id,
            type: 'product',
            title: randomProduct.name,
            description: randomProduct.description || 'Quality product available now',
            price: randomProduct.price,
            image_url: randomProduct.image_url,
            location: randomProduct.location,
            vendor: randomProduct.vendor,
            category: randomProduct.category
          };
        }
      } else if (randomType === 'service') {
        const { data: services } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(10);

        if (services && services.length > 0) {
          const randomService = services[Math.floor(Math.random() * services.length)];
          ad = {
            id: randomService.id.toString(),
            type: 'service',
            title: randomService.title,
            description: randomService.description,
            location: randomService.location,
            category: randomService.category,
            contact: randomService.company
          };
        }
      }

      if (ad) {
        setCurrentAd(ad);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching advertisement:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'from-orange-500 to-red-600';
      case 'property': return 'from-blue-500 to-cyan-600';
      case 'service': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getActionButton = () => {
    switch (currentAd?.type) {
      case 'product':
        return (
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Product
          </Button>
        );
      case 'service':
        return (
          <Button className="flex-1 bg-green-500 hover:bg-green-600">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
        );
      default:
        return (
          <Button className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        );
    }
  };

  if (!isOpen || !currentAd) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md w-[90vw] p-0 rounded-2xl overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${getAdTypeColor(currentAd.type)} p-6 text-white`}>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {currentAd.type.toUpperCase()}
              </Badge>
              {currentAd.category && (
                <Badge variant="outline" className="border-white/30 text-white">
                  {currentAd.category}
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-bold mb-1">{currentAd.title}</h2>
            {currentAd.vendor && (
              <p className="text-sm opacity-90">by {currentAd.vendor}</p>
            )}
          </div>

          {/* Image */}
          {currentAd.image_url && (
            <div className="aspect-video bg-gray-100">
              <LazyImage 
                src={currentAd.image_url} 
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700 leading-relaxed">{currentAd.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {currentAd.price && (
                  <p className="text-2xl font-bold text-orange-600">
                    KSh {currentAd.price.toLocaleString()}
                  </p>
                )}
                {currentAd.location && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentAd.location}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              {getActionButton()}
              <Button variant="outline" onClick={handleClose}>
                Maybe Later
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center pt-2 border-t">
              Advertisement • Promoted content
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementPopup;