// @flow strict
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import BlogCard from './blog-card';

export default async function Blog({ blogs = [] }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'blog' });

  return (
    <section id="blogs" className="brand-section" aria-labelledby="homepage-writing-heading">
      <div className="mx-auto max-w-5xl">
        <h2 id="homepage-writing-heading" className="brand-section__title mb-8 text-3xl font-semibold text-slate-100">
          {t('title')}
        </h2>

        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {blogs.map(blog => (
                <BlogCard blog={blog} key={blog.id} />
              ))}
            </div>

            <div className="mt-8">
              <Link href={`/${locale}/blog`} className="brand-button">
                {t('viewAllPosts')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-slate-400">{t('noPostsYet')}</p>
        )}
      </div>
    </section>
  );
}
