
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import HomeHeroSection from '@/components/shared/HomeHeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Globe, Users } from 'lucide-react';

const Index = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HomeHeroSection />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From shopping to real estate, from rides to services - find everything you need in one place.
              </p>
            </div>
            <CategoryGrid />
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Sokko Smart?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Quick and efficient service delivery across all categories"
                },
                {
                  icon: Shield,
                  title: "Secure & Safe",
                  description: "Your data and transactions are protected with advanced security"
                },
                {
                  icon: Globe,
                  title: "Wide Coverage",
                  description: "Available across Kenya with expanding reach nationwide"
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Built by Kenyans, for Kenyans - supporting local businesses"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
              <p className="text-lg text-orange-100">
                Thousands of Kenyans are already using Sokko Smart for their daily needs
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50K+", label: "Active Users" },
                { number: "1000+", label: "Service Providers" },
                { number: "100K+", label: "Transactions" },
                { number: "47", label: "Counties Served" }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold">{stat.number}</div>
                  <div className="text-orange-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
