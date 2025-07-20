
import React from 'react';
import { GetStartedButton, BrowseCategoriesButton } from '@/components/ui/client-buttons';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react'; // Import ShoppingBag icon

const HomeHeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleBrowseCategories = () => {
    navigate('/shop');
  };

  return (
    <div 
      className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl" // Modified height and gradient
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80')`, // Using shop page background image
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Removed absolute inset bg-black bg-opacity-40 as the linear-gradient handles overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
        <div className="text-center text-white max-w-3xl mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-orange-100" /> {/* Added ShoppingBag icon */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Everything You Need, <br/> All in One Place</h1> {/* Modified text size and content */}
          <p className="text-lg text-orange-100 font-light leading-relaxed">
             Shop products, book services, find rides, discover properties, and much more. Your complete marketplace solution powered by Sokko Sasa.
          </p>
          {/* Removed buttons and stats for a cleaner, shop-like hero */}
        </div>
      </div>
    </div>
  );
};

export default HomeHeroSection;
