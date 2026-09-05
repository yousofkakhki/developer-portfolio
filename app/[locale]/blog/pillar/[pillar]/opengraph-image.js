import { ImageResponse } from 'next/og';
import SocialCard from '@/app/components/social-card';
import { PILLARS } from '@/utils/data/blog-pillars';

export const alt = 'Engineering topic guide by Yousef Kakhki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }) {
  const { pillar } = await params;
  const topic = PILLARS[pillar];

  return new ImageResponse(
    <SocialCard
      locale="en"
      eyebrow="Engineering topic guide"
      title={topic?.title || 'Engineering field notes'}
      description={topic?.description}
      kind="Topic guide"
    />,
    size,
  );
}
