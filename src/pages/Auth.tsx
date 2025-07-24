
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { validateEmail, validateInput } from '@/utils/authUtils';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const { handleLoginAttempt, failedAttempts, isLocked, lockUntil } = useEnhancedAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorMsg = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (errorMsg) {
      // Safely handle error message without innerHTML
      const sanitizedError = validateInput(errorDescription || errorMsg, 200);
      setError(sanitizedError);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Input validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isLogin && fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters long');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await handleLoginAttempt(email, password);
        navigate('/');
      } else {
        const sanitizedFullName = validateInput(fullName, 100);
        await signUp(email, password, sanitizedFullName);
        toast.success('Account created successfully! Please check your email for verification.');
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const createSecureErrorElement = (message: string) => {
    const errorElement = document.createElement('div');
    errorElement.textContent = message; // Use textContent to prevent XSS
    errorElement.className = 'text-red-600 text-sm';
    return errorElement;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLocked && (
            <Alert className="mb-4">
              <AlertDescription>
                Account temporarily locked due to multiple failed attempts. 
                Try again after {lockUntil?.toLocaleTimeString()}.
              </AlertDescription>
            </Alert>
          )}

          {failedAttempts > 0 && !isLocked && (
            <Alert className="mb-4">
              <AlertDescription>
                {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''}. 
                {5 - failedAttempts} remaining before temporary lockout.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || isLocked}
                className="w-full"
                autoComplete="email"
                maxLength={100}
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                  autoComplete="name"
                  maxLength={100}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || isLocked}
                className="w-full"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={6}
                maxLength={128}
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || isLocked}
              className="w-full"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFullName('');
              }}
              className="text-sm text-blue-600 hover:text-blue-500"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
