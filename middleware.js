import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';
import { securityHeaders } from './middleware-security';

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

export default function middleware(request) {
  // Check if locale is already in the path
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Locale detection is disabled, so root always redirects to the canonical default locale.
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
