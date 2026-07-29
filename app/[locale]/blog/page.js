// @flow strict
export const revalidate = 60;
export const dynamicParams = true;

import { getTranslations } from 'next-intl/server';
import { getLocalBlogs } from "@/utils/data/local-blogs";
import { PILLARS, getActivePillarSlugs } from '@/utils/data/blog-pillars';
import BlogPageClient from "./blog-page-client";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const isEn = locale !== 'fa';
  const title = isEn
    ? 'Engineering Blog: WebRTC, Backend & Systems'
    : 'وبلاگ مهندسی — Next.js، معماری وب و تجربهٔ چندزبانه';
  const description = isEn
    ? 'Technical articles by Yousef Kakhki on WebRTC, LiveKit, distributed backend architecture, real-time media, and bilingual Next.js engineering.'
    : 'مقاله‌های فنی یوسف کاخکی دربارهٔ معماری وب، Next.js، بین‌المللی‌سازی، پشتیبانی RTL و ساخت محصولات چندزبانه.';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: { en: `${siteUrl}/en/blog`, fa: `${siteUrl}/fa/blog` },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${locale}/blog`,
      title,
      description,
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations('blog');

  const blogs = getLocalBlogs(locale);
  const activePillars = locale === 'en' ? getActivePillarSlugs(blogs) : [];
  const allTags = [...new Set(blogs.flatMap(blog => blog?.tag_list || []))].slice(0, 10);

  return (
    <div>
      {/* Pillar topic nav */}
      {locale === 'en' && (
        <div className="pt-10 pb-2 max-w-3xl mx-auto px-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Topics</p>
          <div className="flex flex-wrap gap-2">
            {activePillars.map(slug => (
              <a
                key={slug}
                href={`/en/blog/pillar/${slug}`}
                className="px-3 py-1 text-sm rounded border border-slate-700 text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors"
                style={{ borderLeftColor: PILLARS[slug].color, borderLeftWidth: 3 }}
              >
                {PILLARS[slug].title}
              </a>
            ))}
          </div>
        </div>
      )}

      <BlogPageClient
        blogs={blogs}
        allTags={allTags}
        locale={locale}
        translations={{
          title: t('allBlogs') || 'All Blog Posts',
          searchPlaceholder: t('searchPlaceholder') || 'Search articles...',
          allTags: t('allTags') || 'All',
          noResults: t('noResults') || 'No articles found',
          noResultsDescription: t('noResultsDescription') || 'Try adjusting your search or filter.',
          clearFilters: t('clearFilters') || 'Clear filters',
        }}
      />
    </div>
  );
}
