
import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestTracker {
  count: number;
  resetTime: number;
}

export const useRateLimiting = (config: RateLimitConfig) => {
  const [requests, setRequests] = useState<Map<string, RequestTracker>>(new Map());

  const isRateLimited = useCallback((key: string): boolean => {
    const now = Date.now();
    const tracker = requests.get(key);

    if (!tracker || now > tracker.resetTime) {
      // Reset or initialize tracker
      setRequests(prev => new Map(prev).set(key, {
        count: 1,
        resetTime: now + config.windowMs
      }));
      return false;
    }

    if (tracker.count >= config.maxRequests) {
      return true;
    }

    // Increment count
    setRequests(prev => new Map(prev).set(key, {
      ...tracker,
      count: tracker.count + 1
    }));

    return false;
  }, [config, requests]);

  const getRemainingTime = useCallback((key: string): number => {
    const tracker = requests.get(key);
    if (!tracker) return 0;
    
    return Math.max(0, tracker.resetTime - Date.now());
  }, [requests]);

  return { isRateLimited, getRemainingTime };
};
