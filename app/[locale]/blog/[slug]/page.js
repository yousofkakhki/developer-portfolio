// @flow strict
import { getTranslations } from 'next-intl/server';
import { getLocalBlogs, getLocalBlogBySlug } from "@/utils/data/local-blogs";
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getActivePillarSlugs, getPillarForTags, PILLARS } from '@/utils/data/blog-pillars';
import { ConversionLink } from '@/app/components/analytics/conversion-link';
import { renderMarkdown } from '@/utils/render-markdown.cjs';

export const revalidate = 60;
export const dynamicParams = false;

function getArticleImage(blog, siteUrl) {
  if (typeof blog.cover_image === 'string' && blog.cover_image.endsWith('.png')) {
    const version = encodeURIComponent(blog.updated_at || blog.published_at || '1');
    return `${siteUrl}${blog.cover_image}?v=${version}`;
  }
  return `${siteUrl}/og-default.png`;
}

function formatArticleDate(value, locale) {
  return new Date(value).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const blog = getLocalBlogBySlug(slug, locale);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  if (!blog) return {};
  const articleUrl = `${siteUrl}/${locale}/blog/${slug}`;
  const languages = {};
  if (getLocalBlogBySlug(slug, 'en')) languages.en = `${siteUrl}/en/blog/${slug}`;
  if (getLocalBlogBySlug(slug, 'fa')) languages.fa = `${siteUrl}/fa/blog/${slug}`;
  if (languages.en) languages['x-default'] = languages.en;
  const ogImage = getArticleImage(blog, siteUrl);
  return {
    title: blog.seo_title,
    description: blog.seo_description,
    alternates: {
      canonical: `${siteUrl}/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      url: articleUrl,
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      publishedTime: blog.published_at,
      modifiedTime: blog.updated_at,
      tags: blog.tag_list,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: blog.title, description: blog.description, images: [ogImage] },
  };
}

export function generateStaticParams() {
  return ['en', 'fa'].flatMap(locale => getLocalBlogs(locale).map(blog => ({ locale, slug: blog.slug })));
}

function getRelatedPosts(blog, locale, limit = 3) {
  if (!blog?.tag_list?.length) return [];
  const all = getLocalBlogs(locale);
  return all
    .filter(b => b.slug !== blog.slug && b.tag_list?.some(t => blog.tag_list.includes(t)))
    .sort((a, b) => {
      const scoreA = a.tag_list.filter(t => blog.tag_list.includes(t)).length;
      const scoreB = b.tag_list.filter(t => blog.tag_list.includes(t)).length;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export default async function BlogPost({ params }) {
  const { slug, locale } = await params;
  const blog = getLocalBlogBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  if (!blog) notFound();

  const related = getRelatedPosts(blog, locale);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const articleUrl = `${siteUrl}/${locale}/blog/${slug}`;
  const personId = `${siteUrl}/#person`;
  const candidatePillar = getPillarForTags(blog.tag_list);
  const activePillars = locale === 'en' ? getActivePillarSlugs(getLocalBlogs('en')) : [];
  const pillarSlug = activePillars.includes(candidatePillar) ? candidatePillar : null;
  const articleTypeLabel = t(`articleTypes.${blog.article_type}`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${articleUrl}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
        headline: blog.title,
        description: blog.seo_description,
        image: { '@type': 'ImageObject', url: getArticleImage(blog, siteUrl), width: 1200, height: 630 },
        datePublished: blog.published_at,
        dateModified: blog.updated_at,
        inLanguage: locale === 'fa' ? 'fa-IR' : 'en-US',
        keywords: blog.tag_list?.join(', '),
        genre: blog.article_type,
        author: { '@id': personId },
        publisher: { '@id': personId },
        isPartOf: { '@id': `${siteUrl}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: locale === 'fa' ? 'خانه' : 'Home', item: `${siteUrl}/${locale}` },
          { '@type': 'ListItem', position: 2, name: locale === 'fa' ? 'وبلاگ' : 'Blog', item: `${siteUrl}/${locale}/blog` },
          { '@type': 'ListItem', position: 3, name: blog.title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    <div className="brand-route brand-route--reading brand-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Link href={`/${locale}/blog`} className="brand-route__back">
        <span aria-hidden="true">←</span>
        <span>{t('backToBlogs') || 'Back to Blogs'}</span>
      </Link>

      <article>
        <header className="brand-article__header">
          <p className={`brand-article-type brand-article-type--${blog.article_type}`}>{articleTypeLabel}</p>
          <h1>{blog.title}</h1>
          <div className="brand-article__meta">
            <time dateTime={blog.published_at}>
              {formatArticleDate(blog.published_at, locale)}
            </time>
            <span aria-hidden="true">/</span>
            <span>{blog.reading_time_minutes || 0} {t('minRead') || 'min'}</span>
            {blog.tag_list?.length > 0 && (
              <ul className="brand-article__tags" aria-label={t('tags')}>
                {blog.tag_list.map(tag => <li className="brand-article__tag" key={tag}><bdi>{tag}</bdi></li>)}
              </ul>
            )}
          </div>
        </header>

        {blog.cover_image && (
          <figure className="brand-article__cover">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              unoptimized={blog.cover_image.endsWith('.svg')}
              className="object-cover"
              priority
            />
          </figure>
        )}

        <div className="brand-article__body">
          <BlogContent content={blog.content} />
        </div>
      </article>

      {pillarSlug && locale === 'en' && (
        <aside className="brand-article__topic">
          <span>{t('topicGuide')}</span>
          <Link href={`/en/blog/pillar/${pillarSlug}`}>
            {PILLARS[pillarSlug].title} <span aria-hidden="true">→</span>
          </Link>
        </aside>
      )}

      <aside className="brand-route__cta brand-article__cta" aria-label={t('workCta')}>
        <p className="brand-route__eyebrow">{t('workCta')}</p>
        <h2>{t('workPrompt')}</h2>
        <p>{t('workDescription')}</p>
        <ConversionLink
          eventName="article_work_with_me"
          source={`article_${blog.slug}`}
          href={`/${locale}/work-with-me`}
          className="brand-button brand-button--primary"
        >
          {t('workCta')} <span aria-hidden="true">→</span>
        </ConversionLink>
      </aside>

      {related.length > 0 && (
        <section className="brand-article__related">
          <h2>{t('relatedPosts')}</h2>
          <ul>
            {related.map((post, index) => (
              <li key={post.slug}>
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{post.title}</strong>
                  <small>
                    {formatArticleDate(post.published_at, locale)}
                    {' · '}{post.reading_time_minutes} {t('minRead')}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function BlogContent({ content }) {
  return <div className="blog-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />;
}
