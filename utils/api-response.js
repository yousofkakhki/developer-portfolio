import { NextResponse } from 'next/server';

const API_SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

export function apiJson(body, init = {}) {
  const headers = new Headers(API_SECURITY_HEADERS);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  return NextResponse.json(body, { ...init, headers });
}
