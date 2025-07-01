
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UnifiedCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  price?: string | number;
  originalPrice?: string | number;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  rating?: number;
  reviews?: number;
  location?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  actions?: React.ReactNode;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  price,
  originalPrice,
  badge,
  badgeVariant = 'default',
  rating,
  reviews,
  location,
  className,
  children,
  onClick,
  actions
}) => {
  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return `KSh ${price.toLocaleString()}`;
    }
    return price;
  };

  return (
    <Card 
      className={cn(
        'hover:shadow-lg transition-all duration-300 cursor-pointer border-orange-100 bg-white',
        onClick && 'hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop';
            }}
          />
          {badge && (
            <Badge 
              variant={badgeVariant}
              className="absolute top-2 right-2 bg-orange-500 text-white"
            >
              {badge}
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="pb-2">
        {title && (
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </CardTitle>
        )}
        {subtitle && (
          <p className="text-sm text-orange-600 font-medium">{subtitle}</p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}

        {(rating || reviews) && (
          <div className="flex items-center gap-2 mb-3">
            {rating && (
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium ml-1">{rating}</span>
              </div>
            )}
            {reviews && (
              <span className="text-sm text-gray-500">({reviews} reviews)</span>
            )}
          </div>
        )}

        {location && (
          <p className="text-sm text-gray-500 mb-3 flex items-center">
            <span className="mr-1">📍</span>
            {location}
          </p>
        )}

        {(price || originalPrice) && (
          <div className="flex items-center gap-2 mb-3">
            {price && (
              <span className="text-lg font-bold text-green-600">
                {formatPrice(price)}
              </span>
            )}
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        )}

        {children}

        {actions && (
          <div className="flex gap-2 mt-4">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
