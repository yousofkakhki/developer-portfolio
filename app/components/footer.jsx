// @flow strict
import { getTranslations } from 'next-intl/server';
import { personalData } from '@/utils/data/personal-data';
import Link from 'next/link';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

export default async function Footer() {
  const tCommon = await getTranslations('common');
  const tPersonal = await getTranslations('personal');

  return (
    <footer className="relative border-t bg-slate-900 border-slate-700 text-white z-10">
      <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] py-6 lg:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {tPersonal('name')}. {tCommon('allRightsReserved')}.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="/files/yousef-kakhki-resume-2026-06.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Résumé (PDF)
            </a>
            <Link target="_blank" rel="noopener noreferrer" href={personalData.github}
              className="text-slate-400 hover:text-slate-200 transition-colors" aria-label="GitHub Profile">
              <BsGithub size={20} />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={personalData.linkedIn}
              className="text-slate-400 hover:text-slate-200 transition-colors" aria-label="LinkedIn Profile">
              <BsLinkedin size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
