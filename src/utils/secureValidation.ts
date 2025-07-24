
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  feedback: string[];
}

export class SecureValidator {
  private static rateLimitStore = new Map<string, RateLimitEntry>();

  static checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.rateLimitStore.get(key);

    if (!entry) {
      this.rateLimitStore.set(key, { count: 1, firstAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - entry.firstAttempt > windowMs) {
      this.rateLimitStore.set(key, { count: 1, firstAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= maxAttempts) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePasswordStrength(password: string): PasswordStrengthResult {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain uppercase letters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain lowercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain special characters');
    }

    return {
      isValid: score >= 3,
      score,
      feedback
    };
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}
