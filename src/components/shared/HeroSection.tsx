
import React from 'react';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { Search, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  imageUrl = 'photo-1649972904349-6e44c42644a7',
  primaryAction,
  secondaryAction,
  searchPlaceholder,
  onSearch,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className={`relative h-96 bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`https://images.unsplash.com/${imageUrl}?w=1200&h=400&fit=crop`}
          alt="Hero background"
          className="w-full h-full object-cover opacity-20"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=400&fit=crop';
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {subtitle && (
              <p className="text-orange-200 text-lg font-medium mb-2">{subtitle}</p>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              {description}
            </p>

            {/* Search Bar */}
            {searchPlaceholder && (
              <div className="flex gap-2 mb-6 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-orange-300 transition-all"
                  />
                </div>
                <UnifiedButton
                  variant="secondary"
                  onClick={handleSearch}
                  icon={<Search className="h-4 w-4" />}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white text-orange-600"
                >
                  Search
                </UnifiedButton>
              </div>
            )}

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {primaryAction && (
                  <UnifiedButton
                    size="lg"
                    onClick={primaryAction.onClick}
                    icon={primaryAction.icon || <ArrowRight className="h-5 w-5" />}
                    className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
                  >
                    {primaryAction.text}
                  </UnifiedButton>
                )}
                {secondaryAction && (
                  <UnifiedButton
                    variant="outline"
                    size="lg"
                    onClick={secondaryAction.onClick}
                    icon={secondaryAction.icon}
                    className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    {secondaryAction.text}
                  </UnifiedButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
