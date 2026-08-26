import { locales } from '@/i18n';
import { getAvailableBlogLocales, getLocalBlogs } from '@/utils/data/local-blogs';
import { getActivePillarSlugs, getPillarForTags } from '@/utils/data/blog-pillars';
import { caseStudyProjects } from '@/utils/data/project-catalog';
import routeManifest from '@/utils/data/site-route-manifest.cjs';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
const { siteRouteManifest } = routeManifest;

function latestDate(values) {
  return new Date(Math.max(...values.map(value => new Date(value).getTime())));
}

export default function sitemap() {
  const blogs = getLocalBlogs('en');
  const staticEntries = [];

  locales.forEach(locale => {
    siteRouteManifest.forEach(route => {
      const languages = locales.reduce((acc, loc) => {
        acc[loc] = `${siteUrl}/${loc}${route.path}`;
        return acc;
      }, {});
      languages['x-default'] = `${siteUrl}/en${route.path}`;
      staticEntries.push({
        url: `${siteUrl}/${locale}${route.path}`,
        lastModified: new Date(route.lastModified),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      });
    });
  });

  const pillarEntries = getActivePillarSlugs(blogs).map(pillar => {
    const url = `${siteUrl}/en/blog/pillar/${pillar}`;
    const pillarBlogs = blogs.filter(blog => getPillarForTags(blog.tag_list || []) === pillar);
    return {
      url,
      lastModified: latestDate((pillarBlogs.length ? pillarBlogs : blogs).map(blog => blog.updated_at || blog.published_at)),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: { en: url, 'x-default': url } },
    };
  });

  const projectEntries = caseStudyProjects.flatMap(project => {
    const languages = locales.reduce((acc, locale) => {
      acc[locale] = `${siteUrl}/${locale}/projects/${project.slug}`;
      return acc;
    }, {});
    languages['x-default'] = `${siteUrl}/en/projects/${project.slug}`;
    return Array.from(locales, locale => ({
      url: `${siteUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
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
