
import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (!token || type !== 'signup') {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          setStatus('error');
          setMessage(error.message);
        } else {
          setStatus('success');
          setMessage('Your email has been confirmed successfully!');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">🛒</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Sokko Sasa
          </h1>
          <p className="text-gray-600 text-sm">Kenya's Premier Digital Marketplace</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              {status === 'loading' && (
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-500 animate-pulse" />
              )}
              {status === 'error' && (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {status === 'loading' && 'Confirming your email...'}
              {status === 'success' && 'Email Confirmed!'}
              {status === 'error' && 'Confirmation Failed'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {status === 'loading' && 'Please wait while we verify your email address.'}
              {status === 'success' && 'Welcome to Sokko Sasa! Your account is now active.'}
              {status === 'error' && 'There was a problem confirming your email address.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {message}
            </p>

            {status === 'success' && (
              <div className="space-y-3">
                <Link to="/">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Shopping
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                    Sign In to Your Account
                  </Button>
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Try Signing Up Again
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            )}

            {status === 'loading' && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Verifying your email address...</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Having trouble? Contact our support team</p>
          <p className="font-medium">support@sokosmart.ke</p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
