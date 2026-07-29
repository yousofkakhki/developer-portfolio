export const revalidate = 60;
export const dynamicParams = false;

import Link from 'next/link';
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
    <div className="py-16 max-w-3xl mx-auto px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/en/blog"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-8 transition-colors text-sm"
      >
        <span>←</span> All posts
      </Link>

      <div className="mb-10">
        <div className="w-12 h-1 rounded mb-4" style={{ backgroundColor: meta.color }} />
        <h1 className="text-3xl font-semibold text-slate-100 mb-3">{meta.title}</h1>
        <p className="text-slate-400 leading-relaxed">{meta.description}</p>
      </div>

      <ul className="space-y-6">
          {posts.map(post => (
            <li key={post.slug} className="border border-slate-700 bg-slate-800/50 rounded p-5 hover:border-slate-500 transition-colors">
              <Link href={`/en/blog/${post.slug}`} className="block">
                <h2 className="text-lg font-medium text-slate-100 mb-1 hover:text-white transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">{post.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span>·</span>
                  <span>{post.reading_time_minutes} min read</span>
                </div>
              </Link>
            </li>
          ))}
      </ul>

      <div className="mt-16 pt-8 border-t border-slate-800">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Other topics</h2>
        <div className="flex flex-wrap gap-3">
          {otherPillars.map(([slug, p]) => (
            <Link
              key={slug}
              href={`/en/blog/pillar/${slug}`}
              className="px-3 py-1.5 text-sm text-slate-300 border border-slate-700 rounded hover:border-slate-500 hover:text-slate-100 transition-colors"
            >
              {p.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
