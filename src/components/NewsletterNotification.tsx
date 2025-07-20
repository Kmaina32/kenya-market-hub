import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, X, Loader2 } from 'lucide-react'; // Import Loader2 icon

// TODO: Import your authentication hook or context
// import { useAuth } from '@/contexts/AuthContext';

const NewsletterNotification = () => {
  // TODO: Get user from your authentication hook/context
  // const { user } = useAuth();
  const user = null; // Placeholder: Replace with actual user object

  const [isSignedUp, setIsSignedUp] = useState(false); 
  const [isVisible, setIsVisible] = useState(false); // Set initial state to false
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Effect to check signup status and last shown time on mount
  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true); // Start loading
      
      // TODO: Fetch actual newsletter signup status for the user
      // If user is logged in, fetch from your backend/database
      // const userSignupStatus = await fetchUserNewsletterStatus(user.id);
      // setIsSignedUp(userSignupStatus);

      // Placeholder: Assume not signed up for now
      const userSignedUp = false; 
      setIsSignedUp(userSignedUp);

      const lastShown = localStorage.getItem('lastNewsletterNotificationShown');
      const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
      const now = new Date().getTime();

      if (!userSignedUp && (!lastShown || (now - parseInt(lastShown) >= oneDay))) {
        // Show if not signed up AND (never shown OR shown more than a day ago)
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setIsLoading(false); // End loading
    };

    checkStatus();

  }, [user]); // Re-run effect when user object changes

  const handleSignup = async () => {
    // TODO: Implement newsletter signup logic (requires backend integration)
    console.log('Attempting to sign up with:', email);
    setIsLoading(true); // Indicate signup in progress
    
    try {
      // TODO: Call your backend API to subscribe the email
      // const signupSuccess = await subscribeToNewsletter(email);

      const signupSuccess = true; // Placeholder: Assume signup is successful

      if (signupSuccess) {
        setIsSignedUp(true);
        setIsVisible(false); // Hide notification after successful signup
        localStorage.setItem('lastNewsletterNotificationShown', new Date().getTime().toString()); // Update last shown time
        // TODO: Show a success message to the user
        console.log('Newsletter signup successful!');
      } else {
         // TODO: Handle signup failure (show error message)
         console.error('Newsletter signup failed.');
      }
    } catch (error) {
       // TODO: Handle errors during signup
       console.error('Error during newsletter signup:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Record dismissal time to not show again for a day
    localStorage.setItem('lastNewsletterNotificationShown', new Date().getTime().toString());
  };

  // Render nothing if loading or not visible
  if (isLoading || !isVisible) {
    return null;
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
          disabled={isLoading} // Disable button while loading
        >
           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Subscribe
        </Button>
      </div>
    </div>
  );
};

export default NewsletterNotification;
