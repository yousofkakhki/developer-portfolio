// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import { personalData } from '@/utils/data/personal-data';
import Link from 'next/link';
import { BsGithub, BsLinkedin } from "react-icons/bs";

function Footer() {
  const t = useTranslations();
  const tCommon = useTranslations('common');
  const tPersonal = useTranslations('personal');

  return (
    <div className="relative border-t bg-[#0d1224] border-[#353951] text-white z-10">
      <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] py-6 lg:py-10">
        <div className="flex justify-center relative">
          <div className="absolute top-0 h-[1px] w-1/2  bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            © {new Date().getFullYear()} {tPersonal('name')}. {tCommon('allRightsReserved')}.
          </p>
          {/* ADDED: Social media icons */}
          <div className="flex items-center gap-5 mt-4 md:mt-0">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={personalData.github}
              className="text-text-muted hover:text-accent-secondary transition-colors duration-300"
              aria-label="GitHub Profile"
            >
              <BsGithub size={20} />
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={personalData.linkedIn}
              className="text-text-muted hover:text-accent-secondary transition-colors duration-300"
              aria-label="LinkedIn Profile"
            >
              <BsLinkedin size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Footer;
