// @flow strict
export const revalidate = 60;
export const dynamicParams = true;

import { getTranslations } from 'next-intl/server';
import { getLocalBlogs } from "@/utils/data/local-blogs";
import { PILLARS, getActivePillarSlugs } from '@/utils/data/blog-pillars';
import Link from 'next/link';
import BlogPageClient from "./blog-page-client";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const isEn = locale !== 'fa';
  const title = isEn
    ? 'Engineering Blog: WebRTC, Backend & Systems'
    : 'وبلاگ مهندسی بک‌اند، سیستم‌های توزیع‌شده و WebRTC';
  const description = isEn
    ? 'Technical articles by Yousef Kakhki on WebRTC, LiveKit, distributed backend architecture, real-time media, and bilingual Next.js engineering.'
    : 'نوشته‌های فنی یوسف کاخکی دربارهٔ مهندسی بک‌اند، سیستم‌های توزیع‌شده، WebRTC، LiveKit و معماری رسانهٔ بلادرنگ.';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: {
        en: `${siteUrl}/en/blog`,
        fa: `${siteUrl}/fa/blog`,
        'x-default': `${siteUrl}/en/blog`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${locale}/blog`,
      title,
      description,
      locale: isEn ? 'en_US' : 'fa_IR',
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations('blog');

  const blogs = getLocalBlogs(locale);
  const activePillars = locale === 'en' ? getActivePillarSlugs(blogs) : [];
  const allTags = [...new Set(blogs.flatMap(blog => blog?.tag_list || []))]
    .sort((left, right) => left.localeCompare(right, locale));

  return (
    <div className="brand-route brand-publications">
      <header className="brand-route__header brand-publications__header">
        <div>
          <p className="brand-route__eyebrow">{t('indexEyebrow')}</p>
          <h1 className="brand-route__title">{t('allBlogs') || 'All Blog Posts'}</h1>
        </div>
        {locale === 'en' && activePillars.length > 0 && (
          <nav className="brand-publications__topics" aria-label={t('topics')}>
            <p>{t('topics')}</p>
            <div>
              {activePillars.map(slug => (
                <a key={slug} href={`/en/blog/pillar/${slug}`}>
                  <span aria-hidden="true" style={{ backgroundColor: PILLARS[slug].color }} />
                  {PILLARS[slug].title}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {locale === 'fa' && (
        <aside className="brand-language-notice">
          <p>{t('persianLibraryNotice')}</p>
          <Link href="/en/blog" hrefLang="en" lang="en" dir="ltr">
            {t('viewEnglishLibrary')} <span className="brand-language-badge">English</span>
          </Link>
        </aside>
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
          clearSearch: t('clearSearch'),
          resultsFound: t.raw('resultsFound'),
        }}
      />
    </div>
  );
}
