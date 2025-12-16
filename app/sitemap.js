import { locales } from '@/i18n';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.ir';

export default function sitemap() {
  const routes = [
    '',
    '/blog',
  ];

  const sitemapEntries = [];

  // Generate entries for each locale
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: locales.reduce((acc, loc) => {
            acc[loc] = `${siteUrl}/${loc}${route}`;
            return acc;
          }, {}),
        },
      });
    });
  });

  return sitemapEntries;
}

