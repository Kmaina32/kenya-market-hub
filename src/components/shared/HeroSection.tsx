
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: LucideIcon;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle, 
  description, 
  icon: Icon, 
  backgroundImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80' 
}) => {
  return (
    <div 
      className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
        <div className="text-center text-white max-w-3xl mx-auto">
          <Icon className="h-16 w-16 mx-auto mb-4 text-orange-100 drop-shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">{title}</h1>
          {subtitle && (
            <p className="text-lg text-orange-100 font-light leading-relaxed">
              {subtitle}
              {description && <span className="block">{description}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
