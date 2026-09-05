// @flow strict
import { getTranslations } from 'next-intl/server';
import { personalData } from '@/utils/data/personal-data';
import Link from 'next/link';
import Image from 'next/image';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

export default async function Footer() {
  const tCommon = await getTranslations('common');
  const tPersonal = await getTranslations('personal');
  const tFooter = await getTranslations('footer');

  return (
    <footer className="relative z-10 border-t border-slate-700/70 bg-slate-900 text-white">
      <div className="mx-auto px-6 py-8 sm:px-12 lg:max-w-[70rem] lg:py-10 xl:max-w-[76rem] 2xl:max-w-[92rem]">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-700/60 pb-5">
          <Image src="/brand/yk-micro-icon.svg" alt="" aria-hidden="true" width={32} height={32} className="h-8 w-8" />
          <div>
            <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-slate-100">Yousef Kakhki</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-400">{tFooter('tagline')}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {tPersonal('name')}. {tCommon('allRightsReserved')}.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="/files/yousef-kakhki-resume-2026-06.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              {tFooter('resumePdf')}
            </a>
            <Link target="_blank" rel="noopener noreferrer" href={personalData.github}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 hover:text-slate-200 transition-colors" aria-label={`${tFooter('githubProfile')} (${tCommon('opensInNewTab')})`}>
              <BsGithub size={20} />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={personalData.linkedIn}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 hover:text-slate-200 transition-colors" aria-label={`${tFooter('linkedinProfile')} (${tCommon('opensInNewTab')})`}>
              <BsLinkedin size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
