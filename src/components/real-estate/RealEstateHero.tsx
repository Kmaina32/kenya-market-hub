
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

const RealEstateHero: React.FC = () => {
  return (
    <section className="relative text-center py-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
        }}
      />
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sokko Sasa Properties
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Find your perfect home or investment property in Kenya's prime locations
        </p>
        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-3">
          <Building className="mr-2 h-5 w-5" />
          Browse Properties
        </Button>
      </div>
    </section>
  );
};

export default RealEstateHero;
