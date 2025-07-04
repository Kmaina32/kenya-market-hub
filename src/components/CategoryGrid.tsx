
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Car, Home, Utensils, Heart, Briefcase, Smartphone, Shirt } from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    { name: 'Shopping', icon: ShoppingBag, color: 'from-blue-500 to-blue-600', href: '/shop' },
    { name: 'Rides', icon: Car, color: 'from-green-500 to-green-600', href: '/rides' },
    { name: 'Real Estate', icon: Home, color: 'from-purple-500 to-purple-600', href: '/real-estate' },
    { name: 'Food Delivery', icon: Utensils, color: 'from-red-500 to-red-600', href: '/food-delivery' },
    { name: 'Medical', icon: Heart, color: 'from-pink-500 to-pink-600', href: '/medical' },
    { name: 'Jobs', icon: Briefcase, color: 'from-yellow-500 to-yellow-600', href: '/jobs' },
    { name: 'Electronics', icon: Smartphone, color: 'from-indigo-500 to-indigo-600', href: '/shop' },
    { name: 'Fashion', icon: Shirt, color: 'from-orange-500 to-orange-600', href: '/shop' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 hover:border-orange-200"
          onClick={() => window.location.href = category.href}
        >
          <CardContent className="p-6 text-center">
            <div className={`mx-auto w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4`}>
              <category.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoryGrid;
