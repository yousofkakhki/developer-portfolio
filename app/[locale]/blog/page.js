// @flow strict
import { getTranslations } from 'next-intl/server';
import { getLocalBlogs } from "@/utils/data/local-blogs";
import BlogPageClient from "./blog-page-client";

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  
  // Get local blogs instead of dev.to
  const blogs = getLocalBlogs(locale);

  // Extract unique tags from all blogs
  const allTags = [...new Set(
    blogs.flatMap(blog => blog?.tag_list || [])
  )].slice(0, 10);

  return (
    <BlogPageClient 
      blogs={blogs} 
      allTags={allTags}
      locale={locale}
      translations={{
        title: t('allBlogs') || 'All Blog Posts',
        searchPlaceholder: t('searchPlaceholder') || 'Search articles...',
        allTags: t('allTags') || 'All',
        noResults: t('noResults') || 'No articles found',
        noResultsDescription: t('noResultsDescription') || 'Try adjusting your search or filter.',
        clearFilters: t('clearFilters') || 'Clear filters',
      }}
    />
  );
}
