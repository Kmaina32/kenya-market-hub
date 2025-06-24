
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  providerName: string;
  serviceType: string;
}

const BookingModal = ({ 
  open, 
  onOpenChange, 
  serviceName, 
  providerName, 
  serviceType 
}: BookingModalProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    description: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Booking request submitted for ${serviceName}! The provider will contact you soon.`);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        address: '',
        description: '',
        additionalNotes: ''
      });
    } catch (error) {
      toast.error('Failed to submit booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Calendar className="h-5 w-5 text-orange-600" />
            Book Appointment
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Booking <span className="font-medium">{serviceName}</span> with <span className="font-medium">{providerName}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="bg-white border-gray-300 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g., +254 700 000 000"
                  required
                  className="bg-white border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
                className="bg-white border-gray-300 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Preferred Date
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="bg-white border-gray-300 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="preferredTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Preferred Time
                </Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  required
                  className="bg-white border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter the address where service is needed"
                required
                className="bg-white border-gray-300 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
            <div>
              <Label htmlFor="description">Service Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what you need help with..."
                rows={3}
                required
                className="bg-white border-gray-300 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any special requirements or additional information..."
                rows={2}
                className="bg-white border-gray-300 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Booking Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
