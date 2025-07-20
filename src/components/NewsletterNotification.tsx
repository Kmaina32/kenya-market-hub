import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, X } from 'lucide-react';


const NewsletterNotification = () => {
  // TODO: Implement logic to check if user is signed up for newsletter
  const [isSignedUp, setIsSignedUp] = useState(false); 
  // TODO: Implement logic to track last time notification was shown using local storage
  const [isVisible, setIsVisible] = useState(true); 
  const [email, setEmail] = useState('');

  // TODO: Add useEffect to check signup status and last shown time on mount
  useEffect(() => {
    // Placeholder logic:
    const lastShown = localStorage.getItem('lastNewsletterNotificationShown');
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const now = new Date().getTime();

    if (lastShown && (now - parseInt(lastShown) < oneDay)) {
      setIsVisible(false); // Hide if shown within the last day
    } else {
       // TODO: Check if user is actually signed up (requires backend check)
       // For now, assuming not signed up if not shown recently
       setIsVisible(!isSignedUp); // Show if not shown recently and not signed up
    }

  }, [isSignedUp]); // Re-run effect if signup status changes

  const handleSignup = () => {
    // TODO: Implement newsletter signup logic (requires backend integration)
    console.log('Attempting to sign up with:', email);
    // On successful signup:
    // setIsSignedUp(true);
    // setIsVisible(false); // Hide notification after signup
    // localStorage.setItem('lastNewsletterNotificationShown', new Date().getTime().toString()); // Update last shown time
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Record dismissal time to not show again for a day
    localStorage.setItem('lastNewsletterNotificationShown', new Date().getTime().toString());
  };

  if (!isVisible || isSignedUp) {
    return null; // Don't render if not visible or already signed up
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-6 max-w-sm z-50 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Mail className="h-6 w-6 text-orange-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Stay Updated!</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDismiss} aria-label="Dismiss notification">
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Subscribe to our newsletter for the latest products, services, and offers.
      </p>
      <div className="flex gap-2">
        <Input 
          type="email" 
          placeholder="Enter your email" 
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button 
          onClick={handleSignup}
          className="bg-orange-600 text-white hover:bg-orange-700 font-semibold px-4 py-2 rounded-md text-sm"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
};


export default NewsletterNotification;
