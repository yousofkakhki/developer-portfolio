import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'fa'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // This API will be used in a Server Component. requestLocale will
  // correspond to the locale provided by the user (e.g. in a cookie).
  // You can also use the `locale` from the parameter if you're using
  // internationalized routing.
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

