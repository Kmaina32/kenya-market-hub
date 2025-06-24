
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone, ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface RestaurantMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: any;
}

const RestaurantMenuModal = ({ open, onOpenChange, restaurant }: RestaurantMenuModalProps) => {
  const [cart, setCart] = useState<any[]>([]);

  // Mock menu items
  const menuItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, and basil',
      price: 1200,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200'
    },
    {
      id: 2,
      name: 'Chicken Tikka',
      description: 'Grilled chicken with spices and yogurt marinade',
      price: 1500,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200'
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Fresh lettuce with Caesar dressing and croutons',
      price: 800,
      category: 'Salads',
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=200'
    }
  ];

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: number) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrder = () => {
    if (cart.length === 0) {
      toast.error('Please add items to your cart');
      return;
    }
    toast.success(`Order placed for KSh ${getCartTotal().toLocaleString()}`);
    setCart([]);
    onOpenChange(false);
  };

  if (!restaurant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {restaurant.business_name}
              </DialogTitle>
              <p className="text-gray-600 mt-1">{restaurant.business_description}</p>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>4.5</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>25-35 min</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.business_address}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Open</Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Menu</h3>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors bg-white">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {cart.find(cartItem => cartItem.id === item.id) ? (
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
                              {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
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
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Order
                </h3>
                
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            KSh {item.price.toLocaleString()} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">
                          KSh {getCartTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleOrder}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 mt-4"
                    >
                      Place Order
                    </Button>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 bg-white"
                    onClick={() => window.location.href = `tel:${restaurant.business_phone}`}
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
