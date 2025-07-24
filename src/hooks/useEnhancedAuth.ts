
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityAudit } from './useSecurityAudit';
import { supabase } from '@/integrations/supabase/client';
import { SecureValidator } from '@/utils/secureValidation';

export const useEnhancedAuth = () => {
  const { user } = useAuth();
  const { logFailedLogin, logSuccessfulLogin, logSecurityViolation } = useSecurityAudit();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);

  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    if (lockUntil && new Date() > lockUntil) {
      setIsLocked(false);
      setLockUntil(null);
      setFailedAttempts(0);
    }
  }, [lockUntil]);

  const handleLoginAttempt = async (email: string, password: string) => {
    // Rate limiting check
    if (!SecureValidator.checkRateLimit(`login_${email}`, 3, 15 * 60 * 1000)) {
      logSecurityViolation('Rate limit exceeded', 'auth', email);
      throw new Error('Too many login attempts. Please try again later.');
    }

    if (isLocked) {
      logSecurityViolation('Login attempt while locked', 'auth', email);
      throw new Error(`Account locked. Try again after ${lockUntil?.toLocaleTimeString()}`);
    }

    // Validate email format
    if (!SecureValidator.validateEmail(email)) {
      logSecurityViolation('Invalid email format', 'auth', email);
      throw new Error('Invalid email format');
    }

    // Check password strength for security awareness
    const passwordCheck = SecureValidator.validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      console.warn('Weak password detected during login');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        logFailedLogin(email, error.message);

        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockUntilTime = new Date(Date.now() + LOCKOUT_DURATION);
          setIsLocked(true);
          setLockUntil(lockUntilTime);
          logSecurityViolation('Account locked due to failed attempts', 'auth', email);
          throw new Error(`Too many failed attempts. Account locked until ${lockUntilTime.toLocaleTimeString()}`);
        }

        throw error;
      }

      // Reset failed attempts on successful login
      setFailedAttempts(0);
      if (data.user) {
        logSuccessfulLogin(data.user.id);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const checkAdminAccess = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Use the existing is_admin function that's already defined in types
      const { data, error } = await supabase.rpc('is_admin');

      if (error) {
        console.error('Admin check failed:', error);
        logSecurityViolation('Admin check failed', 'auth', user.id);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Admin check error:', error);
      logSecurityViolation('Admin check error', 'auth', user.id);
      return false;
    }
  };

  const validateSessionSecurity = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      // Check if token is about to expire (within 5 minutes)
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;

      if (expiresAt && (expiresAt - now) < fiveMinutes) {
        console.warn('Session about to expire, refreshing...');
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          logSecurityViolation('Session refresh failed', 'auth', user?.id);
          return false;
        }
      }

      return true;
    } catch (error) {
      logSecurityViolation('Session validation failed', 'auth', user?.id);
      return false;
    }
  };

  return {
    handleLoginAttempt,
    checkAdminAccess,
    validateSessionSecurity,
    failedAttempts,
    isLocked,
    lockUntil
  };
};
