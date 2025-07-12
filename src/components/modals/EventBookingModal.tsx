
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
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';

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
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    tickets: 1,
    specialRequests: ''
  });

  // Create event booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!user || !event) throw new Error('Missing user or event data');

      // Create a temporary order for the event tickets
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: event.price * formData.tickets,
          status: 'pending',
          shipping_address: '', // Not applicable for events
          shipping_city: '',
          contact_phone: formData.phone,
          contact_email: formData.email,
          payment_method: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Store event booking details in order metadata or create a separate booking record
      // For now, we'll use the order system and navigate to checkout
      return {
        orderId: order.id,
        eventData: {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          tickets: formData.tickets,
          totalAmount: event.price * formData.tickets,
          bookingDetails: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            specialRequests: formData.specialRequests
          }
        }
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Booking Created",
        description: `${formData.tickets} ticket(s) for ${event?.title} reserved. Proceeding to payment.`,
      });

      // Navigate to checkout with event booking data
      navigate('/checkout', {
        state: {
          isEventBooking: true,
          orderId: data.orderId,
          eventData: data.eventData
        }
      });
      
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        email: user?.email || '',
        phone: '',
        tickets: 1,
        specialRequests: ''
      });
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    }
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

    createBookingMutation.mutate();
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
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? 'Processing...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventBookingModal;
