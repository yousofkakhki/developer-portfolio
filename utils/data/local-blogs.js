// Local blog posts data
import fs from 'fs';
import path from 'path';

// Import blog posts statically for build-time
import portfolioBlog from '@/content/blogs/building-bilingual-portfolio.json';
import hybridRoomBlog from '@/content/blogs/hybrid-room-scalability-blog.json';

const localBlogs = [hybridRoomBlog, portfolioBlog];

export function getLocalBlogs(locale = 'en') {
  return localBlogs.map(blog => ({
    id: blog.slug,
    slug: blog.slug,
    title: blog.title[locale] || blog.title.en,
    description: blog.description[locale] || blog.description.en,
    cover_image: blog.coverImage,
    tag_list: blog.tags,
    published_at: blog.publishedAt,
    reading_time_minutes: blog.reading_time_minutes || 5,
    // Full content for detail page
    content: blog.content[locale] || blog.content.en,
    isLocal: true
  }));
}

export function getLocalBlogBySlug(slug, locale = 'en') {
  const blog = localBlogs.find(b => b.slug === slug);
  if (!blog) return null;
  
  return {
    id: blog.slug,
    slug: blog.slug,
    title: blog.title[locale] || blog.title.en,
    description: blog.description[locale] || blog.description.en,
    cover_image: blog.coverImage,
    tag_list: blog.tags,
    published_at: blog.publishedAt,
    reading_time_minutes: blog.reading_time_minutes || 5,
    content: blog.content[locale] || blog.content.en,
    isLocal: true
  };
}

