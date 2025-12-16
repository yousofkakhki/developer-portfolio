// @flow strict
"use client";
import { useTranslations, useLocale } from 'next-intl';
import { useScrollReveal } from '@/utils/hooks/useScrollReveal';
import { memo } from 'react';

/**
 * AboutSection component - Displays about me information
 * @returns {JSX.Element}
 */
function AboutSection() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';
  const [sectionRef, sectionRevealed] = useScrollReveal({ threshold: 0.2 });
  const [contentRef, contentRevealed] = useScrollReveal({ threshold: 0.15 });

  return (
    <div 
      id="about" 
      ref={sectionRef}
      className={`my-12 lg:my-16 relative transition-all duration-1000 ${
        sectionRevealed ? 'opacity-100' : 'opacity-100'
      }`}
    >
      {/* Enhanced background decoration with animation */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-0 start-0 w-64 h-64 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 end-0 w-64 h-64 bg-gradient-to-tl from-[#16f2b3] to-violet-600 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* This new grid creates a 12-column layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative">
        
        {/* Main Text Content - This now lives in the first 10 columns */}
        <div 
          ref={contentRef}
          className={`lg:col-span-10 flex flex-col gap-6 transition-all duration-1000 ${
            contentRevealed 
              ? 'opacity-100 translate-x-0' 
              : `opacity-0 ${isRTL ? 'translate-x-10' : '-translate-x-10'}`
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-[2px] bg-gradient-to-r rtl:bg-gradient-to-l from-[#16f2b3] to-transparent animate-shimmer`}></div>
            <p className="font-medium text-[#16f2b3] text-xl uppercase tracking-wider text-gradient">
              {t('about.title')}
            </p>
            <div className="flex-1 h-[2px] bg-gradient-to-r rtl:bg-gradient-to-l from-transparent via-[#16f2b3] to-transparent animate-shimmer"></div>
          </div>
          <p className="text-text-secondary text-base lg:text-lg whitespace-pre-line leading-relaxed">
            {t('personal.about')}
          </p>
        </div>

        {/* Decorative Sidebar - This now lives in the last 2 columns */}
        <div 
          className={`hidden lg:flex flex-col items-center justify-center lg:col-span-2 transition-all duration-1000 ${
            contentRevealed 
              ? 'opacity-100 translate-x-0' 
              : `opacity-0 ${isRTL ? '-translate-x-10' : 'translate-x-10'}`
          }`}
        >
          <span className="bg-gradient-to-br from-[#1a1443] to-[#25213b] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md border border-[#16f2b3]/20 shadow-lg glass hover:border-[#16f2b3]/40 transition-all duration-300">
            {t('about.sidebar')}
          </span>
          <span className="h-36 w-[2px] bg-gradient-to-b from-[#1a1443] via-[#16f2b3] to-[#1a1443] animate-pulse-glow"></span>
        </div>

      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(AboutSection);