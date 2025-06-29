
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Car, MapPin, Clock } from 'lucide-react';

interface RideBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RideBookingModal = ({ isOpen, onClose }: RideBookingModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    vehicleType: '',
    passengers: 1,
    scheduledTime: '',
    phoneNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pickup || !formData.destination || !formData.vehicleType || !formData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    console.log('Ride booking submitted:', formData);
    
    toast({
      title: "Ride Booked!",
      description: "We're finding a driver for you. You'll receive a call shortly.",
    });

    setFormData({
      pickup: '',
      destination: '',
      vehicleType: '',
      passengers: 1,
      scheduledTime: '',
      phoneNumber: ''
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Book a Ride
          </DialogTitle>
          <DialogDescription>
            Tell us where you want to go
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pickup">Pickup Location *</Label>
            <Input
              id="pickup"
              value={formData.pickup}
              onChange={(e) => handleInputChange('pickup', e.target.value)}
              placeholder="Where are you now?"
              required
            />
          </div>

          <div>
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="Where do you want to go?"
              required
            />
          </div>

          <div>
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan (1-4 passengers)</SelectItem>
                <SelectItem value="suv">SUV (1-6 passengers)</SelectItem>
                <SelectItem value="van">Van (1-8 passengers)</SelectItem>
                <SelectItem value="motorcycle">Motorcycle (1 passenger)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="passengers">Number of Passengers</Label>
            <Input
              id="passengers"
              type="number"
              min="1"
              max="8"
              value={formData.passengers}
              onChange={(e) => handleInputChange('passengers', parseInt(e.target.value) || 1)}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Your contact number"
              required
            />
          </div>

          <div>
            <Label htmlFor="scheduledTime">Schedule for Later (Optional)</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Book Ride
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RideBookingModal;
