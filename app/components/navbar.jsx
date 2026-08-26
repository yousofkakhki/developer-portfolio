// @flow strict
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './language-switcher';
import { careerFacts } from '@/utils/data/career-facts';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const t = useTranslations('nav');
  const locale = useLocale();

  const sections = useMemo(() => ['projects', 'experience', 'blog', 'about', 'contact'], []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 100;
          
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleNavClick = useCallback((e, href) => {
    const targetUrl = new URL(href, window.location.origin);

    // Let Next.js navigate normally when a section lives on another route.
    if (targetUrl.pathname !== window.location.pathname) {
      setIsOpen(false);
      return;
    }

    e.preventDefault();
    const targetId = targetUrl.hash.slice(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: offsetPosition,
      behavior: reduceMotion ? 'auto' : 'smooth'
      });
      window.history.replaceState(null, '', targetUrl.hash);
    }
    
    setIsOpen(false);
  }, []);

  const NavLink = ({ href, children, section }) => {
    const isActive = activeSection === section;
    
    return (
      <Link 
        href={href} 
        onClick={(e) => handleNavClick(e, href)}
        className={`brand-nav__link px-3 text-sm transition-colors ${
          isActive ? "text-slate-50" : "text-slate-400 hover:text-slate-200"
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    );
  };

  const MobileNavLink = ({ href, children, section }) => {
    const isActive = activeSection === section;
    
    return (
      <Link 
        href={href} 
        onClick={(e) => handleNavClick(e, href)}
        className={`brand-nav__link block py-3 px-4 text-sm transition-colors ${
          isActive ? "text-slate-50 bg-slate-800" : "text-slate-400 hover:text-slate-200"
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="brand-nav" aria-label={t('primaryNavigation')}>
      <div className="brand-nav__inner flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-3 text-slate-200 transition-colors"
          aria-label={t('home')}
        >
          <span className="brand-nav__mark relative flex h-10 w-10 items-center justify-center overflow-hidden border p-1.5 transition-colors group-hover:border-cyan-400">
            <Image src="/brand/yk-micro-icon.svg" alt="" aria-hidden="true" width={32} height={32} unoptimized className="h-full w-full object-contain" />
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-sm font-medium uppercase tracking-[0.16em] text-slate-100">Yousef Kakhki</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-400">{t('brandTagline')}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <NavLink href={`/${locale}/projects`} section="projects">{t('work')}</NavLink>
            <NavLink href={`/${locale}#experience`} section="experience">{t('experience')}</NavLink>
            <NavLink href={`/${locale}/blog`} section="blog">{t('writing')}</NavLink>
            <NavLink href={`/${locale}#about`} section="about">{t('about')}</NavLink>
            <NavLink href={`/${locale}#contact`} section="contact">{t('contact')}</NavLink>
            <Link
              href={`/${locale}/work-with-me`}
              className="brand-nav__link px-3 text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
            >
              {t('discussRole')}
            </Link>
            <Link
              href={careerFacts.resume.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-nav__link px-3 text-sm text-slate-400 hover:text-slate-100 transition-colors"
            >
              {t('resume')}
            </Link>
          </div>

          <div className="ms-1 lg:ms-3">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 hover:text-slate-200 lg:hidden"
          >
            <svg aria-hidden="true" focusable="false" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-navigation" className="brand-nav__mobile border-t lg:hidden">
          <div className="py-2">
            <MobileNavLink href={`/${locale}/projects`} section="projects">{t('work')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#experience`} section="experience">{t('experience')}</MobileNavLink>
            <MobileNavLink href={`/${locale}/blog`} section="blog">{t('writing')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#about`} section="about">{t('about')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#contact`} section="contact">{t('contact')}</MobileNavLink>
            <Link
              href={`/${locale}/work-with-me`}
              onClick={() => setIsOpen(false)}
              className="brand-nav__link block py-3 px-4 text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
            >
              {t('discussRole')}
            </Link>
            <Link
              href={careerFacts.resume.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="brand-nav__link block py-3 px-4 text-sm text-slate-400 hover:text-slate-100 transition-colors"
            >
              {t('resume')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default memo(Navbar);
