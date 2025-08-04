
export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP_HEADER: `
    default-src 'self';
    script-src 'self' 'wasm-unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' wss: https://qkiupbzdobltnmpkacsu.supabase.co https://maps.googleapis.com;
    frame-src 'self' https://maps.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),

  // Rate limiting
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    API_REQUESTS_PER_MINUTE: 60,
  },

  // Input validation
  INPUT_VALIDATION: {
    MAX_TEXT_LENGTH: 10000,
    MAX_EMAIL_LENGTH: 254,
    MIN_PASSWORD_LENGTH: 8,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  },

  // Session security
  SESSION: {
    TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD: 15 * 60 * 1000, // 15 minutes
  }
};

export const applySecurityHeaders = () => {
  // Only apply CSP in production to avoid development issues
  if (import.meta.env.PROD) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = SECURITY_CONFIG.CSP_HEADER;
    document.head.appendChild(meta);
  }
};
