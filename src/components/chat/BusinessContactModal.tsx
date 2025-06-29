
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle } from 'lucide-react';

interface BusinessContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessId: string;
}

const BusinessContactModal = ({ isOpen, onClose, businessName, businessId }: BusinessContactModalProps) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsLoading(true);
      try {
        // Placeholder for business conversation logic
        console.log('Starting conversation with business:', businessId, message);
        
        toast({
          title: 'Message Sent',
          description: 'Your message has been sent to the business.',
        });
        
        setMessage('');
        onClose();
      } catch (error) {
        console.error('Business conversation error:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact {businessName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Send a message to start a conversation with {businessName}.
          </p>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessContactModal;
