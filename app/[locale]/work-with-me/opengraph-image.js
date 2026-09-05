import { ImageResponse } from 'next/og';
import SocialCard from '@/app/components/social-card';

export const alt = 'Work with Yousef Kakhki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }) {
  const { locale: routeLocale } = await params;
  const locale = routeLocale === 'fa' ? 'fa' : 'en';

  return new ImageResponse(
    <SocialCard
      locale={locale}
      eyebrow={locale === 'fa' ? 'همکاری' : 'Work with me'}
      title={locale === 'fa' ? 'معماری راهکار و رهبری مهندسیِ همراه با اجرا' : 'Hands-on solutions architecture and engineering leadership'}
      description={locale === 'fa'
        ? 'برای تیم‌هایی که سیستم‌های بک‌اند، پلتفرم و رسانهٔ بلادرنگ قابل‌اعتماد می‌سازند.'
        : 'For teams building reliable backend, platform, and real-time media systems.'}
      kind={locale === 'fa' ? 'همکاری حرفه‌ای' : 'Professional collaboration'}
    />,
    size,
  );
}
