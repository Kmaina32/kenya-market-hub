
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import BookingModal from './BookingModal';

interface ContactProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerName: string;
  providerPhone?: string;
  providerEmail?: string;
  serviceType: string;
  serviceName?: string;
}

const ContactProviderModal = ({ 
  open, 
  onOpenChange, 
  providerName, 
  providerPhone, 
  providerEmail, 
  serviceType,
  serviceName = 'Service'
}: ContactProviderModalProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handlePhoneCall = () => {
    if (providerPhone) {
      window.location.href = `tel:${providerPhone}`;
      toast.success('Opening phone dialer...');
    } else {
      toast.error('Phone number not available');
    }
  };

  const handleEmail = () => {
    if (providerEmail) {
      window.location.href = `mailto:${providerEmail}?subject=Inquiry about ${serviceType} services`;
      toast.success('Opening email client...');
    } else {
      toast.error('Email not available');
    }
  };

  const handleBookAppointment = () => {
    setIsBookingModalOpen(true);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Contact Provider
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Get in touch with <span className="font-medium">{providerName}</span>
            </p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Choose how you'd like to contact this {serviceType} provider:
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleBookAppointment}
                className="w-full flex items-center justify-center gap-3 h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Calendar className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Book Appointment</div>
                  <div className="text-xs opacity-90">Schedule a service</div>
                </div>
              </Button>

              <Button
                onClick={handlePhoneCall}
                className="w-full flex items-center justify-center gap-3 h-12 bg-blue-600 hover:bg-blue-700"
                disabled={!providerPhone}
              >
                <Phone className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Call Now</div>
                  <div className="text-xs opacity-90">
                    {providerPhone || 'Phone not available'}
                  </div>
                </div>
              </Button>

              <Button
                onClick={handleEmail}
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 border-green-200 text-green-700 hover:bg-green-50 bg-white"
                disabled={!providerEmail}
              >
                <Mail className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Send Email</div>
                  <div className="text-xs opacity-90">
                    {providerEmail || 'Email not available'}
                  </div>
                </div>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="w-full hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        serviceName={serviceName}
        providerName={providerName}
        serviceType={serviceType}
      />
    </>
  );
};

export default ContactProviderModal;
