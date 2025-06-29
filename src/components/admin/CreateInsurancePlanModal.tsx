
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateInsurancePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateInsurancePlanModal: React.FC<CreateInsurancePlanModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    plan_type: '',
    monthly_premium: '',
    coverage_amount: '',
    features: [] as string[]
  });

  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Plan name is required';
    if (!formData.plan_type) newErrors.plan_type = 'Plan type is required';
    if (!formData.monthly_premium || parseFloat(formData.monthly_premium) <= 0) newErrors.monthly_premium = 'Valid premium amount is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPlanMutation = useMutation({
    mutationFn: async (planData: typeof formData) => {
      const { data, error } = await supabase
        .from('insurance_plans')
        .insert({
          ...planData,
          monthly_premium: parseFloat(planData.monthly_premium),
          coverage_amount: planData.coverage_amount ? parseFloat(planData.coverage_amount) : null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Insurance plan created successfully!');
      queryClient.invalidateQueries({ queryKey: ['insurance-plans'] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to create insurance plan: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      plan_type: '',
      monthly_premium: '',
      coverage_amount: '',
      features: []
    });
    setFeatureInput('');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createPlanMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const planTypes = [
    'health', 'life', 'auto', 'home', 'travel', 'business', 'disability'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Insurance Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Plan Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Comprehensive Health Plan"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan_type">Plan Type *</Label>
              <Select value={formData.plan_type} onValueChange={(value) => handleInputChange('plan_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  {planTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.plan_type && <p className="text-sm text-red-500 mt-1">{errors.plan_type}</p>}
            </div>

            <div>
              <Label htmlFor="monthly_premium">Monthly Premium (KSH) *</Label>
              <Input
                id="monthly_premium"
                type="number"
                step="0.01"
                value={formData.monthly_premium}
                onChange={(e) => handleInputChange('monthly_premium', e.target.value)}
                placeholder="5000.00"
              />
              {errors.monthly_premium && <p className="text-sm text-red-500 mt-1">{errors.monthly_premium}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="coverage_amount">Coverage Amount (KSH)</Label>
            <Input
              id="coverage_amount"
              type="number"
              step="0.01"
              value={formData.coverage_amount}
              onChange={(e) => handleInputChange('coverage_amount', e.target.value)}
              placeholder="1000000.00"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the insurance plan benefits..."
              rows={3}
            />
          </div>

          <div>
            <Label>Plan Features</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              disabled={createPlanMutation.isPending}
            >
              {createPlanMutation.isPending ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInsurancePlanModal;
