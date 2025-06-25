
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
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white mt-4 mx-4 sm:mx-6 lg:mx-8 rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Everything You Need,
            <br />
            <span className="text-yellow-200">All in One Place</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
            Shop products, book services, find rides, discover properties, and much more. 
            Your complete marketplace solution.
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
