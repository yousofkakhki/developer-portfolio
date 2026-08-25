import { locales } from '@/i18n';
import { getAvailableBlogLocales, getLocalBlogs } from '@/utils/data/local-blogs';
import { getActivePillarSlugs } from '@/utils/data/blog-pillars';
import { projectCatalog } from '@/utils/data/project-catalog';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
const STATIC_LAST_MODIFIED = new Date('2026-07-28');

export default function sitemap() {
  const routes = ['', '/blog', '/projects', '/work-with-me'];
  const blogs = getLocalBlogs('en');
  const staticEntries = [];

  locales.forEach(locale => {
    routes.forEach(route => {
      const languages = locales.reduce((acc, loc) => {
        acc[loc] = `${siteUrl}/${loc}${route}`;
        return acc;
      }, {});
      languages['x-default'] = `${siteUrl}/en${route}`;
      staticEntries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.9,
        alternates: { languages },
      });
    });
  });

  const pillarEntries = getActivePillarSlugs(blogs).map(pillar => {
    const url = `${siteUrl}/en/blog/pillar/${pillar}`;
    return {
      url,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: { en: url, 'x-default': url } },
    };
  });

  const projectEntries = projectCatalog.flatMap(project => {
    const languages = locales.reduce((acc, locale) => {
      acc[locale] = `${siteUrl}/${locale}/projects/${project.slug}`;
      return acc;
    }, {});
    languages['x-default'] = `${siteUrl}/en/projects/${project.slug}`;
    return Array.from(locales, locale => ({
      url: `${siteUrl}/${locale}/projects/${project.slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages },
    }));
  });

  const blogEntries = blogs.flatMap(blog => {
    const blogLocales = getAvailableBlogLocales(blog.slug);
    const languages = blogLocales.reduce((acc, locale) => {
      acc[locale] = `${siteUrl}/${locale}/blog/${blog.slug}`;
      return acc;
    }, {});
    if (languages.en) languages['x-default'] = languages.en;
    return blogLocales.map(locale => ({
      url: `${siteUrl}/${locale}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.published_at),
      changeFrequency: 'monthly',
      priority: locale === 'en' ? 0.8 : 0.6,
      alternates: { languages },
    }));
  });

  return [...staticEntries, ...pillarEntries, ...projectEntries, ...blogEntries];
}
