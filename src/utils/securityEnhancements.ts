import { supabase } from '@/integrations/supabase/client';

// Enhanced security utilities and headers
export const SecurityHeaders = {
  // Content Security Policy
  CSP: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' https://maps.googleapis.com https://*.supabase.co",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'img-src': "'self' data: https: blob:",
    'font-src': "'self' https://fonts.gstatic.com",
    'connect-src': "'self' https://*.supabase.co https://maps.googleapis.com wss://*.supabase.co",
    'frame-src': "'none'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'"
  },

  // Additional security headers
  additional: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(self), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-XSS-Protection': '1; mode=block'
  }
};

// Input sanitization utilities
export const sanitizeInput = {
  // Remove potentially dangerous HTML tags and attributes
  html: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },

  // Sanitize for SQL injection prevention (basic)
  sql: (input: string): string => {
    return input
      .replace(/['";\\]/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  },

  // Email validation and sanitization
  email: (email: string): string => {
    return email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '');
  },

  // Phone number sanitization
  phone: (phone: string): string => {
    return phone.replace(/[^\d+()-\s]/g, '');
  },

  // General text sanitization
  text: (text: string): string => {
    return text.trim().replace(/[<>'"&]/g, (match) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });
  }
};

// Rate limiting utilities (client-side)
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const keyRequests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = keyRequests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);

    if (validRequests.length >= maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

// Security validation utilities
export const securityValidation = {
  // Validate file uploads
  validateFileUpload: (file: File, allowedTypes: string[], maxSizeMB: number): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }

    return { valid: true };
  },

  // Validate URLs
  validateUrl: (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  },

  // Check password strength
  validatePasswordStrength: (password: string): { strong: boolean; suggestions: string[] } => {
    const suggestions: string[] = [];
    
    if (password.length < 8) {
      suggestions.push('Use at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      suggestions.push('Include uppercase letters');
    }
    if (!/[a-z]/.test(password)) {
      suggestions.push('Include lowercase letters');
    }
    if (!/\d/.test(password)) {
      suggestions.push('Include numbers');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      suggestions.push('Include special characters');
    }

    return {
      strong: suggestions.length === 0,
      suggestions
    };
  }
};

// Session security utilities
export const sessionSecurity = {
  // Generate secure session token
  generateSecureToken: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Validate session integrity
  validateSession: async (token: string): Promise<boolean> => {
    try {
      // This would integrate with your session management system
      const { data: { session } } = await supabase.auth.getSession();
      return session !== null;
    } catch {
      return false;
    }
  }
};
