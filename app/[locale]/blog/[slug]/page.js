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
    <div className="py-8 max-w-4xl mx-auto px-4">
      <Link 
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-2 text-[#16f2b3] hover:text-violet-400 mb-8 transition-colors"
      >
        <span className="rtl:rotate-180">←</span>
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

          <div className="flex flex-wrap items-center gap-4 text-[#16f2b3] text-sm mb-6">
            <span>{new Date(blog.published_at).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span>
            <span>•</span>
            <span>{blog.reading_time_minutes || 0} {t('minRead') || 'min'}</span>
            {blog.tag_list?.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {blog.tag_list.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-violet-500/20 text-violet-300 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Markdown content rendered as HTML */}
          <div 
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-a:text-[#16f2b3] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-[#16f2b3] prose-code:bg-dark-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-dark-900 prose-pre:border prose-pre:border-dark-600
              prose-ul:text-text-secondary prose-ol:text-text-secondary
              prose-li:marker:text-[#16f2b3]"
          >
            <BlogContent content={blog.content} />
          </div>
        </div>
      </article>
    </div>
  );
}

// Simple markdown to HTML converter for basic formatting
function BlogContent({ content }) {
  // Convert markdown to basic HTML
  let html = content
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br/>');
  
  // Wrap in paragraph
  html = '<p>' + html + '</p>';
  
  // Clean up list items
  html = html.replace(/<\/p><li>/g, '</p><ul><li>');
  html = html.replace(/<\/li><p>/g, '</li></ul><p>');
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><br\/><\/p>/g, '');
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
