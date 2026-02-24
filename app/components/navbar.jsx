// @flow strict
"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './language-switcher';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const t = useTranslations('nav');
  const locale = useLocale();

  const sections = useMemo(() => ['about', 'experience', 'skills', 'projects', 'education', 'contact'], []);

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
    e.preventDefault();
    const targetId = href.split('#')[1];
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    setIsOpen(false);
  }, []);

  const NavLink = ({ href, children, section }) => {
    const isActive = activeSection === section;
    
    return (
      <Link 
        href={href} 
        onClick={(e) => handleNavClick(e, href)}
        className={`block py-2 px-3 text-sm transition-colors ${
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
        className={`block py-3 px-4 text-sm transition-colors ${
          isActive ? "text-slate-50 bg-slate-800" : "text-slate-400 hover:text-slate-200"
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-slate-200 text-xl font-semibold hover:text-slate-50 transition-colors"
          aria-label="Home"
        >
          YK
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          <NavLink href={`/${locale}#about`} section="about">{t('about')}</NavLink>
          <NavLink href={`/${locale}#experience`} section="experience">{t('experience')}</NavLink>
          <NavLink href={`/${locale}#skills`} section="skills">{t('skills')}</NavLink>
          <NavLink href={`/${locale}#projects`} section="projects">{t('projects')}</NavLink>
          <NavLink href={`/${locale}#education`} section="education">{t('education')}</NavLink>
          <NavLink href={`/${locale}#contact`} section="contact">{t('contact')}</NavLink>
          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isOpen}
            className="text-slate-400 hover:text-slate-200 p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="md:hidden border-t border-slate-800 bg-slate-900">
          <div className="py-2">
            <MobileNavLink href={`/${locale}#about`} section="about">{t('about')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#experience`} section="experience">{t('experience')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#skills`} section="skills">{t('skills')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#projects`} section="projects">{t('projects')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#education`} section="education">{t('education')}</MobileNavLink>
            <MobileNavLink href={`/${locale}#contact`} section="contact">{t('contact')}</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default memo(Navbar);