// @flow strict
"use client";
import { useTranslations, useLocale } from 'next-intl';
import Link from "next/link";

function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-slate-100">{t('title')}</h1>
      <p className="mt-4 text-lg text-slate-300">{t('pageNotFound')}</p>
      <p className="mt-2 text-slate-400">{t('description')}</p>
      <Link
        className="mt-5 inline-block px-6 py-3 border border-slate-500 text-slate-100 rounded hover:bg-slate-800 transition-colors text-sm font-medium"
        role="button" 
        href={`/${locale}`}
      >
        {t('goToHome')}
      </Link>
    </div>
  );
};

export default NotFound;