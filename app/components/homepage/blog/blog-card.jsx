// @flow strict
"use client";
import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { memo } from 'react';

function BlogCard({ blog }) {
  const t = useTranslations('blog');
  const locale = useLocale();
  
  const blogSlug = blog?.slug || blog?.id;
  if (!blogSlug) return null;
  const blogUrl = `/${locale}/blog/${blogSlug}`;
  const isSvgCover = typeof blog?.cover_image === 'string' && blog.cover_image.endsWith('.svg');

  return (
    <Link 
      href={blogUrl}
      className="group block"
    >
      <article className="brand-panel brand-panel--interactive overflow-hidden">
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <Image
            src={blog?.cover_image}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={isSvgCover}
            alt={blog?.title || t('postImageAlt')}
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <p className={`brand-article-type brand-article-type--${blog.article_type}`}>
            {t(`articleTypes.${blog.article_type}`)}
          </p>
          <ul className="mb-2 mt-2 flex items-center gap-2 text-xs text-slate-400" aria-label={t('articleMeta')}>
            <li><time dateTime={blog?.published_at}>{timeConverter(blog?.published_at, locale)}</time></li>
            <li>{blog?.reading_time_minutes || 5} {t('minRead')}</li>
          </ul>

          <h3 className="text-base font-medium text-slate-200 line-clamp-2 group-hover:text-slate-50 transition-colors">
            {blog?.title}
          </h3>

          <p className="text-sm text-slate-400 mt-2 line-clamp-2">
            {blog?.description}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default memo(BlogCard);
