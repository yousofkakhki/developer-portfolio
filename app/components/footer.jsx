// @flow strict
import Image from 'next/image';
import Link from 'next/link';
import { BsLinkedin } from 'react-icons/bs';
import { getTranslations } from 'next-intl/server';
import { personalData } from '@/utils/data/personal-data';
import { careerFacts } from '@/utils/data/career-facts';
import profileConfig from '@/utils/data/external-profiles.cjs';

const { getApprovedGlobalProfiles } = profileConfig;

async function Footer() {
  const tCommon = await getTranslations('common');
  const tFooter = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const tHero = await getTranslations('hero');
  const tPersonal = await getTranslations('personal');
  const approvedProfiles = getApprovedGlobalProfiles();

  return (
    <footer className="brand-footer relative z-10 text-white">
      <div className="mx-auto max-w-[76rem] px-6 py-10 sm:px-12 lg:py-14">
        <div className="grid gap-10 border-b border-slate-700/70 pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="flex items-start gap-4">
            <span className="brand-nav__mark flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border p-2">
              <Image src="/brand/yk-micro-icon.svg" alt="" aria-hidden="true" width={32} height={32} unoptimized className="h-full w-full" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">{tNav('brandTagline')}</p>
              <p className="brand-footer__statement mt-2">{tFooter('tagline')}</p>
            </div>
          </div>

          <ul className="flex flex-wrap items-center gap-2" aria-label={tFooter('profileLinks')}>
            <li>
              <a
                href={careerFacts.resume.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-button min-h-[44px]"
              >
                {tFooter('resumePdf')}
              </a>
            </li>
            {approvedProfiles.map(profile => (
              <li key={profile.id}>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={profile.url}
                  className="inline-flex min-h-[48px] items-center gap-2 border border-slate-700 px-3 text-slate-400 transition-colors hover:border-cyan-400 hover:text-cyan-300"
                  aria-label={`${tFooter(`${profile.id}Profile`)} (${tCommon('opensInNewTab')})`}
                >
                  {profile.id === 'linkedin' && <BsLinkedin size={20} aria-hidden="true" />}
                  <span>{tFooter(`${profile.id}Profile`)}</span>
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${personalData.email}`}
                className="inline-flex min-h-[48px] items-center gap-2 border border-slate-700 px-3 text-slate-400 transition-colors hover:border-cyan-400 hover:text-cyan-300"
              >
                <span>{personalData.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {tPersonal('name')}. {tCommon('allRightsReserved')}.</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{tHero('eyebrow')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
