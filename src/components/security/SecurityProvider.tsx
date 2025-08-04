
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { SECURITY_CONFIG } from '@/utils/securityConfig';

interface SecurityContextType {
  isSecure: boolean;
  lastActivity: Date;
  sessionWarning: boolean;
  refreshSession: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const { logSecurityEvent } = useSecurityAudit();
  const [lastActivity, setLastActivity] = useState(new Date());
  const [sessionWarning, setSessionWarning] = useState(false);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(new Date());
    
    const events = ['click', 'keypress', 'scroll', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Session timeout monitoring
  useEffect(() => {
    if (!session) return;

    const checkSession = () => {
      const now = new Date().getTime();
      const lastActivityTime = lastActivity.getTime();
      const timeSinceActivity = now - lastActivityTime;

      // Warn 5 minutes before timeout
      const warningTime = SECURITY_CONFIG.SESSION.TIMEOUT - (5 * 60 * 1000);
      
      if (timeSinceActivity > warningTime && !sessionWarning) {
        setSessionWarning(true);
        logSecurityEvent('session_warning', { timeSinceActivity });
      }

      // Auto-logout after timeout
      if (timeSinceActivity > SECURITY_CONFIG.SESSION.TIMEOUT) {
        logSecurityEvent('session_timeout', { timeSinceActivity });
        // Force logout will be handled by auth context
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastActivity, session, sessionWarning, logSecurityEvent]);

  const refreshSession = () => {
    setLastActivity(new Date());
    setSessionWarning(false);
  };

  const value = {
    isSecure: !!session,
    lastActivity,
    sessionWarning,
    refreshSession
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
