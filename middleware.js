import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextRequest, NextResponse } from 'next/server';
import { securityHeaders } from './middleware-security';

// Function to detect if user is from Iran based on IP
async function detectIranIP(request) {
  try {
    // Get the IP from headers (works with most proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0]?.trim() || realIp || '';

    // If we have an IP, try to detect country
    if (ip && !ip.startsWith('127.') && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        // Using ip-api.com (free tier, no API key needed)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
          signal: AbortSignal.timeout(2000) // 2 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.countryCode === 'IR') {
            return 'fa';
          }
        }
      } catch (error) {
        // Fallback to Accept-Language if IP detection fails
        console.log('IP detection failed, using Accept-Language fallback');
      }
    }

    // Fallback: Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    if (acceptLanguage.includes('fa') || acceptLanguage.includes('ar')) {
      return 'fa';
    }

    return defaultLocale;
  } catch (error) {
    console.error('Error detecting locale:', error);
    return defaultLocale;
  }
}

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix in URLs
  localePrefix: 'always',

  // Locale auto-detection disabled — always default to EN
  localeDetection: false
});

export default async function middleware(request) {
  // Check if locale is already in the path
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Always redirect root to /en (locale auto-detection disabled)
  if (!pathnameHasLocale && pathname === '/') {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    const redirectResponse = NextResponse.redirect(newUrl);
    return securityHeaders(request, redirectResponse);
  }

  // Otherwise, use the intl middleware
  const response = intlMiddleware(request);
  return securityHeaders(request, response);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fa|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};

