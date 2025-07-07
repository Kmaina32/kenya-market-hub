
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MainLayout from '@/components/MainLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms and Conditions'
  })
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      termsAccepted: false
    }
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const onSignIn = async (values: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (!error) {
        navigate('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(values.email, values.password, values.fullName);
      if (!error) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email for verification link.",
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions.",
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('/LOGO/h.svg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Logo */}
        <div className="relative z-10 text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white p-2">
            <img
              alt="Sokko Sasa Logo"
              src="/LOGO/Sokko.svg"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-4xl text-white mt-3 drop-shadow-md">
           <span className="text-black">Sokko</span>
           <span className="text-orange-600"> Sasa</span>
          </h2>
          <p className="text-sm text-gray-200 mt-1 drop-shadow-sm">Kenya's Smart Marketplace</p>
        </div>

        {/* Auth Container */}
        <div className="relative z-10 max-w-[95%] sm:max-w-md w-full mx-auto px-4 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 bg-white/90 rounded-lg shadow-lg backdrop-blur-md">
          {showForgotPassword ? (
            <Card className="w-full shadow-none">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email to receive reset instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-6">
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Reset Email'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForgotPassword(false)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In */}
              <TabsContent value="signin">
                <Card className="w-full shadow-none">
                  <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Welcome back to Sokko Sasa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...signInForm}>
                      <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-6">
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="link"
                          className="w-auto p-0 h-auto text-sm text-orange-600 hover:text-orange-700 justify-end ml-auto block"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </Button>
                        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                          {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sign Up */}
              <TabsContent value="signup">
                <Card className="w-full shadow-none">
                  <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create your Sokko Sasa account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
                        <FormField
                          control={signUpForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Choose a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4 shadow-sm">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I accept the{' '}
                                  <button
                                    type="button"
                                    onClick={() => navigate('/terms-and-conditions')}
                                    className="text-blue-600 hover:underline"
                                  >
                                    Terms and Conditions
                                  </button>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating account...' : 'Sign Up'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;
