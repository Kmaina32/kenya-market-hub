
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useAuth } from '@/contexts/AuthContext';
import LazyImage from '@/components/LazyImage';

const RecentlyViewed = () => {
  const { user } = useAuth();
  const { data: recentlyViewed, isLoading, error } = useRecentlyViewed();

  console.log('Recently viewed data:', recentlyViewed);
  console.log('Recently viewed loading:', isLoading);
  console.log('Recently viewed error:', error);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recently Viewed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-gray-200 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Recently viewed error:', error);
    return null;
  }

  if (!recentlyViewed?.length) {
    return null;
  }

  // Filter out items where the product might have been deleted
  const validItems = recentlyViewed.filter(item => item.products);

  if (!validItems.length) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Recently Viewed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {validItems.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                <LazyImage
                  src={item.products?.image_url || '/placeholder.svg'}
                  alt={item.products?.name || 'Product'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-sm font-medium truncate">{item.products?.name}</p>
              <p className="text-sm text-green-600 font-semibold">
                KSH {Number(item.products?.price || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{item.products?.vendor}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentlyViewed;
