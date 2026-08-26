"use client";

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import translationAvailability from '@/utils/data/translation-availability.cjs';

const { getLocaleSwitchTarget } = translationAvailability;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('languageSwitcher');
  const pathname = usePathname();

  const englishTarget = getLocaleSwitchTarget(pathname, locale, 'en');
  const persianTarget = getLocaleSwitchTarget(pathname, locale, 'fa');

  return (
    <div
      className="brand-language flex items-center"
      role="group"
      aria-label={t('changeLanguage')}
      data-language-switcher
    >
      <Link
        href={englishTarget.href}
        hrefLang="en"
        lang="en"
        dir="ltr"
        className={`brand-language__option inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xs font-mono transition-colors ${
          locale === 'en'
            ? 'text-slate-100 bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-current={locale === 'en' ? 'page' : undefined}
        aria-label={englishTarget.exact ? t('englishLabel') : t('englishIndexFallback')}
      >
        EN
      </Link>
      <Link
        href={persianTarget.href}
        hrefLang="fa"
        lang="fa"
        dir="rtl"
        className={`brand-language__option inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-xs font-sans transition-colors ${
          locale === 'fa'
            ? 'text-slate-100 bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-current={locale === 'fa' ? 'page' : undefined}
        aria-label={persianTarget.exact ? t('persianLabel') : t('persianIndexFallback')}
      >
        <span>فارسی</span>
        {!persianTarget.exact && locale !== 'fa' && (
          <span className="brand-language__fallback"> · {t('writingIndexShort')}</span>
        )}
      </Link>
    </div>
  );
}
