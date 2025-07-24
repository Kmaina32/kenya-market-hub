
import DOMPurify from 'dompurify';

export class SecureValidator {
  // XSS prevention for HTML content
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  // SQL injection prevention for search queries
  static sanitizeSearchQuery(query: string): string {
    return query
      .replace(/['"\\]/g, '') // Remove quotes and backslashes
      .replace(/[;<>]/g, '') // Remove potential SQL operators
      .trim()
      .substring(0, 100); // Limit length
  }

  // Validate and sanitize email
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = email.toLowerCase().trim();
    return emailRegex.test(sanitized) && sanitized.length <= 254;
  }

  // Validate phone number
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  }

  // Validate UUID
  static validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Password strength validation
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    return {
      isValid: score >= 3,
      score,
      feedback
    };
  }

  // Rate limiting check
  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const stored = localStorage.getItem(`rate_limit_${key}`);
    
    if (!stored) {
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({
        attempts: 1,
        resetTime: now + windowMs
      }));
      return true;
    }

    const data = JSON.parse(stored);
    
    if (now > data.resetTime) {
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({
        attempts: 1,
        resetTime: now + windowMs
      }));
      return true;
    }

    if (data.attempts >= maxAttempts) {
      return false;
    }

    data.attempts += 1;
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(data));
    return true;
  }

  // Content Security Policy violation handler
  static handleCSPViolation(violation: SecurityPolicyViolationEvent): void {
    console.warn('CSP Violation:', {
      blockedURI: violation.blockedURI,
      documentURI: violation.documentURI,
      originalPolicy: violation.originalPolicy,
      violatedDirective: violation.violatedDirective
    });

    // Log to security audit system
    fetch('/api/security/csp-violation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blockedURI: violation.blockedURI,
        documentURI: violation.documentURI,
        violatedDirective: violation.violatedDirective,
        timestamp: new Date().toISOString()
      })
    }).catch(error => {
      console.error('Failed to log CSP violation:', error);
    });
  }

  // Secure form data sanitization
  static sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeHtml(value).trim();
      } else if (typeof value === 'number') {
        sanitized[key] = isNaN(value) ? 0 : value;
      } else if (typeof value === 'boolean') {
        sanitized[key] = Boolean(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeHtml(item).trim() : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Initialize CSP violation reporting
if (typeof window !== 'undefined') {
  document.addEventListener('securitypolicyviolation', SecureValidator.handleCSPViolation);
}
