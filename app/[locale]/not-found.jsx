// @flow strict
"use client";
import { useTranslations, useLocale } from 'next-intl';
import Link from "next/link";

function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t('pageNotFound')}</p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{t('description')}</p>
      <Link className="mt-5 flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
        role="button" 
        href={`/${locale}`}
      >
        {t('goToHome')}
      </Link>
    </div>
  );
};

export default NotFound;