import fs from 'fs';
import path from 'path';
import blogLocaleHelpers from './blog-locales.cjs';
import articleTypeHelpers from './article-types.cjs';

const { availableBlogLocales, hasCompleteTranslation } = blogLocaleHelpers;
const { isArticleType } = articleTypeHelpers;

const BLOG_DIR = path.join(process.cwd(), 'content/blogs');

function loadAll() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')); }
      catch { return null; }
    })
    .filter(b => b && b.publishedAt && !b.draft && b.published !== false)
    .map(blog => {
      if (!isArticleType(blog.articleType)) {
        throw new Error(`Published article ${blog.slug || '(missing slug)'} has an invalid articleType.`);
      }
      return blog;
    })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function localized(value, locale, fallback = '') {
  if (typeof value === 'string') return value;
  return value?.[locale] || value?.en || fallback;
}

function normalize(blog, locale = 'en') {
  const title = localized(blog.title, locale);
  const description = localized(blog.description, locale);
  return {
    id: blog.slug,
    slug: blog.slug,
    title,
    description,
    seo_title: localized(blog.seoTitle, locale, title),
    seo_description: localized(blog.seoDescription, locale, description),
    cover_image: blog.coverImage,
    tag_list: blog.tags || [],
    published_at: blog.publishedAt,
    updated_at: blog.updatedAt || blog.publishedAt,
    reading_time_minutes: blog.reading_time_minutes || blog.readingTimeMinutes || 5,
    content: localized(blog.content, locale),
    article_type: blog.articleType,
    content_id: blog.contentId || blog.slug,
    isLocal: true,
  };
}

export function getLocalBlogs(locale = 'en') {
  return loadAll()
    .filter(blog => hasCompleteTranslation(blog, locale))
    .map(blog => normalize(blog, locale));
}

export function getHomepageBlogs(locale = 'en') {
  return loadAll()
    .filter(blog => blog.homepageFeatured === true && hasCompleteTranslation(blog, locale))
    .sort((a, b) => a.homepagePriority - b.homepagePriority)
    .map(blog => normalize(blog, locale));
}

export function getLocalBlogBySlug(slug, locale = 'en') {
  const blog = loadAll().find(b => b.slug === slug);
  return blog && hasCompleteTranslation(blog, locale) ? normalize(blog, locale) : null;
}

export function getAvailableBlogLocales(slug) {
  const blog = loadAll().find(candidate => candidate.slug === slug);
  return blog ? availableBlogLocales(blog, ['en', 'fa']) : [];
}
