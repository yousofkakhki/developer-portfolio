import { NextResponse } from 'next/server';

// Security headers middleware
export function securityHeaders(request, response = null) {
  if (!response) {
    response = NextResponse.next();
  }
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Next.js emits inline hydration data, so nonce-based CSP is a separate migration.
  // Production never permits eval; development retains it only for local tooling.
  const scriptSource = "script-src 'self' 'unsafe-inline'" +
    (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '') +
    ' https://www.googletagmanager.com https://www.google.com https://static.cloudflareinsights.com';
  const csp = [
    "default-src 'self'",
    scriptSource,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.telegram.org https://www.google.com https://dev.to https://ip-api.com https://static.cloudflareinsights.com",
    "frame-src https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // HSTS (if using HTTPS)
  if (request.url.startsWith('https://')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return response;
}

