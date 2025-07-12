
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';

interface EventBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: {
    id: string;
    title: string;
    price: number;
    date: string;
  };
}

const EventBookingModal = ({ isOpen, onClose, event }: EventBookingModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCartContext();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    tickets: 1,
    specialRequests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!event) return;

    // Add event tickets to cart using the correct method
    for (let i = 0; i < formData.tickets; i++) {
      addToCart(event.id, 1);
    }
    
    toast({
      title: "Tickets Added to Cart",
      description: `${formData.tickets} ticket(s) for ${event.title} added to your cart.`,
    });

    // Close modal and navigate to checkout
    onClose();
    navigate('/checkout');
    
    // Reset form
    setFormData({
      fullName: '',
      email: user?.email || '',
      phone: '',
      tickets: 1,
      specialRequests: ''
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalPrice = (event?.price || 0) * formData.tickets;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Event Tickets
          </DialogTitle>
          <DialogDescription>
            Reserve your spot for {event?.title}
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
              placeholder="254712345678"
              required
            />
          </div>

          <div>
            <Label htmlFor="tickets">Number of Tickets</Label>
            <Input
              id="tickets"
              type="number"
              min="1"
              max="10"
              value={formData.tickets}
              onChange={(e) => handleInputChange('tickets', parseInt(e.target.value) || 1)}
            />
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Any special requests or dietary requirements..."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg font-bold text-orange-600">
                KSh {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Book Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventBookingModal;
