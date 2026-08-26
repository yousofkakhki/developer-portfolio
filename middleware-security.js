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
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(self), camera=()');
  // Next.js emits inline hydration data, so nonce-based CSP is a separate migration.
  // ONNX Runtime Web requires this WebAssembly-only directive; ordinary eval is never allowed.
  // Keep the exact directive visible for the security regression test and separate
  // its construction from the rest of the source list.
  const wasmExecutionDirective = "'wasm-unsafe-eval'";
  const scriptSource = "script-src 'self' 'unsafe-inline' " + wasmExecutionDirective +
    " https://www.googletagmanager.com https://www.google.com https://static.cloudflareinsights.com";
  const csp = [
    "default-src 'self'",
    scriptSource,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' blob: https://api.telegram.org https://www.google.com https://dev.to https://ip-api.com https://static.cloudflareinsights.com https://ai.kakhki.me wss://ai.kakhki.me",
    "frame-src 'self' https://ai.kakhki.me https://www.google.com",
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
