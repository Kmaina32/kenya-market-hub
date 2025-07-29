
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone, ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useCartContext } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface RestaurantMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: any;
}

const RestaurantMenuModal = ({ open, onOpenChange, restaurant }: RestaurantMenuModalProps) => {
  const navigate = useNavigate();
  const { addToCart, items: cartItems, getTotalPrice } = useCartContext();
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  
  const { data: menuItems, isLoading } = useMenuItems(restaurant?.id);

  const addToCart = (item: any) => {
    const currentQuantity = localQuantities[item.id] || 0;
    const newQuantity = currentQuantity + 1;
    
    setLocalQuantities(prev => ({
      ...prev,
      [item.id]: newQuantity
    }));

    // Add to global cart context
    addToCart(item.id, 1);
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    const currentQuantity = localQuantities[itemId] || 0;
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      setLocalQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  const getItemQuantity = (itemId: string) => {
    return localQuantities[itemId] || 0;
  };

  const handleCheckout = () => {
    const hasItems = Object.values(localQuantities).some(qty => qty > 0);
    if (!hasItems) {
      toast.error('Please add items to your cart');
      return;
    }
    
    onOpenChange(false);
    navigate('/cart');
  };

  if (!restaurant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {restaurant.name}
              </DialogTitle>
              <p className="text-gray-600 mt-1">{restaurant.description}</p>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{restaurant.rating || '4.5'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.delivery_time_minutes || 30}-{(restaurant.delivery_time_minutes || 30) + 15} min</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {restaurant.is_active ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Menu</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2">Loading menu...</span>
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors bg-white">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200'} 
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <Badge variant="outline" className="text-xs mt-1">{item.category}</Badge>
                          <p className="text-lg font-bold text-orange-600 mt-2">
                            KSh {item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getItemQuantity(item.id) > 0 ? (
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => removeFromCart(item.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium min-w-[2rem] text-center">
                                {getItemQuantity(item.id)}
                              </span>
                              <Button 
                                size="sm" 
                                onClick={() => addToCart(item)}
                                className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => addToCart(item)}
                              className="bg-orange-500 hover:bg-orange-600"
                              disabled={!item.is_available}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No menu items available</p>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Order
                </h3>
                
                {Object.values(localQuantities).some(qty => qty > 0) ? (
                  <div className="space-y-3">
                    {menuItems?.filter(item => getItemQuantity(item.id) > 0).map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            KSh {item.price.toLocaleString()} x {getItemQuantity(item.id)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          KSh {(item.price * getItemQuantity(item.id)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-orange-600">
                          KSh {menuItems?.reduce((total, item) => 
                            total + (item.price * getItemQuantity(item.id)), 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 mt-4"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                    onClick={() => window.location.href = `tel:${restaurant.phone}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Restaurant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantMenuModal;
