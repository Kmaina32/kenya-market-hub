import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShoppingBag, UtensilsCrossed, Calendar, Briefcase, Car, Shield, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Ad {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  cta: string;
  featured: boolean;
  discount?: string;
  validUntil?: string;
  location?: string;
}

const AdvertisementBillboard: React.FC = () => {
  const navigate = useNavigate();

  const handleExploreNow = (category: string) => {
    switch (category) {
      case 'Food & Delivery':
        navigate('/food-delivery');
        break;
      case 'Events':
        navigate('/events');
        break;
      case 'Jobs':
        navigate('/jobs');
        break;
      case 'Transport':
        navigate('/transport');
        break;
      case 'Insurance':
        navigate('/insurance');
        break;
      case 'Services':
        navigate('/services');
        break;
      case 'Real Estate':
        navigate('/real-estate');
        break;
      case 'Products':
      case 'Shopping':
      default:
        navigate('/shop'); // Changed from '/products' to '/shop'
        break;
    }
  };

  const ads: Ad[] = [
    {
      id: 1,
      title: 'Shop Local Products',
      description: 'Discover unique items from Kenyan vendors.',
      imageUrl: 'https://images.unsplash.com/photo-1523381294911-8cdfc3fe1725?w=400&h=300&fit=crop',
      category: 'Shopping',
      cta: 'Explore Now',
      featured: true,
      discount: '20% off',
      validUntil: '2023-12-31'
    },
    {
      id: 2,
      title: 'Order Delicious Food',
      description: 'Get meals delivered from top restaurants in your area.',
      imageUrl: 'https://images.unsplash.com/photo-1555071515-6c64a944fa01?w=400&h=300&fit=crop',
      category: 'Food & Delivery',
      cta: 'Order Now',
      featured: false
    },
    {
      id: 3,
      title: 'Find Exciting Events',
      description: 'Explore concerts, workshops, and more happening nearby.',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c89ef43525ea?w=400&h=300&fit=crop',
      category: 'Events',
      cta: 'Find Events',
      featured: false
    },
    {
      id: 4,
      title: 'Job Opportunities Await',
      description: 'Connect with leading companies and find your dream job.',
      imageUrl: 'https://images.unsplash.com/photo-1584438478924-39e49d3b589a?w=400&h=300&fit=crop',
      category: 'Jobs',
      cta: 'Apply Today',
      featured: false
    },
    {
      id: 5,
      title: 'Reliable Transport Services',
      description: 'Book rides and deliveries with trusted providers.',
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8e6518ba949f?w=400&h=300&fit=crop',
      category: 'Transport',
      cta: 'Book Now',
      featured: false
    },
    {
      id: 6,
      title: 'Secure Your Future',
      description: 'Get comprehensive insurance plans for your peace of mind.',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560bc30?w=400&h=300&fit=crop',
      category: 'Insurance',
      cta: 'Get a Quote',
      featured: false
    },
    {
      id: 7,
      title: 'Professional Services',
      description: 'Hire skilled professionals for all your needs.',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14e3239570ca?w=400&h=300&fit=crop',
      category: 'Services',
      cta: 'Find Services',
      featured: false
    },
    {
      id: 8,
      title: 'Find Your Dream Home',
      description: 'Explore properties for sale and rent in prime locations.',
      imageUrl: 'https://images.unsplash.com/photo-1560518838-efd7efbde265?w=400&h=300&fit=crop',
      category: 'Real Estate',
      cta: 'View Listings',
      featured: false
    }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Deals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of products, services, and experiences from trusted local businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ads.map((ad) => (
            <Card key={ad.id} className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-300 bg-white rounded-2xl overflow-hidden ${ad.featured ? 'ring-2 ring-orange-400' : ''}`}>
              <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                {ad.featured && (
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    Featured
                  </Badge>
                )}
                {ad.discount && (
                  <Badge className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    {ad.discount}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {ad.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {ad.description}
                </p>
                <div className="flex items-center justify-between">
                  <Button size="sm" onClick={() => handleExploreNow(ad.category)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md">
                    {ad.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {ad.validUntil && (
                    <span className="text-xs text-gray-500">
                      Valid until {new Date(ad.validUntil).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementBillboard;
