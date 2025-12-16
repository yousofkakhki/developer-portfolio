// @flow strict
"use client";
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { personalData } from "@/utils/data/personal-data";
import { useScrollReveal } from "@/utils/hooks/useScrollReveal";
import { useEffect, useState, useCallback, memo } from "react";

/**
 * HeroSection component - Main hero section with introduction and avatar
 * @returns {JSX.Element}
 */
function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  const [textRef, textRevealed] = useScrollReveal({ threshold: 0.2 });
  const [imageRef, imageRevealed] = useScrollReveal({ threshold: 0.2 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect for avatar - memoized to prevent unnecessary re-renders
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePosition({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section id="hero" className="relative flex flex-col items-center justify-center py-8 overflow-hidden min-h-screen">
      {/* Background image with subtle animation */}
      <Image
        src="/hero.svg"
        alt=""
        width={1572}
        height={795}
        className="absolute -top-[98px] left-1/2 -translate-x-1/2 -z-10 w-[200%] max-w-none h-auto animate-pulse-glow"
        loading="lazy"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        {/* Text and Buttons Section */}
        <div 
          ref={textRef}
          className={`order-2 lg:order-1 flex flex-col items-start justify-center p-2 transition-all duration-1000 ${
            textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.hello')} {' '}
            <span className="text-pink-500">{t('personal.name')}</span>,
            <br />
            {t('hero.a')} {' '}
            <span className="text-[#16f2b3]">{t('personal.designation')}</span>.
          </h1>

          <h2 className="mt-4 text-xl font-semibold text-white md:text-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {t('personal.title')}
          </h2>

          <p className="my-6 text-sm lg:text-base text-text-secondary animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {t('personal.description')}
          </p>

          <div className="flex items-center gap-5 my-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {personalData.github && (
              <Link
                href={personalData.github}
                target='_blank'
                className="transition-all text-pink-500 hover:scale-125 duration-300 glow-on-hover"
                aria-label="GitHub profile"
              >
                <BsGithub size={30} />
              </Link>
            )}
            {personalData.linkedIn && (
              <Link
                href={personalData.linkedIn}
                target='_blank'
                className="transition-all text-pink-500 hover:scale-125 duration-300 glow-on-hover"
                aria-label="LinkedIn profile"
              >
                <BsLinkedin size={30} />
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <Link href={`/${locale}#contact`} className="bg-gradient-to-r to-pink-500 from-violet-600 p-[1px] rounded-full transition-all duration-300 hover:from-pink-500 hover:to-violet-600 glow-on-hover">
              <button className="px-4 md:px-8 py-3.5 md:py-4 min-h-[44px] bg-[#0d1224] rounded-full border-none text-center text-xs md:text-sm font-medium uppercase tracking-wider text-[#ffff] no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-1 hover:gap-3" aria-label={t('common.contactMe')}>
                <span>{t('common.contactMe')}</span>
                <RiContactsFill size={16} />
              </button>
            </Link>

            <Link className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-4 md:px-8 py-3.5 md:py-4 min-h-[44px] text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold glow-on-hover" role="button" target="_blank" href={personalData.resume} aria-label={t('common.getResume')}>
              <span>{t('common.getResume')}</span>
              <MdDownload size={16} />
            </Link>
          </div>
        </div>

        {/* Image / Visual Section */}
        <div 
          ref={imageRef}
          className={`order-1 lg:order-2 flex justify-center items-center relative transition-all duration-1000 ${
            imageRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          <div 
            className="relative group"
            style={{
              transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-violet-600 to-pink-500 rounded-lg blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse-glow"></div>
            <Image
              src="/avatar.png" 
              width={380}
              height={380}
              alt={`${t('personal.name')} - ${t('personal.designation')}`}
              className="relative rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-105 cursor-pointer shadow-2xl"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);
