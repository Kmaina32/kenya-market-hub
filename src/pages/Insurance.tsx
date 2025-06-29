import React, { useState } from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Car, 
  Home, 
  Heart, 
  Briefcase, 
  Search,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Clock,
  Award,
  ArrowLeftRight,
  Eye
} from 'lucide-react';

const Insurance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  // Fetch insurance plans from database
  const { data: plans, isLoading } = useQuery({
    queryKey: ['insurance-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_plans')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const insuranceTypes = [
    {
      id: 'health',
      title: 'Health Insurance',
      icon: Heart,
      description: 'Comprehensive medical coverage for you and your family',
      features: ['Inpatient Care', 'Outpatient Services', 'Emergency Coverage', 'Specialist Consultations'],
      color: 'red',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'motor',
      title: 'Motor Insurance',
      icon: Car,
      description: 'Complete protection for your vehicle',
      features: ['Comprehensive Cover', 'Third Party Liability', 'Theft Protection', 'Accident Coverage'],
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'home',
      title: 'Home Insurance',
      icon: Home,
      description: 'Protect your property and belongings',
      features: ['Building Cover', 'Contents Insurance', 'Fire Protection', 'Burglary Cover'],
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'business',
      title: 'Business Insurance',
      icon: Briefcase,
      description: 'Comprehensive business protection',
      features: ['Public Liability', 'Professional Indemnity', 'Business Interruption', 'Equipment Cover'],
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'life',
      title: 'Life Insurance',
      icon: Shield,
      description: 'Financial security for your loved ones',
      features: ['Life Cover', 'Critical Illness', 'Income Protection', 'Education Plans'],
      color: 'orange',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const filteredPlans = plans?.filter(plan => {
    const matchesSearch = plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.plan_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plan.plan_type?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleSelectPlan = (planId: string) => {
    console.log('Selecting plan:', planId);
    // Handle plan selection logic
  };

  const handleComparePlans = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleBrowsePlans = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section with Background Image */}
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)` 
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 opacity-90" />
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-32">
            <div className="text-center text-white">
              <div className="flex justify-center mb-8">
                <Shield className="h-20 w-20 text-blue-200 animate-pulse" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Protect What 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Matters Most
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl mb-10 opacity-90 max-w-4xl mx-auto leading-relaxed">
                Find and compare comprehensive insurance plans from Kenya's most trusted providers. 
                Get the coverage you need with competitive rates and excellent service.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <Input
                    placeholder="Search insurance plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-16 pr-6 py-6 text-lg bg-white/95 border-0 text-gray-900 placeholder-gray-500 rounded-2xl shadow-2xl backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Quote Now
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
                >
                  Compare Plans
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Insurance Types */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Insurance Coverage</h2>
              <p className="text-xl text-gray-600">Choose the right protection for your needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insuranceTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <Card key={type.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-300 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${type.gradient}`}></div>
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto p-4 rounded-full bg-gradient-to-r ${type.gradient} w-20 h-20 flex items-center justify-center mb-4 shadow-lg`}>
                        <TypeIcon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">{type.title}</CardTitle>
                      <p className="text-base text-gray-600 mb-4">{type.description}</p>
                      
                      <ul className="space-y-3 text-left mb-6">
                        {type.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm">
                            <CheckCircle className={`h-5 w-5 text-${type.color}-500 flex-shrink-0`} />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-6">
                      <Button 
                        className={`w-full bg-gradient-to-r ${type.gradient} hover:shadow-lg text-white py-3 rounded-xl font-semibold transition-all duration-300`}
                        onClick={() => handleBrowsePlans(type.id)}
                      >
                        Browse Plans
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Insurance Plans */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Plans</h2>
              <p className="text-lg text-gray-600">Compare and choose the best insurance plan for you</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading insurance plans...</p>
              </div>
            ) : filteredPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {plan.plan_type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-900 mb-2 line-clamp-2">{plan.name}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-3">{plan.description}</p>
                    </CardHeader>
                    
                    <CardContent className="flex-grow flex flex-col">
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          KSh {Number(plan.monthly_premium).toLocaleString()}
                          <span className="text-lg text-gray-500 font-normal">/month</span>
                        </div>
                        {plan.coverage_amount && (
                          <p className="text-sm text-gray-600">
                            Coverage up to KSh {Number(plan.coverage_amount).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && (
                        <ul className="space-y-2 mb-6 flex-grow">
                          {plan.features.slice(0, 4).map((feature: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="space-y-3 mt-auto">
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold"
                          onClick={() => handleSelectPlan(plan.id)}
                        >
                          Select Plan
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 py-2 rounded-xl"
                            onClick={() => handleComparePlans(plan.id)}
                          >
                            <ArrowLeftRight className="h-4 w-4 mr-1" />
                            Compare
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 py-2 rounded-xl"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plans Available</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'No plans match your current search criteria.' 
                    : 'Insurance plans will be available soon.'
                  }
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </section>

          {/* Features Section */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Trusted Coverage</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive protection from Kenya's leading insurers
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Quick Claims</h3>
                <p className="text-gray-600 text-sm">
                  Fast and efficient claims processing
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Phone className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                <p className="text-gray-600 text-sm">
                  Round-the-clock customer support
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Expert Advice</h3>
                <p className="text-gray-600 text-sm">
                  Professional guidance for all your insurance needs
                </p>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Insurance;
