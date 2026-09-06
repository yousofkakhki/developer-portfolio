import { ImageResponse } from 'next/og';
import SocialCard from '@/app/components/social-card';
import { getLocalizedProject, getProjectBySlug } from '@/utils/data/project-catalog';

export const alt = 'Project case study by Yousef Kakhki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }) {
  const { locale: routeLocale, slug } = await params;
  const locale = routeLocale === 'fa' ? 'fa' : 'en';
  const project = getLocalizedProject(getProjectBySlug(slug), locale);

  return new ImageResponse(
    <SocialCard
      locale={locale}
      eyebrow={locale === 'fa' ? 'مطالعهٔ موردی' : 'Case study'}
      title={project?.name || (locale === 'fa' ? 'پروژهٔ مهندسی' : 'Engineering project')}
      description={project?.description}
      kind={locale === 'fa' ? 'شواهد پروژه' : 'Project evidence'}
    />,
    size,
  );
}
