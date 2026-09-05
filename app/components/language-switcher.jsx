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
    <div className="flex items-center gap-2 ms-4">
      <button
        onClick={() => switchLocale('en')}
        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-sm transition-colors ${
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
        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-sm transition-colors ${
          locale === 'fa'
            ? 'text-slate-100 bg-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        disabled={isPending}
        aria-label="FA — فارسی"
      >
        FA
      </button>
    </div>
  );
}

