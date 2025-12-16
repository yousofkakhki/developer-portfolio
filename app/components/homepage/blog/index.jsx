// @flow strict
"use client";
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { FaArrowRight } from 'react-icons/fa';
import BlogCard from './blog-card';

function Blog({ blogs }) {
  const t = useTranslations('nav');
  const locale = useLocale();

  // Filter blogs with cover images
  const validBlogs = blogs?.filter(blog => blog?.cover_image) || [];

  return (
    <section id='blogs' className="relative z-50 border-t my-12 lg:my-24 border-dark-600/50">
      {/* Ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 
        bg-gradient-radial from-accent-primary/10 via-accent-secondary/5 to-transparent 
        rounded-full blur-3xl pointer-events-none" />

      {/* Top gradient line */}
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      {/* Section Title */}
      <div className="flex justify-center my-8 lg:py-12">
        <div className="flex items-center gap-4">
          <span className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-transparent to-dark-700" />
          <h2 className="relative">
            <span className="bg-gradient-to-br from-dark-700 to-dark-600 
              text-text-primary px-6 py-2.5 text-xl md:text-2xl font-semibold
              rounded-lg border border-accent-primary/20 shadow-lg
              shadow-accent-primary/5">
              {t('blogs')}
            </span>
          </h2>
          <span className="w-16 md:w-24 h-[2px] bg-gradient-to-l from-transparent to-dark-700" />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {validBlogs.slice(0, 6).map((blog, i) => (
          <BlogCard blog={blog} key={blog.id || i} index={i} />
        ))}
      </div>

      {/* Empty State */}
      {validBlogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-dark-700/50 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-text-secondary mb-2">
            {t('noBlogsTitle') || 'No posts yet'}
          </h3>
          <p className="text-text-muted max-w-sm">
            {t('noBlogsDescription') || 'Blog posts will appear here once published.'}
          </p>
        </div>
      )}

      {/* View More Button */}
      {validBlogs.length > 0 && (
        <div className="flex justify-center mt-10 lg:mt-16">
          <Link
            href={`/${locale}/blog`}
            className="group inline-flex items-center gap-2 
              px-6 md:px-8 py-3 md:py-4 rounded-full
              bg-gradient-to-r from-accent-secondary to-accent-tertiary
              text-white text-sm md:text-base font-medium uppercase tracking-wide
              shadow-lg shadow-accent-secondary/25
              transition-all duration-300 ease-out
              hover:shadow-xl hover:shadow-accent-secondary/30
              hover:gap-4 hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-accent-primary focus-visible:ring-offset-2 
              focus-visible:ring-offset-dark-900"
          >
            <span>{t('viewMore') || 'View All Posts'}</span>
            <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  );
}

export default Blog;
