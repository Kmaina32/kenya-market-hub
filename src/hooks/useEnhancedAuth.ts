
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { supabase } from '@/integrations/supabase/client';
import { SECURITY_CONFIG } from '@/utils/securityConfig';

export const useEnhancedAuth = () => {
  const { user } = useAuth();
  const { logFailedLogin, logSuccessfulLogin } = useSecurityAudit();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);

  const { LOGIN_ATTEMPTS: MAX_FAILED_ATTEMPTS, LOCKOUT_DURATION } = SECURITY_CONFIG.RATE_LIMITS;

  useEffect(() => {
    if (lockUntil && new Date() > lockUntil) {
      setIsLocked(false);
      setLockUntil(null);
      setFailedAttempts(0);
    }
  }, [lockUntil]);

  const handleLoginAttempt = async (email: string, password: string) => {
    if (isLocked) {
      throw new Error(`Account locked. Try again after ${lockUntil?.toLocaleTimeString()}`);
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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
      const { data, error } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });

      if (error) {
        console.error('Admin check failed:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  };

  return {
    handleLoginAttempt,
    checkAdminAccess,
    failedAttempts,
    maxAttempts: MAX_FAILED_ATTEMPTS,
    isLocked,
    lockUntil
  };
};
