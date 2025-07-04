import React, { useState } from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GetQuoteModal from '@/components/modals/GetQuoteModal';
import ComparePlansModal from '@/components/modals/ComparePlansModal';
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
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [quotePlanType, setQuotePlanType] = useState('');

  const { toast } = useToast();

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
    toast({
      title: "Plan Selected",
      description: "Redirecting to enrollment process...",
    });
  };

  const handleComparePlans = (planId: string) => {
    setSelectedPlans(prev =>
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );

    if (!selectedPlans.includes(planId) && selectedPlans.length >= 1) {
      setShowComparisonModal(true);
    }
  };

  const handleBrowsePlans = (category: string) => {
    setSelectedCategory(category);
    toast({
      title: "Browse Plans",
      description: `Showing ${category} insurance plans`,
    });
  };

  const handleGetQuote = (planType?: string) => {
    setQuotePlanType(planType || '');
    setShowQuoteModal(true);
  };

  const handleViewDetails = (planId: string) => {
    toast({
      title: "Plan Details",
      description: "Opening detailed plan information...",
    });
  };

  // Original image URL for the hero section
  const heroImageUrl = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=2070&q=80';

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section - Increased height to prevent search bar overlap */}
        <div
          className="relative h-80 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8 shadow-xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${heroImageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Shield className="h-16 w-16 mx-auto mb-4 text-orange-100 drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">
                Insurance Coverage
              </h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Protect What Matters Most
                <span className="block">Find and compare comprehensive insurance plans from Kenya's most trusted providers. Get the coverage you need with competitive rates and excellent service.</span>
              </p>
              <div className="max-w-md mx-auto mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search insurance plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - max-w-7xl changed to max-w-5xl for smaller containers */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Removed the duplicate search bar as it's now properly in the hero */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => handleGetQuote()}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Quote Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowComparisonModal(true)}
              className="bg-white/20 border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
            >
              Compare Plans
            </Button>
          </div>

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
                  <Card key={type.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-orange-300 overflow-hidden">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading insurance plans...</p>
              </div>
            ) : filteredPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
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
                        <div className="text-3xl font-bold text-orange-600 mb-2">
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
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold"
                          onClick={() => handleSelectPlan(plan.id)}
                        >
                          Select Plan
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="border-orange-200 text-orange-600 hover:bg-orange-50 py-2 rounded-xl"
                            onClick={() => handleComparePlans(plan.id)}
                          >
                            <ArrowLeftRight className="h-4 w-4 mr-1" />
                            Compare
                          </Button>
                          <Button
                            variant="outline"
                            className="border-orange-200 text-orange-600 hover:bg-orange-50 py-2 rounded-xl"
                            onClick={() => handleViewDetails(plan.id)}
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
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold"
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
                <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Trusted Coverage</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive protection from Kenya's leading insurers
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
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
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Expert Advice</h3>
                <p className="text-gray-600 text-sm">
                  Professional guidance for all your insurance needs
                </p>
              </Card>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <GetQuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        planType={quotePlanType}
      />

      <ComparePlansModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        selectedPlans={selectedPlans}
      />
    </FrontendLayout>
  );
};

export default Insurance;