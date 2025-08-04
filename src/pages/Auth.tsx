import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Building, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!showForgotPassword) {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!isLogin) {
        if (!fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        if (!phoneNumber.trim()) {
          newErrors.phoneNumber = 'Phone number is required';
        }
        if (!acceptTerms) {
          newErrors.terms = 'You must accept the terms and conditions';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (showForgotPassword) {
        await resetPassword(email);
        setShowForgotPassword(false);
        setEmail('');
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate(from, { replace: true });
        }
      } else {
        const { error } = await signUp(email, password, fullName, companyName, phoneNumber);
        if (!error) {
          // Keep user on auth page to show success message
          setEmail('');
          setPassword('');
          setFullName('');
          setCompanyName('');
          setPhoneNumber('');
          setAcceptTerms(false);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = () => {
    setIsLogin(!isLogin);
    setShowForgotPassword(false);
    setErrors({});
    setPassword('');
    if (isLogin) {
      setFullName('');
      setCompanyName('');
      setPhoneNumber('');
      setAcceptTerms(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <img
                  alt="Sokko Sasa Logo"
                  src="/LOGO/Sokko.svg"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <span class="text-white font-bold text-xl">SS</span>
                    `;
                  }}
                />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                <span className="text-gray-900">Sokko</span>{' '}
                <span className="text-orange-600">Sasa</span>
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {showForgotPassword 
                  ? 'Reset your password'
                  : isLogin 
                    ? 'Welcome back to Kenya\'s Smart Marketplace' 
                    : 'Join Kenya\'s Smart Marketplace'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              {/* Full Name Field (Sign Up Only) */}
              {!isLogin && !showForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`pl-10 ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500`}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                </div>
              )}

              {/* Company Name Field (Sign Up Only) */}
              {!isLogin && !showForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                    Company Name <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Phone Number Field (Sign Up Only) */}
              {!isLogin && !showForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500`}
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                </div>
              )}

              {/* Password Field */}
              {!showForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
              )}

              {/* Terms and Conditions (Sign Up Only) */}
              {!isLogin && !showForgotPassword && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link 
                        to="/terms-and-conditions" 
                        className="text-orange-600 hover:text-orange-700 underline"
                        target="_blank"
                      >
                        Terms and Conditions
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-2.5 transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {showForgotPassword ? 'Sending...' : isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  showForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {/* Forgot Password Link */}
            {isLogin && !showForgotPassword && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-orange-600 hover:text-orange-700"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </Button>
              </div>
            )}

            {/* Back to Sign In */}
            {showForgotPassword && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-orange-600 hover:text-orange-700"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setErrors({});
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </div>
            )}

            {/* Toggle Between Sign In/Sign Up */}
            {!showForgotPassword && (
              <>
                <Separator className="bg-gray-200" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                    onClick={handleModeToggle}
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </Button>
                </div>
              </>
            )}

            {/* Back to Home */}
            <div className="text-center pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                asChild
                className="text-gray-600 hover:text-gray-800"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
