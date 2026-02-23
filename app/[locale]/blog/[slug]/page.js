// @flow strict
import { getTranslations } from 'next-intl/server';
import { getLocalBlogs, getLocalBlogBySlug } from "@/utils/data/local-blogs";
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const blogs = getLocalBlogs('en');
  return blogs.map(blog => ({ slug: blog.slug }));
}

export default async function BlogPost({ params }) {
  const { slug, locale } = await params;
  const blog = getLocalBlogBySlug(slug, locale);
  const t = await getTranslations('blog');

  if (!blog) {
    notFound();
  }

  return (
    <div className="py-16 max-w-3xl mx-auto px-4">
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
    </div>
  );
}

function BlogContent({ content }) {
  let html = content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  
  html = '<p>' + html + '</p>';
  html = html.replace(/<\/p><li>/g, '</p><ul><li>');
  html = html.replace(/<\/li><p>/g, '</li></ul><p>');
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><br\/><\/p>/g, '');
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
