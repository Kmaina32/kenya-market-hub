import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Car, 
  Building, 
  Wrench,
  Stethoscope,
  Shield,
  PartyPopper,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useVendorApplication } from '@/hooks/useVendors';
import { useServiceProviderRegistration } from '@/hooks/useServiceProviderRegistration';
import MedicalProviderRegistrationForm from './MedicalProviderRegistrationForm';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ServiceProviderRegistration = ({ initialTab }: { initialTab?: string }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const serviceTypes = [
    { id: 'vendor', title: 'Product Vendor', icon: ShoppingBag, description: 'Sell products on our marketplace platform', color: 'from-orange-500 to-red-600', requirements: ['Valid business license', 'Product catalog', 'Tax compliance'] },
    { id: 'driver', title: 'Ride Driver', icon: Car, description: 'Provide taxi, motorbike or delivery services', color: 'from-blue-500 to-indigo-600', requirements: ['Valid driving license', 'Vehicle registration', 'Insurance cover'] },
    { id: 'property_agent', title: 'Real Estate Agent', icon: Building, description: 'Help clients buy, sell or rent properties', color: 'from-purple-500 to-violet-600', requirements: ['Real estate license', 'Professional certification', 'Property portfolio'] },
    { id: 'service_provider', title: 'Service Provider', icon: Wrench, description: 'Offer professional services like plumbing, electrical work', color: 'from-green-500 to-teal-600', requirements: ['Professional certification', 'Insurance cover', 'Work portfolio'] },
    { id: 'medical_provider', title: 'Medical Professional', icon: Stethoscope, description: 'Provide healthcare and medical consultation services', color: 'from-red-500 to-pink-600', requirements: ['Medical license', 'Professional registration', 'Insurance cover'] },
    { id: 'insurance_broker', title: 'Insurance Broker', icon: Shield, description: 'Help clients find the best insurance coverage', color: 'from-indigo-500 to-blue-600', requirements: ['Broker license', 'Professional certification', 'Regulatory compliance'] },
    { id: 'event_promoter', title: 'Event Promoter', icon: PartyPopper, description: 'Organize and promote events and entertainment', color: 'from-pink-500 to-rose-600', requirements: ['Event management certification', 'Portfolio of events', 'Vendor network'] }
  ];

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.warning("Please log in to apply");
      navigate('/auth');
      return;
    }

    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && serviceTypes.some(s => s.id === categoryFromUrl)) {
      setActiveTab(categoryFromUrl);
    } else if (initialTab && serviceTypes.some(s => s.id === initialTab)) {
      setActiveTab(initialTab);
    } else {
      setActiveTab(null);
    }
  }, [initialTab, searchParams, user, navigate]);

  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    service_type: '',
    license_number: '',
    experience_years: '',
    service_areas: ''
  });

  const vendorMutation = useVendorApplication();
  const serviceProviderMutation = useServiceProviderRegistration();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab || !user) return;
    
    setIsSubmitting(true);
    
    try {
      if (activeTab === 'vendor') {
        await vendorMutation.mutateAsync({
          business_name: formData.business_name,
          business_description: formData.business_description,
          business_address: formData.business_address,
          business_phone: formData.business_phone,
          business_email: formData.business_email
        });
      } else if (activeTab === 'driver') {
        // Create driver application (not directly creating driver profile)
        await serviceProviderMutation.mutateAsync({
          service_type: activeTab,
          business_name: formData.business_name,
          business_description: formData.business_description,
          business_address: formData.business_address,
          business_phone: formData.business_phone,
          business_email: formData.business_email,
          license_number: formData.license_number,
          experience_years: parseInt(formData.experience_years) || 0,
          service_areas: formData.service_areas.split(',').map(area => area.trim())
        });
      } else {
        // For other service types
        await serviceProviderMutation.mutateAsync({
          service_type: activeTab,
          business_name: formData.business_name,
          business_description: formData.business_description,
          business_address: formData.business_address,
          business_phone: formData.business_phone,
          business_email: formData.business_email,
          license_number: formData.license_number,
          experience_years: parseInt(formData.experience_years) || 0,
          service_areas: formData.service_areas.split(',').map(area => area.trim())
        });
      }
      
      // Reset form and navigate back
      setFormData({
        business_name: '',
        business_description: '',
        business_address: '',
        business_phone: '',
        business_email: '',
        service_type: '',
        license_number: '',
        experience_years: '',
        service_areas: ''
      });
      
      toast.success("Application submitted successfully! You will be notified once reviewed.");
      navigate('/service-hub');
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = activeTab ? serviceTypes.find(service => service.id === activeTab) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Provider Registration</h1>
          <p className="text-gray-600">Apply to join our marketplace and start growing your business</p>
        </div>

        {/* Service Type Selection */}
        {!activeTab && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Choose Your Service Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceTypes.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-center space-y-3 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200"
                    onClick={() => setActiveTab(service.id)}
                  >
                    <div className={`p-3 rounded-full bg-gradient-to-r ${service.color} text-white`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">{service.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                    </div>
                    
                    {/* Requirements preview */}
                    <div className="text-left w-full">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Requirements:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {service.requirements?.slice(0, 2).map((req, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                        {service.requirements && service.requirements.length > 2 && (
                          <li className="text-gray-500">+{service.requirements.length - 2} more...</li>
                        )}
                      </ul>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Registration Form */}
      {selectedService && activeTab === 'medical_provider' && (
        <MedicalProviderRegistrationForm />
      )}

      {selectedService && activeTab !== 'medical_provider' && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedService.color} text-white`}>
                <selectedService.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Register as {selectedService.title}</CardTitle>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    placeholder="Enter your business name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="business_phone">Phone Number *</Label>
                  <Input
                    id="business_phone"
                    value={formData.business_phone}
                    onChange={(e) => handleInputChange('business_phone', e.target.value)}
                    placeholder="+254 XXX XXX XXX"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="business_email">Business Email *</Label>
                <Input
                  id="business_email"
                  type="email"
                  value={formData.business_email}
                  onChange={(e) => handleInputChange('business_email', e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="business_address">Business Address *</Label>
                <Input
                  id="business_address"
                  value={formData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  placeholder="Enter your business address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="business_description">Business Description *</Label>
                <Textarea
                  id="business_description"
                  value={formData.business_description}
                  onChange={(e) => handleInputChange('business_description', e.target.value)}
                  placeholder="Describe your business and services"
                  required
                />
              </div>

              {/* Additional fields for service providers */}
              {activeTab !== 'vendor' && activeTab !== 'driver' && activeTab !== 'property_owner' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        value={formData.license_number}
                        onChange={(e) => handleInputChange('license_number', e.target.value)}
                        placeholder="Professional license number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_years">Years of Experience</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => handleInputChange('experience_years', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service_areas">Service Areas</Label>
                    <Input
                      id="service_areas"
                      value={formData.service_areas}
                      onChange={(e) => handleInputChange('service_areas', e.target.value)}
                      placeholder="Areas you serve (comma separated)"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab(null)}
                  className="flex-1"
                >
                  Back to Categories
                </Button>
                <Button 
                  type="submit" 
                  className={`flex-1 bg-gradient-to-r ${selectedService.color} text-white hover:opacity-90`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : `Submit Application`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};

export default ServiceProviderRegistration;
