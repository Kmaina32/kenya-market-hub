
import React from 'react';
import { GetStartedButton, BrowseCategoriesButton } from '@/components/ui/client-buttons';
import { useNavigate } from 'react-router-dom';

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
      className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white mt-4 mx-4 sm:mx-6 lg:mx-8 rounded-b-3xl overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-b-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">{/* Changed py-16 to py-12 */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Everything You Need,
            <br />
            <span className="text-yellow-200">All in One Place</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-orange-100 max-w-3xl mx-auto">
            Shop products, book services, find rides, discover properties, and much more. 
            Your complete marketplace solution powered by Sokko Sasa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <GetStartedButton onClick={handleGetStarted}>
              Get Started Today
            </GetStartedButton>
            <BrowseCategoriesButton onClick={handleBrowseCategories}>
              Browse Categories
            </BrowseCategoriesButton>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-orange-200">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-orange-200">Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1K+</div>
              <div className="text-orange-200">Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-orange-200">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeroSection;
