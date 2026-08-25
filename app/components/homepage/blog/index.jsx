// @flow strict
"use client";
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { memo } from 'react';
import BlogCard from './blog-card';

function Blog({ blogs }) {
  const t = useTranslations();
  const locale = useLocale();

  const validBlogs = blogs?.filter(blog => blog?.cover_image) || [];

  return (
    <section id='blogs' className="brand-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="brand-section__title text-3xl font-semibold text-slate-100 mb-8">
          {t('blog.title')}
        </h2>

        {validBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {validBlogs.slice(0, 4).map((blog, i) => (
                <BlogCard blog={blog} key={blog.id || i} index={i} />
              ))}
            </div>

            <div className="mt-8">
              <Link
                href={`/${locale}/blog`}
                className="brand-button"
              >
                {t('blog.viewAllPosts')} →
              </Link>
            </div>
          </>
        ) : (
          <p className="text-slate-400">{t('blog.noPostsYet')}</p>
        )}
      </div>
    </section>
  );
}

export default memo(Blog);
