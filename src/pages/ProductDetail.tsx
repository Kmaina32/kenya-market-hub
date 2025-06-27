
import React from 'react';
import { useParams } from 'react-router-dom';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <FrontendLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Product Image</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Badge className="mb-2">Electronics</Badge>
                  <h1 className="text-3xl font-bold">Product Name</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-600">(125 reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-orange-600">KSh 25,000</div>
                  <div className="text-lg text-gray-500 line-through">KSh 30,000</div>
                </div>
                
                <p className="text-gray-700">
                  Product description goes here. This is a sample product detail page.
                </p>
                
                <div className="flex gap-4">
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FrontendLayout>
  );
};

export default ProductDetail;
