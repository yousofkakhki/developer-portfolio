import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Script from 'next/script';
import { IBM_Plex_Mono, Inter, Manrope, Vazirmatn } from "next/font/google";

import Footer from "../components/footer";
import ScrollToTop from "../components/helper/scroll-to-top";
import Navbar from "../components/navbar";
import StructuredData from "../components/structured-data";
import { careerFacts, localized } from '@/utils/data/career-facts';
import "../css/globals.scss";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

const manrope = Manrope({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-manrope'
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600']
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  preload: true,
  variable: '--font-vazirmatn',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  const messages = await getMessages({ locale });
  const metadata = messages.metadata || {};
  const primaryTitle = localized(careerFacts.identity.primaryTitle, locale);
  const title = `${careerFacts.identity.name} | ${primaryTitle}`;
  const description = metadata.description || localized(careerFacts.identity.description, locale);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  
  // Generate locale-specific URLs
  const currentUrl = `${siteUrl}/${locale}`;
  const enUrl = `${siteUrl}/en`;
  const faUrl = `${siteUrl}/fa`;
  
  // Locale-specific OG image alt text
  const ogImageAlt = `${localized(careerFacts.identity.localizedName, locale)} – ${primaryTitle}`;
  const ogImagePath = locale === 'fa' ? '/og-fa.png' : '/og-en.png';

  return {
    title: {
      default: title,
      template: '%s | Yousef Kakhki'
    },
    description,
    keywords: [
      'Yousef Kakhki',
      primaryTitle,
      'LiveKit Expert',
      'NATS JetStream',
      'Fintech Lead',
      'WebRTC',
      'Node.js Architect',
      'Linux Kernel',
      'Docker Swarm',
      'Kubernetes',
      'Embedded Linux',
      'High-Frequency Trading',
      'Tehran',
      locale === 'fa' ? 'یوسف کاخکی' : '',
      locale === 'fa' ? 'معمار سیستم' : '',
      locale === 'fa' ? 'مدیر نرم‌افزار' : '',
      locale === 'fa' ? 'فین‌تک' : '',
      locale === 'fa' ? 'وب‌آر‌تی‌سی' : ''
    ].filter(Boolean),
    authors: [{ name: 'Yousef Kakhki' }],
    creator: 'Yousef Kakhki',
    publisher: 'Yousef Kakhki',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': enUrl,
        'fa': faUrl,
        'x-default': enUrl
      }
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      url: currentUrl,
      siteName: 'Yousef Kakhki Portfolio',
      title,
      description,
      images: [
        {
          url: `${siteUrl}${ogImagePath}`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: 'image/png'
        }
      ],
      // Add alternate locales for OG
      alternateLocale: locale === 'fa' ? 'en_US' : 'fa_IR'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{
        url: `${siteUrl}${ogImagePath}`,
        alt: ogImageAlt
      }],
      creator: '@yousefkakhki',
      site: '@yousefkakhki'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
      }),
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
        other: {
          'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        },
      }),
    }
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM;
  const hasGtm = /^GTM-[A-Z0-9]+$/.test(gtmId || '');
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const accessibility = messages.accessibility || {};
  const skipToMain = accessibility.skipToMain || (locale === 'fa' ? 'رفتن به محتوای اصلی' : 'Skip to main content');

  // Determine text direction based on locale
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const lang = locale;

  return (
    <html lang={lang} dir={dir}>
      <head>
        <StructuredData locale={locale} />
        <meta name="theme-color" content="#08111F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/brand/app-icon.svg" />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${plexMono.variable} ${vazirmatn.variable} ${locale === 'fa' ? vazirmatn.className : inter.className} site-body overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          {/* Skip to main content link for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-800 focus:text-slate-100 focus:rounded focus:border focus:border-slate-600"
            aria-label={skipToMain}
          >
            {skipToMain}
          </a>

          <Navbar />
          <main 
            id="main-content" 
            className="site-main relative min-h-screen overflow-x-hidden"
            role="main"
            aria-label={locale === 'fa' ? 'محتوای اصلی' : 'Main content'}
            tabIndex={-1}
          >
            {children}
            <ScrollToTop />
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
      {hasGtm && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}
          </Script>
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`}
          />
        </>
      )}
    </html>
  );
}
