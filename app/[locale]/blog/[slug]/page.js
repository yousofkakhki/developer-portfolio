// @flow strict
import { getTranslations } from 'next-intl/server';
import { getLocalBlogs, getLocalBlogBySlug } from "@/utils/data/local-blogs";
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPillarForTags, PILLARS } from '@/utils/data/blog-pillars';
import { ConversionLink } from '@/app/components/analytics/conversion-link';
import { renderMarkdown } from '@/utils/render-markdown.cjs';

export const revalidate = 60;
export const dynamicParams = true;

function getArticleImage(blog, siteUrl) {
  const version = encodeURIComponent(blog.updated_at || blog.published_at || '1');
  return `${siteUrl}/blog/og/${blog.slug}.png?v=${version}`;
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const blog = getLocalBlogBySlug(slug, locale);
  if (!blog) return {};
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
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

export async function generateStaticParams({ params } = {}) {
  const blogs = getLocalBlogs(params?.locale || 'en');
  return blogs.map(blog => ({ slug: blog.slug }));
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
  const t = await getTranslations('blog');

  if (!blog) {
    notFound();
  }

  const related = getRelatedPosts(blog, locale);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const articleUrl = `${siteUrl}/${locale}/blog/${slug}`;
  const personId = `${siteUrl}/#person`;
  const pillarSlug = getPillarForTags(blog.tag_list);
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
    <div className="py-16 max-w-3xl mx-auto px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-8 transition-colors"
      >
        <span className="rtl:rotate-180">←</span>
        <span>{t('backToBlogs') || 'Back to Blogs'}</span>
      </Link>

      <article className="border border-slate-700 bg-slate-800/50 rounded overflow-hidden">
        {blog.cover_image && (
          <div className="w-full h-64 md:h-80 relative">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-slate-100 mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-8">
            <span>{new Date(blog.published_at).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span>
            <span>•</span>
            <span>{blog.reading_time_minutes || 0} {t('minRead') || 'min'}</span>
            {blog.tag_list?.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {blog.tag_list.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div 
            className="prose prose-invert prose-slate max-w-none
              prose-headings:text-slate-100 prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-slate-400 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-200
              prose-code:text-slate-300 prose-code:bg-slate-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
              prose-ul:text-slate-400 prose-ol:text-slate-400
              prose-li:marker:text-slate-500"
          >
            <BlogContent content={blog.content} />
          </div>
        </div>
      </article>

      {pillarSlug && locale === 'en' && (
        <div className="mt-8 rounded border border-slate-700 bg-slate-800/40 p-4">
          <span className="text-xs uppercase tracking-wider text-slate-400">Topic guide</span>
          <Link href={`/en/blog/pillar/${pillarSlug}`} className="mt-1 block font-medium text-slate-200 hover:text-white">
            {PILLARS[pillarSlug].title} →
          </Link>
        </div>
      )}

      <aside className="mt-8 rounded border border-cyan-800/60 bg-cyan-950/20 p-5" aria-label={locale === 'fa' ? 'همکاری' : 'Work with me'}>
        <h2 className="text-lg font-medium text-slate-100 mb-2">
          {locale === 'fa' ? 'روی یک مسئلهٔ مهندسی پیچیده کار می‌کنید؟' : 'Working on a difficult backend or real-time systems problem?'}
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 mb-4">
          {locale === 'fa'
            ? 'تجربه و روش همکاری من را ببینید و دربارهٔ موقعیت یا پروژه گفتگو کنید.'
            : 'See where my architecture and implementation experience fits your team.'}
        </p>
        <ConversionLink
          eventName="article_work_with_me"
          source={`article_${blog.slug}`}
          href={`/${locale}/work-with-me`}
          className="inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
        >
          {locale === 'fa' ? 'همکاری با من ←' : 'Work with me →'}
        </ConversionLink>
      </aside>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Related posts</h2>
          <ul className="space-y-3">
            {related.map(post => (
              <li key={post.slug}>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="flex items-start gap-3 p-4 border border-slate-700 rounded hover:border-slate-500 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 group-hover:text-white text-sm font-medium truncate transition-colors">
                      {post.title}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      {' · '}{post.reading_time_minutes} min read
                    </p>
                  </div>
                  <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-sm mt-0.5">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BlogContent({ content }) {
  return <div className="blog-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />;
}
