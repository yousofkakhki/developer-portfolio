// @flow strict
"use client";
import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { BsCalendar3, BsClock, BsHeartFill } from 'react-icons/bs';
import { FaCommentAlt } from 'react-icons/fa';

function BlogCard({ blog, index = 0 }) {
  const t = useTranslations('blog');
  const locale = useLocale();
  
  // Create internal blog post URL
  const blogSlug = blog?.slug || blog?.id || Math.random().toString(36).substring(7);
  const blogUrl = `/${locale}/blog/${blogSlug}`;

  // Extract tags from blog data
  const tags = blog?.tag_list || blog?.tags?.split(',').map(t => t.trim()) || [];

  return (
    <Link 
      href={blogUrl}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900 rounded-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article 
        className="relative h-full rounded-xl overflow-hidden
          bg-gradient-to-br from-dark-800/80 to-dark-700/50
          backdrop-blur-xl border border-dark-600/50
          transition-all duration-500 ease-out
          hover:border-accent-primary/30 hover:shadow-[0_8px_40px_rgba(22,242,179,0.15)]
          hover:-translate-y-1 hover:scale-[1.02]
          animate-fade-in-up"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5" />
        
        {/* Image Container */}
        <div className="relative h-48 lg:h-52 overflow-hidden">
          <Image
            src={blog?.cover_image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={blog?.title || "Blog post cover"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />
          
          {/* Tags overlay */}
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider
                    bg-dark-900/70 backdrop-blur-sm text-accent-primary/90
                    rounded-full border border-accent-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Reading time badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5
            px-2.5 py-1 rounded-full bg-dark-900/80 backdrop-blur-sm
            text-xs text-text-secondary">
            <BsClock className="w-3 h-3" />
            <span>{blog?.reading_time_minutes || 0} {t('minRead') || 'min'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 flex flex-col gap-3">
          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <BsCalendar3 className="w-3 h-3" />
              <time dateTime={blog?.published_at}>
                {timeConverter(blog?.published_at, locale)}
              </time>
            </div>
            <div className="flex items-center gap-3">
              {blog?.public_reactions_count > 0 && (
                <span className="flex items-center gap-1 text-accent-secondary/80">
                  <BsHeartFill className="w-3 h-3" />
                  {blog.public_reactions_count}
                </span>
              )}
              {blog?.comments_count > 0 && (
                <span className="flex items-center gap-1 text-accent-tertiary/80">
                  <FaCommentAlt className="w-2.5 h-2.5" />
                  {blog.comments_count}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg lg:text-xl font-semibold text-text-primary leading-tight
            line-clamp-2 group-hover:text-accent-primary transition-colors duration-300">
            {blog?.title}
          </h3>

          {/* Description with fade */}
          <div className="relative">
            <p className="text-sm text-text-tertiary leading-relaxed line-clamp-3">
              {blog?.description}
            </p>
            {/* Fade gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6 
              bg-gradient-to-t from-dark-800/80 to-transparent pointer-events-none" />
          </div>

          {/* Read more indicator */}
          <div className="flex items-center gap-2 text-sm font-medium text-accent-primary/70
            group-hover:text-accent-primary group-hover:gap-3 transition-all duration-300 mt-auto pt-2">
            <span>{t('readMore') || 'Read article'}</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BlogCard;
