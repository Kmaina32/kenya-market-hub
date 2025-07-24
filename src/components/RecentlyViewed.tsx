
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useAuth } from '@/contexts/AuthContext';

const RecentlyViewed = () => {
  const { user } = useAuth();
  const { data: recentlyViewed, isLoading } = useRecentlyViewed();

  if (!user || isLoading || !recentlyViewed?.length) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Recently Viewed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentlyViewed.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                <img
                  src={item.product?.image_url || '/placeholder.svg'}
                  alt={item.product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-sm font-medium truncate">{item.product?.name}</p>
              <p className="text-sm text-green-600 font-semibold">
                KSH {Number(item.product?.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentlyViewed;
