export const revalidate = 60;
export const dynamicParams = false;

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getLocalBlogs } from '@/utils/data/local-blogs';
import { PILLARS, getActivePillarSlugs, getPillarForTags } from '@/utils/data/blog-pillars';

export async function generateStaticParams() {
  return getActivePillarSlugs(getLocalBlogs('en')).map(pillar => ({ locale: 'en', pillar }));
}

export async function generateMetadata({ params }) {
  const { pillar, locale } = await params;
  const meta = PILLARS[pillar];
  if (locale !== 'en' || !meta) return {};
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const url = `${siteUrl}/en/blog/pillar/${pillar}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        'x-default': url,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: meta.title,
      description: meta.description,
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function PillarPage({ params }) {
  const { pillar, locale } = await params;
  const meta = PILLARS[pillar];
  if (locale !== 'en' || !meta) notFound();

  const allBlogs = getLocalBlogs(locale);
  const t = await getTranslations({ locale: 'en', namespace: 'blog' });
  const posts = allBlogs.filter(blog => getPillarForTags(blog.tag_list || []) === pillar);
  if (posts.length === 0) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const activePillars = getActivePillarSlugs(allBlogs);
  const otherPillars = Object.entries(PILLARS).filter(([k]) => k !== pillar && activePillars.includes(k));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/en/blog/pillar/${pillar}#collection`,
    name: meta.title,
    description: meta.description,
    url: `${siteUrl}/en/blog/pillar/${pillar}`,
    isPartOf: { '@id': `${siteUrl}/#website` },
    author: { '@id': `${siteUrl}/#person` },
    hasPart: posts.map(p => ({
      '@type': 'Article',
      headline: p.title,
      url: `${siteUrl}/${locale}/blog/${p.slug}`,
      datePublished: p.published_at,
    })),
  };

  return (
    <div className="brand-route brand-pillar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/en/blog" className="brand-route__back">
        <span aria-hidden="true">←</span>
        <span>All field notes</span>
      </Link>

      <header className="brand-route__header brand-pillar__header">
        <div>
          <p className="brand-route__eyebrow">Topic guide / {String(posts.length).padStart(2, '0')} notes</p>
          <h1 className="brand-route__title">{meta.title}</h1>
        </div>
        <p className="brand-route__lead">{meta.description}</p>
      </header>

      <ol className="brand-pillar__list">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link href={`/en/blog/${post.slug}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className={`brand-article-type brand-article-type--${post.article_type}`}>{t(`articleTypes.${post.article_type}`)}</p>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </div>
              <small>
                {new Date(post.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                {' · '}{post.reading_time_minutes} min
              </small>
            </Link>
          </li>
        ))}
      </ol>

      <nav className="brand-pillar__other" aria-label="Other topic guides">
        <h2>Other topic guides</h2>
        <div>
          {otherPillars.map(([slug, other]) => (
            <Link key={slug} href={`/en/blog/pillar/${slug}`}>
              {other.title} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
