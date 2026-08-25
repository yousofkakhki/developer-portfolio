// @flow strict
"use client";
import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { memo } from 'react';

function BlogCard({ blog, index = 0 }) {
  const t = useTranslations('blog');
  const locale = useLocale();
  
  const blogSlug = blog?.slug || blog?.id || Math.random().toString(36).substring(7);
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
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <time dateTime={blog?.published_at}>
              {timeConverter(blog?.published_at, locale)}
            </time>
            <span>•</span>
            <span>{blog?.reading_time_minutes || 5} {t('minRead')}</span>
          </div>

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
