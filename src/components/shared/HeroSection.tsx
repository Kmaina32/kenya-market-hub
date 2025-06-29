
import React from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  className,
  children
}) => {
  // Use a working Unsplash image URL with proper format
  const backgroundImage = imageUrl 
    ? `https://images.unsplash.com/${imageUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`
    : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <div 
      className={cn(
        "relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-b-3xl mx-4 sm:mx-6 lg:mx-8 mt-4",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-b-3xl" />
      <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
        <div className="text-center text-white max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h1>
          {subtitle && (
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-orange-100">
              {subtitle}
            </h2>
          )}
          {description && (
            <p className="text-lg text-orange-100 mb-6">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
