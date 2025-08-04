
// Security headers configuration for enhanced protection
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'nonce-{NONCE}' https://cdn.jsdelivr.net https://maps.googleapis.com",
    "style-src 'self' 'nonce-{NONCE}' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://qkiupbzdobltnmpkacsu.supabase.co https://maps.googleapis.com",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "media-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'"
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()'
  ].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Generate a random nonce for CSP
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Function to apply security headers with nonce
export const applySecurityHeaders = (response: Response, nonce?: string): Response => {
  const headers = new Headers(response.headers);
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    let headerValue = value;
    if (key === 'Content-Security-Policy' && nonce) {
      headerValue = value.replace('{NONCE}', nonce);
    }
    headers.set(key, headerValue);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
