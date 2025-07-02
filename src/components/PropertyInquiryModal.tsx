
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property, useCreatePropertyInquiry } from '@/hooks/useProperties';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const PropertyInquiryModal: React.FC<PropertyInquiryModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  const { user } = useAuth();
  const createInquiry = useCreatePropertyInquiry();
  
  const [formData, setFormData] = useState({
    inquirer_name: user?.user_metadata?.full_name || '',
    inquirer_email: user?.email || '',
    inquirer_phone: '',
    message: '',
    inquiry_type: 'general' as 'general' | 'viewing' | 'purchase' | 'rent',
    preferred_contact_method: 'email' as 'email' | 'phone' | 'whatsapp',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    console.log('Creating property inquiry:', {
      property_id: property.id,
      inquirer_name: formData.inquirer_name,
      inquirer_email: formData.inquirer_email,
      inquirer_phone: formData.inquirer_phone,
      message: formData.message
    });

    createInquiry.mutate({
      property_id: property.id,
      inquirer_name: formData.inquirer_name,
      inquirer_email: formData.inquirer_email,
      inquirer_phone: formData.inquirer_phone,
      message: formData.message
    }, {
      onSuccess: () => {
        onClose();
        setFormData({
          inquirer_name: user?.user_metadata?.full_name || '',
          inquirer_email: user?.email || '',
          inquirer_phone: '',
          message: '',
          inquiry_type: 'general',
          preferred_contact_method: 'email',
        });
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquire About Property</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900">{property.title}</h4>
          <p className="text-sm text-purple-700">{property.location_address}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.inquirer_name}
              onChange={(e) => handleInputChange('inquirer_name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.inquirer_email}
              onChange={(e) => handleInputChange('inquirer_email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.inquirer_phone}
              onChange={(e) => handleInputChange('inquirer_phone', e.target.value)}
              placeholder="+254..."
            />
          </div>

          <div>
            <Label htmlFor="inquiry-type">Inquiry Type</Label>
            <Select value={formData.inquiry_type} onValueChange={(value) => handleInputChange('inquiry_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="viewing">Schedule Viewing</SelectItem>
                <SelectItem value="purchase">Purchase Interest</SelectItem>
                <SelectItem value="rent">Rental Interest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contact-method">Preferred Contact Method</Label>
            <Select value={formData.preferred_contact_method} onValueChange={(value) => handleInputChange('preferred_contact_method', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your requirements..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              disabled={createInquiry.isPending}
            >
              {createInquiry.isPending ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyInquiryModal;
