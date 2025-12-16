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
      // Remove current locale from pathname
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      // Navigate to new locale
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  return (
    <div className="flex items-center gap-3 ms-6">
      {/* UK Flag for English */}
      <button
        onClick={() => switchLocale('en')}
        className={`relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center ${
          locale === 'en'
            ? 'ring-2 ring-[#16f2b3] ring-offset-2 ring-offset-[#0d1224] scale-110'
            : 'opacity-60 hover:opacity-100 hover:scale-110'
        }`}
        disabled={isPending}
        aria-label="Switch to English"
        title="English"
      >
        <svg viewBox="0 0 60 30" className="w-full h-full">
          <rect width="60" height="30" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="2.5"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="1.5"/>
          <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="3.5"/>
          <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="2"/>
        </svg>
      </button>

      {/* Iran Flag for Persian */}
      <button
        onClick={() => switchLocale('fa')}
        className={`relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center ${
          locale === 'fa'
            ? 'ring-2 ring-[#16f2b3] ring-offset-2 ring-offset-[#0d1224] scale-110'
            : 'opacity-60 hover:opacity-100 hover:scale-110'
        }`}
        disabled={isPending}
        aria-label="Switch to Persian"
        title="فارسی"
      >
        <svg viewBox="0 0 60 30" className="w-full h-full">
          <rect width="60" height="10" y="0" fill="#239F40"/>
          <rect width="60" height="10" y="10" fill="#fff"/>
          <rect width="60" height="10" y="20" fill="#DA0000"/>
          <g transform="translate(30,15)">
            <circle r="3" fill="#DA0000"/>
            <path d="M-2,0 L2,0 M0,-2 L0,2" stroke="#DA0000" strokeWidth="0.5"/>
            <path d="M-1.5,-1.5 L1.5,1.5 M1.5,-1.5 L-1.5,1.5" stroke="#DA0000" strokeWidth="0.3"/>
          </g>
        </svg>
      </button>
    </div>
  );
}

