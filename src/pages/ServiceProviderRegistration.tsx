
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ResponsiveAuthLayout } from '@/components/auth/ResponsiveAuthLayout';
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

interface FormData {
  category: string;
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  licenseNumber: string;
  experienceYears: number;
  specialization: string;
  serviceAreas: string[];
  documents: any[];
}

const ServiceProviderRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const initialCategory = searchParams.get('category') || '';
  
  const [formData, setFormData] = useState<FormData>({
    category: initialCategory,
    businessName: '',
    businessDescription: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: user?.email || '',
    licenseNumber: '',
    experienceYears: 0,
    specialization: '',
    serviceAreas: [],
    documents: []
  });

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply as a service provider.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  const serviceAreas = [
    'Nairobi CBD', 'Westlands', 'Karen', 'Kilimani', 'Lavington',
    'Kileleshwa', 'Upperhill', 'Parklands', 'South B', 'South C',
    'Eastleigh', 'Kasarani', 'Roysambu', 'Thika Road', 'Ngong Road'
  ];

  const specializations = {
    medical_provider: [
      'General Medicine', 'Cardiology', 'Pediatrics', 'Dermatology', 'Orthopedics',
      'Gynecology', 'Psychiatry', 'Dentistry', 'Ophthalmology', 'ENT'
    ],
    insurance_broker: [
      'Life Insurance', 'Health Insurance', 'Motor Insurance', 'Property Insurance',
      'Business Insurance', 'Travel Insurance', 'Marine Insurance'
    ],
    real_estate_agent: [
      'Residential Sales', 'Commercial Sales', 'Property Management', 'Rentals',
      'Land Sales', 'Property Development', 'Investment Advisory'
    ],
    service_provider: [
      'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
      'Landscaping', 'HVAC', 'Appliance Repair', 'Roofing', 'Masonry'
    ],
    driver: [
      'Taxi Services', 'Boda Boda', 'Delivery Services', 'Tour Guide',
      'Airport Transfers', 'Corporate Transport', 'School Transport'
    ]
  };

  const submitApplication = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase
        .from('service_provider_applications')
        .insert({
          user_id: user!.id,
          category: data.category,
          business_name: data.businessName,
          business_description: data.businessDescription,
          business_address: data.businessAddress,
          business_phone: data.businessPhone,
          business_email: data.businessEmail,
          license_number: data.licenseNumber || null,
          experience_years: data.experienceYears || null,
          specialization: data.specialization || null,
          service_areas: data.serviceAreas.length > 0 ? data.serviceAreas : null,
          documents: data.documents.length > 0 ? data.documents : null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted for review. You'll be notified once it's processed."
      });
      navigate('/service-hub?tab=my-services');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.businessName || !formData.businessPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitApplication.mutateAsync({
        ...formData,
        serviceAreas: selectedAreas
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      vendor: 'Product Vendor',
      event_promoter: 'Event Promoter',
      driver: 'Driver',
      service_provider: 'Service Provider',
      real_estate_agent: 'Real Estate Agent',
      medical_provider: 'Medical Provider',
      insurance_broker: 'Insurance Broker'
    };
    return names[category] || category;
  };

  const requiresLicense = ['medical_provider', 'insurance_broker', 'real_estate_agent', 'driver'].includes(formData.category);
  const hasSpecializations = Object.keys(specializations).includes(formData.category as keyof typeof specializations);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/service-hub')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Service Hub
            </Button>
          </div>

          <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formData.category ? `Apply as ${getCategoryDisplayName(formData.category)}` : 'Service Provider Application'}
              </CardTitle>
              <p className="text-base text-gray-600">
                Complete this form to apply as a service provider. Our team will review your application within 2-3 business days.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                {!initialCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Service Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your service category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendor">Product Vendor</SelectItem>
                        <SelectItem value="event_promoter">Event Promoter</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="service_provider">Service Provider</SelectItem>
                        <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                        <SelectItem value="medical_provider">Medical Provider</SelectItem>
                        <SelectItem value="insurance_broker">Insurance Broker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business/Service Name *</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Enter your business name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Phone Number *</Label>
                    <Input
                      id="businessPhone"
                      type="tel"
                      value={formData.businessPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                      placeholder="254712345678"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessEmail: e.target.value }))}
                    placeholder="business@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    placeholder="Describe your business and services..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    placeholder="Enter your business address"
                    rows={2}
                  />
                </div>

                {/* License Information */}
                {requiresLicense && (
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="Enter your license number"
                      required
                    />
                  </div>
                )}

                {/* Specialization */}
                {hasSpecializations && (
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations[formData.category as keyof typeof specializations]?.map((spec) => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                {/* Service Areas */}
                <div className="space-y-3">
                  <Label>Service Areas</Label>
                  <p className="text-sm text-gray-600">Select the areas where you provide services</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {serviceAreas.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={selectedAreas.includes(area)}
                          onCheckedChange={() => handleAreaToggle(area)}
                        />
                        <Label htmlFor={area} className="text-sm font-normal">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Upload Placeholder */}
                <div className="space-y-2">
                  <Label>Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Document upload will be available soon
                    </p>
                    <p className="text-xs text-gray-500">
                      You can submit your application now and upload documents later
                    </p>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the terms and conditions and confirm that all information provided is accurate
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                    disabled={isSubmitting || submitApplication.isPending}
                  >
                    {isSubmitting || submitApplication.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Info Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800">What happens next?</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your application will be reviewed within 2-3 business days</li>
                    <li>• You'll receive an email notification with the decision</li>
                    <li>• Once approved, you can access your service dashboard</li>
                    <li>• You can apply for additional service categories anytime</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderRegistration;
