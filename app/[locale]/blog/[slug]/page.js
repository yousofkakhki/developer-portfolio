// @flow strict
import { personalData } from "@/utils/data/personal-data";
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getBlogs() {
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Error fetching blog data:', error);
    return [];
  }
}

async function getBlogBySlug(slug) {
  const blogs = await getBlogs();
  return blogs.find(blog => blog.slug === slug || blog.id?.toString() === slug);
}

export async function generateStaticParams() {
  // Return empty array to use dynamic rendering
  // Blog posts will be fetched at request time
  return [];
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function BlogPost({ params }) {
  const { slug, locale } = await params;
  const blog = await getBlogBySlug(slug);
  const t = await getTranslations('blog');

  if (!blog) {
    notFound();
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      <Link 
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-2 text-[#16f2b3] hover:text-violet-400 mb-8 transition-colors"
      >
        <span>←</span>
        <span>{t('backToBlogs') || 'Back to Blogs'}</span>
      </Link>

      <article className="bg-[#1b203e] rounded-lg border border-[#1d293a] overflow-hidden">
        {blog.cover_image && (
          <div className="w-full h-64 md:h-96 relative">
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-[#16f2b3] text-sm mb-6">
            <span>{new Date(blog.published_at).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span>
            <span>•</span>
            <span>{blog.reading_time_minutes || 0} {t('minRead') || 'Min Read'}</span>
          </div>

          <div 
            className="prose prose-invert max-w-none text-text-secondary"
            dangerouslySetInnerHTML={{ __html: blog.body_html || blog.description }}
          />

          <div className="mt-8 pt-6 border-t border-[#1d293a]">
            <Link
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
            >
              <span>{t('readOnDevTo') || 'Read original on dev.to'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

