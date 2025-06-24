
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MessageCircle, Mail, User } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'call' | 'message'>('call');
  const [messageData, setMessageData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleCall = () => {
    if (providerPhone) {
      // Create a clickable phone link
      window.location.href = `tel:${providerPhone}`;
      toast({
        title: "Calling Provider",
        description: `Initiating call to ${providerName}`,
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Phone Number Not Available",
        description: "Please try sending a message instead.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageData.fullName || !messageData.email || !messageData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the message to your backend
    console.log('Message to provider:', {
      provider: providerName,
      service: serviceType,
      ...messageData
    });

    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${providerName}. They will contact you soon.`,
    });

    // Reset form and close modal
    setMessageData({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    });
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setMessageData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-600" />
            Contact Provider
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Get in touch with <span className="font-medium">{providerName}</span>
          </p>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('call')}
            className={`flex-1 py-2 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'call'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Phone className="h-4 w-4 inline mr-2" />
            Call Now
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-2 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'message'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="h-4 w-4 inline mr-2" />
            Send Message
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'call' ? (
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{providerName}</h3>
                  <p className="text-sm text-gray-600">{serviceType}</p>
                  {providerPhone && (
                    <p className="font-mono text-lg text-gray-900 mt-2">{providerPhone}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCall}
                  disabled={!providerPhone}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>

              {!providerPhone && (
                <p className="text-sm text-red-600 text-center">
                  Phone number not available for this provider
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="fullName">Your Name *</Label>
                  <Input
                    id="fullName"
                    value={messageData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={messageData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Your Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={messageData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Your Message *</Label>
                  <Textarea
                    id="message"
                    value={messageData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={`Hi ${providerName}, I'm interested in your ${serviceType} services. Please contact me to discuss...`}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactProviderModal;
