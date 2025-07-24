
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as z from 'zod';
import MainLayout from '@/components/MainLayout';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          toast({
            title: "Session Error",
            description: "There was an error checking your session. Please try requesting a new password reset.",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        if (session) {
          setIsValidSession(true);
        } else {
          toast({
            title: "Invalid or expired link",
            description: "Please request a new password reset link from the sign-in page.",
            variant: "destructive"
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password updated successfully",
          description: "You can now sign in with your new password."
        });
        navigate('/auth');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Validating reset link...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isValidSession) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-gray-600">Redirecting...</div>
          </div>
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
          <p className="text-sm text-gray-200 mt-1 drop-shadow-sm">Reset Your Password</p>
        </div>
        
        {/* Reset Password Form */}
        <div className="relative z-10 max-w-[95%] sm:max-w-md w-full mx-auto px-4 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 bg-white/90 rounded-lg shadow-lg backdrop-blur-md">
          <Card className="w-full shadow-none">
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
