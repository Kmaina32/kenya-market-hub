
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, MapPin, Phone, Mail } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const VendorStore = () => {
  const { vendorId } = useParams();
  const { addItem } = useCartContext();
  const { toast } = useToast();

  const { data: vendor, isLoading: vendorLoading, error: vendorError } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['vendor-products', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendorId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      in_stock: product.in_stock
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (vendorLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vendor information...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (vendorError) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600">Error loading vendor: {vendorError.message}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Vendor Header */}
        <div className="bg-white shadow-md py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vendor?.business_name || vendor?.name}</h1>
              <p className="text-gray-600">
                {vendor?.business_description || 'Providing quality products since 2024'}
              </p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm">4.5 (125 reviews)</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{vendor?.business_address || 'Nairobi, Kenya'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-1" />
                <span>{vendor?.business_phone || '+254 700 000000'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-1" />
                <span>{vendor?.business_email || 'info@vendor.com'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-orange-600">
                      KSH {Number(product.price).toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{product.rating || 0}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VendorStore;
