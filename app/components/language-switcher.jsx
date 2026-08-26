"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import translationAvailability from '@/utils/data/translation-availability.cjs';

const { getLocaleSwitchTarget } = translationAvailability;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('languageSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale) => {
    const target = getLocaleSwitchTarget(pathname, locale, newLocale);
    startTransition(() => {
      router.push(target.href);
    });
  };

  const englishTarget = getLocaleSwitchTarget(pathname, locale, 'en');
  const persianTarget = getLocaleSwitchTarget(pathname, locale, 'fa');

  return (
    <div
      className="brand-language flex items-center"
      role="group"
      aria-label={t('changeLanguage')}
    >
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={`brand-language__option inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xs font-mono transition-colors ${
          locale === 'en'
            ? 'text-slate-100 bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        disabled={isPending || locale === 'en'}
        aria-current={locale === 'en' ? 'true' : undefined}
        aria-label={englishTarget.exact ? t('englishLabel') : t('englishIndexFallback')}
      >
        <bdi dir="ltr">EN</bdi>
      </button>
      <button
        type="button"
        onClick={() => switchLocale('fa')}
        className={`brand-language__option inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-xs font-sans transition-colors ${
          locale === 'fa'
            ? 'text-slate-100 bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        disabled={isPending || locale === 'fa'}
        aria-current={locale === 'fa' ? 'true' : undefined}
        aria-label={persianTarget.exact ? t('persianLabel') : t('persianIndexFallback')}
      >
        <span>فارسی</span>
        {!persianTarget.exact && locale !== 'fa' && (
          <span className="brand-language__fallback"> · {t('writingIndexShort')}</span>
        )}
      </button>
    </div>
  );
}
