import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/footer";
import ScrollToTop from "../components/helper/scroll-to-top";
import Navbar from "../components/navbar";
import StructuredData from "../components/structured-data";
import "../css/card.scss";
import "../css/globals.scss";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  const messages = await getMessages({ locale });
  const metadata = messages.metadata || {};
  const personal = messages.personal || {};
  
  const title = metadata.title || 'Yousef Kakhki | System Architect & Infrastructure Lead';
  const description = metadata.description || personal.description || 'Portfolio of Yousef Kakhki – System Architect & Technical Lead. M.Sc. in System Design. Specializing in WebRTC/HLS streaming, high-frequency trading engines, embedded Linux, and DevOps.';
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.ir';
  
  // Generate locale-specific URLs
  const currentUrl = `${siteUrl}/${locale}`;
  const enUrl = `${siteUrl}/en`;
  const faUrl = `${siteUrl}/fa`;
  
  // Locale-specific OG image alt text
  const ogImageAlt = locale === 'fa' 
    ? 'یوسف کاخکی - معمار سیستم و مدیر نرم‌افزار'
    : 'Yousef Kakhki – System Architect & Infrastructure Lead';

  return {
    title: {
      default: title,
      template: '%s | Yousef Kakhki – System Architect'
    },
    description,
    keywords: [
      'Yousef Kakhki',
      'System Architect',
      'Head of Software',
      'LiveKit Expert',
      'NATS JetStream',
      'Fintech Lead',
      'WebRTC',
      'Node.js Architect',
      'Linux Kernel',
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
          url: `${siteUrl}/avatar.png`,
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
        url: `${siteUrl}/avatar.png`,
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
      // Add your verification codes here if needed
    }
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Determine text direction based on locale
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const lang = locale;

  return (
    <html lang={lang} dir={dir}>
      <head>
        <StructuredData locale={locale} messages={messages} />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.ir'}/${locale}`} />
        {/* Hreflang tags for proper bilingual indexing */}
        <link rel="alternate" hreflang="en" href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.ir'}/en`} />
        <link rel="alternate" hreflang="fa" href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.ir'}/fa`} />
        <link rel="alternate" hreflang="x-default" href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.ir'}/en`} />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Additional SEO meta tags */}
        <meta name="geo.region" content="IR-07" />
        <meta name="geo.placename" content="Tehran" />
        <meta name="geo.position" content="35.6892;51.3890" />
        <meta name="ICBM" content="35.6892, 51.3890" />
        {locale === 'fa' && (
          <>
            {/* Preconnect to Google Fonts for faster loading - required before font loading */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* Load Vazirmatn with optimized display strategy */}
            <link 
              href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap&preconnect" 
              rel="stylesheet" 
            />
            {/* Font optimization styles */}
            <style dangerouslySetInnerHTML={{ __html: `
              @font-face {
                font-family: 'Vazirmatn';
                font-display: swap;
                font-weight: 400;
              }
              /* Vazirmatn font loaded for Persian locale with optimized loading */
            ` }} />
          </>
        )}
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          {/* Skip to main content link for accessibility */}
          <a 
            href="#main-content" 
            className="skip-to-main focus:top-0"
            aria-label="Skip to main content"
          >
            {locale === 'fa' ? 'رفتن به محتوای اصلی' : 'Skip to main content'}
          </a>
          <ToastContainer />
          <main 
            id="main-content" 
            className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white overflow-x-hidden"
            role="main"
            aria-label={locale === 'fa' ? 'محتوای اصلی' : 'Main content'}
          >
            <Navbar />
            {children}
            <ScrollToTop />
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
      {process.env.NEXT_PUBLIC_GTM && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
      )}
    </html>
  );
}

