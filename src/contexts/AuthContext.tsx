
import React, { useState, useEffect, createContext, useContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data: adminCheck, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      const isUserAdmin = !!adminCheck;
      console.log('Admin status result:', isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    let adminCheckPromise: Promise<boolean> | null = null;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        // Cancel any pending admin check
        adminCheckPromise = null;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          adminCheckPromise = checkAdminStatus(session.user.id);
          try {
            const adminStatus = await adminCheckPromise;
            if (mounted && adminCheckPromise) {
              setIsAdmin(adminStatus);
            }
          } catch (error) {
            console.error('Admin status check failed:', error);
            if (mounted) {
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        if (!mounted) return;
        
        console.log('🔄 Initial session check:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          adminCheckPromise = checkAdminStatus(session.user.id);
          try {
            const adminStatus = await adminCheckPromise;
            if (mounted && adminCheckPromise) {
              setIsAdmin(adminStatus);
            }
          } catch (error) {
            console.error('Initial admin status check failed:', error);
            if (mounted) {
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      adminCheckPromise = null;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link"
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully"
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
