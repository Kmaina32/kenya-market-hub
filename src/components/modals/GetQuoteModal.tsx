
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType?: string;
}

const GetQuoteModal = ({ isOpen, onClose, planType }: GetQuoteModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    insuranceType: planType || '',
    coverageAmount: '',
    additionalInfo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.insuranceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate quote request
    console.log('Quote request submitted:', formData);
    
    toast({
      title: "Quote Request Submitted",
      description: "We'll contact you within 24 hours with your personalized quote.",
    });

    // Reset form and close modal
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      insuranceType: '',
      coverageAmount: '',
      additionalInfo: ''
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Get Insurance Quote</DialogTitle>
          <DialogDescription>
            Fill in your details to get a personalized insurance quote.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="insuranceType">Insurance Type *</Label>
            <Select value={formData.insuranceType} onValueChange={(value) => handleInputChange('insuranceType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select insurance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Health Insurance</SelectItem>
                <SelectItem value="motor">Motor Insurance</SelectItem>
                <SelectItem value="home">Home Insurance</SelectItem>
                <SelectItem value="business">Business Insurance</SelectItem>
                <SelectItem value="life">Life Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="coverageAmount">Desired Coverage Amount</Label>
            <Input
              id="coverageAmount"
              value={formData.coverageAmount}
              onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
              placeholder="e.g., KSh 1,000,000"
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any additional information or specific requirements..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Get Quote
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GetQuoteModal;
