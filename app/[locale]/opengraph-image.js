import { ImageResponse } from 'next/og';
import SocialCard from '@/app/components/social-card';
import { careerFacts, localized } from '@/utils/data/career-facts';

export const alt = 'Yousef Kakhki — solutions architecture and engineering leadership';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }) {
  const { locale: routeLocale } = await params;
  const locale = routeLocale === 'fa' ? 'fa' : 'en';
  const title = localized(careerFacts.identity.primaryTitle, locale);
  const description = localized(careerFacts.identity.description, locale);

  return new ImageResponse(
    <SocialCard
      locale={locale}
      eyebrow={locale === 'fa' ? 'پورتفولیوی مهندسی' : 'Engineering portfolio'}
      title={title}
      description={description}
      kind={locale === 'fa' ? 'پروفایل حرفه‌ای' : 'Professional profile'}
    />,
    size,
  );
}
