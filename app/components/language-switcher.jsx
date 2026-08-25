"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale) => {
    startTransition(() => {
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  return (
    <div
      className="brand-language flex items-center"
      aria-label={locale === 'fa' ? 'تغییر زبان' : 'Change language'}
    >
      <button
        onClick={() => switchLocale('en')}
        className={`brand-language__option inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xs font-mono transition-colors ${
          locale === 'en'
            ? 'text-slate-100 bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        disabled={isPending}
        aria-label="EN — English"
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('fa')}
        className={`brand-language__option inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-xs font-sans transition-colors ${
          locale === 'fa'
            ? 'text-slate-100 bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        disabled={isPending}
        aria-label="FA — فارسی"
      >
        فارسی
      </button>
    </div>
  );
}
