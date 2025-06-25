
import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  ctaText,
  onCtaClick,
  className = ''
}) => {
  return (
    <div className={`relative h-80 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-b-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 rounded-b-3xl"
        style={{ backgroundImage: `url(https://images.unsplash.com/${imageUrl})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-b-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-8 sm:px-12 lg:px-16">
        <div className="text-center text-white max-w-3xl mx-auto">
          {subtitle && (
            <p className="text-orange-200 text-sm font-medium mb-2">
              {subtitle}
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base md:text-lg text-orange-100 mb-6 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {ctaText && onCtaClick && (
            <button
              onClick={onCtaClick}
              className="inline-block bg-white text-orange-600 font-semibold py-3 px-8 rounded-xl hover:bg-orange-50 transition-colors duration-200 shadow-lg text-sm"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
