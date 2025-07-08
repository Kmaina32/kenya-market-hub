
import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ServiceShowcase from '@/components/sections/ServiceShowcase';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { ErrorBoundary } from '@/components/enhanced/ErrorBoundary';

const Index = () => {
  return (
    <ErrorBoundary>
      <FrontendLayout>
        <div className="animate-fade-in">
          <HeroSection />
          <div className="space-y-16 py-8">
            <FeaturedCategories />
            <FeaturedProducts />
            <ServiceShowcase />
            <TestimonialsSection />
          </div>
        </div>
      </FrontendLayout>
    </ErrorBoundary>
  );
};

export default Index;
