import { ImageResponse } from 'next/og';
import SocialCard from '@/app/components/social-card';
import { getLocalBlogBySlug } from '@/utils/data/local-blogs';

export const alt = 'Technical article by Yousef Kakhki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const articleTypeLabels = {
  en: {
    'production-case-study': 'Production case study',
    'reference-architecture': 'Reference architecture',
    'architecture-essay': 'Architecture essay',
    'design-guide': 'Design guide',
    'design-hypothesis': 'Design hypothesis',
    'site-engineering': 'Site engineering',
  },
  fa: {
    'production-case-study': 'مطالعهٔ موردی تولید',
    'reference-architecture': 'معماری مرجع',
    'architecture-essay': 'یادداشت معماری',
    'design-guide': 'راهنمای طراحی',
    'design-hypothesis': 'فرضیهٔ طراحی',
    'site-engineering': 'مهندسی سایت',
  },
};

export default async function OpenGraphImage({ params }) {
  const { locale: routeLocale, slug } = await params;
  const locale = routeLocale === 'fa' ? 'fa' : 'en';
  const blog = getLocalBlogBySlug(slug, locale);
  const articleType = blog?.article_type;

  return new ImageResponse(
    <SocialCard
      locale={locale}
      eyebrow={articleTypeLabels[locale][articleType] || (locale === 'fa' ? 'مقالهٔ فنی' : 'Technical article')}
      title={blog?.title || (locale === 'fa' ? 'مقالهٔ فنی' : 'Technical article')}
      description={blog?.description}
      kind={locale === 'fa' ? 'نوشتار' : 'Writing'}
    />,
    size,
  );
}
