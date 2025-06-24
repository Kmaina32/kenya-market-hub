
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerName: string;
  providerPhone?: string;
  providerEmail?: string;
  serviceType: string;
}

const ContactProviderModal = ({ 
  open, 
  onOpenChange, 
  providerName, 
  providerPhone, 
  providerEmail, 
  serviceType 
}: ContactProviderModalProps) => {
  const { toast } = useToast();

  const handlePhoneCall = () => {
    if (providerPhone) {
      window.location.href = `tel:${providerPhone}`;
    } else {
      toast({
        title: "Phone number not available",
        description: "This provider hasn't shared their phone number.",
        variant: "destructive"
      });
    }
  };

  const handleEmail = () => {
    if (providerEmail) {
      window.location.href = `mailto:${providerEmail}?subject=Inquiry about ${serviceType} services`;
    } else {
      toast({
        title: "Email not available",
        description: "This provider hasn't shared their email address.",
        variant: "destructive"
      });
    }
  };

  const handleMessage = () => {
    toast({
      title: "Messaging feature coming soon",
      description: "Direct messaging will be available in a future update.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
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
              className="w-full flex items-center justify-center gap-3 h-12 border-green-200 text-green-700 hover:bg-green-50"
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

            <Button
              onClick={handleMessage}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 h-12"
            >
              <MessageCircle className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Send Message</div>
                <div className="text-xs opacity-90">Direct messaging</div>
              </div>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactProviderModal;
