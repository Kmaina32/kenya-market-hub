
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useCartContext } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import HeroSection from '@/components/shared/HeroSection';

const Cart = () => {
  const { user } = useAuth();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartContext();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Image Backdrop */}
        <HeroSection
          title="Shopping Cart"
          subtitle="Review Your Items"
          description="Review your selected items and proceed to checkout."
          imageUrl="photo-1556742049-0cfed4f6a45d"
          className="mb-0 rounded-b-3xl"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-sm text-gray-600 mb-6">Start shopping to add items to your cart!</p>
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 text-sm rounded-xl"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-2 py-1 text-xs">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </Badge>
                </div>

                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow border-orange-100 rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={item.image || '/placeholder.svg'} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-600 mb-1">{item.vendor || 'Kenya Market'}</p>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-orange-600">
                              KSH {item.price.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="h-6 w-6 p-0 border-orange-200 text-orange-600 hover:bg-orange-50"
                              >
                                <Minus className="h-2 w-2" />
                              </Button>
                              <span className="w-6 text-center font-medium text-xs">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 p-0 border-orange-200 text-orange-600 hover:bg-orange-50"
                              >
                                <Plus className="h-2 w-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 mb-1">
                            KSH {(item.price * item.quantity).toLocaleString()}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 border-orange-200 rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                      <span className="font-medium">KSH {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span className="text-orange-600">KSH {getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 text-sm rounded-xl"
                      size="sm"
                    >
                      Proceed to Checkout
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/shop')}
                      className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 text-sm rounded-xl"
                      size="sm"
                    >
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
