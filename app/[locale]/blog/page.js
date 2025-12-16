// @flow strict
import { personalData } from "@/utils/data/personal-data";
import { getTranslations } from 'next-intl/server';
import BlogPageClient from "./blog-page-client";

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
    console.warn('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const blogs = await getBlogs();
  const t = await getTranslations('blog');

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
