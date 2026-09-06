import { ImageResponse } from 'next/og';
import SocialCard from '@/app/components/social-card';

export const alt = 'Engineering writing by Yousef Kakhki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }) {
  const { locale: routeLocale } = await params;
  const locale = routeLocale === 'fa' ? 'fa' : 'en';

  return new ImageResponse(
    <SocialCard
      locale={locale}
      eyebrow={locale === 'fa' ? 'نوشتار فنی' : 'Engineering field notes'}
      title={locale === 'fa' ? 'بک‌اند، سیستم‌های توزیع‌شده و رسانهٔ بلادرنگ' : 'Backend, distributed systems, and real-time media'}
      description={locale === 'fa'
        ? 'مطالعات موردی تولید، معماری‌های مرجع، راهنماهای طراحی و یادداشت‌های مهندسی سایت.'
        : 'Production case studies, reference architectures, design guides, and site-engineering notes.'}
      kind={locale === 'fa' ? 'کتابخانهٔ نوشتار' : 'Writing index'}
    />,
    size,
  );
}
