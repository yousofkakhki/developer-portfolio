import { ImageResponse } from 'next/og';
import SocialCard from '@/app/components/social-card';

export const alt = 'Systems work by Yousef Kakhki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }) {
  const { locale: routeLocale } = await params;
  const locale = routeLocale === 'fa' ? 'fa' : 'en';

  return new ImageResponse(
    <SocialCard
      locale={locale}
      eyebrow={locale === 'fa' ? 'نمونه‌کارهای منتخب' : 'Selected systems work'}
      title={locale === 'fa' ? 'معماری، پیاده‌سازی و شواهد پروژه' : 'Architecture, implementation, and project evidence'}
      description={locale === 'fa'
        ? 'مطالعات موردی و نمایه‌های کوتاه از رسانهٔ بلادرنگ، پرداخت، هوش مصنوعی و سیستم‌های نهفته.'
        : 'Case studies and concise snapshots across real-time media, payments, applied AI, and embedded systems.'}
      kind={locale === 'fa' ? 'نمونه‌کارها' : 'Project index'}
    />,
    size,
  );
}
