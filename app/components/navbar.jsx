// @flow strict
"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './language-switcher';

/**
 * Navbar component - Main navigation with active section detection
 * Updated: Force recompilation
 * @returns {JSX.Element}
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const t = useTranslations('nav');
  const locale = useLocale();

  // Memoize sections array to prevent recreation on each render
  const sections = useMemo(() => ['about', 'experience', 'skills', 'projects', 'education', 'contact'], []);

  // Track active section on scroll - optimized with throttling
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
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Smooth scroll handler - memoized
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const targetId = href.split('#')[1];
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80; // Account for navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    setIsOpen(false);
  }, []);

  // Enhanced nav link component
  const NavLink = ({ href, children, section }) => {
    const isActive = activeSection === section;
    const baseClasses = "relative block py-2 px-3 text-white transition-all duration-300 rounded-md";
    const activeClasses = isActive 
      ? "text-[#16f2b3] font-semibold" 
      : "hover:text-[#16f2b3] hover:bg-[#1a1443]/50";
    
    return (
      <Link 
        href={href} 
        onClick={(e) => handleNavClick(e, href)}
        className={`${baseClasses} ${activeClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#16f2b3] to-pink-500 rounded-full animate-scale-in"></span>
        )}
      </Link>
    );
  };

  // Mobile nav link component
  const MobileNavLink = ({ href, children, section }) => {
    const isActive = activeSection === section;
    const baseClasses = "block py-3 px-4 text-white transition-all duration-300 rounded-md w-full text-center";
    const activeClasses = isActive 
      ? "text-[#16f2b3] font-semibold bg-[#1a1443]" 
      : "hover:text-[#16f2b3] hover:bg-[#1a1443]/50";
    
    return (
      <Link 
        href={href} 
        onClick={(e) => handleNavClick(e, href)}
        className={`${baseClasses} ${activeClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-transparent relative z-[60] glass-strong backdrop-blur-md border-b border-[#1a1443]/50">
      <div className="flex items-center justify-between py-4">
        {/* Logo with hover effect */}
        <div className="flex-shrink-0">
          <Link
            href={`/${locale}`}
            className="group relative text-[#16f2b3] text-3xl font-bold transition-all duration-300 hover:text-pink-500 hover:scale-110 inline-block"
            aria-label="Home"
          >
            <span className="relative z-10">YK</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#16f2b3] to-pink-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <NavLink href={`/${locale}#about`} section="about">{t('about')}</NavLink>
          <NavLink href={`/${locale}#experience`} section="experience">{t('experience')}</NavLink>
          <NavLink href={`/${locale}#skills`} section="skills">{t('skills')}</NavLink>
          <NavLink href={`/${locale}#projects`} section="projects">{t('projects')}</NavLink>
          <NavLink href={`/${locale}#education`} section="education">{t('education')}</NavLink>
          <NavLink href={`/${locale}#contact`} section="contact">
            {locale === 'fa' ? 'تماس با من' : 'CONTACT'}
          </NavLink>
          <div className="ms-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isOpen}
            className="relative text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#16f2b3] focus:ring-offset-2 focus:ring-offset-[#0d1224] rounded-md w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300 hover:bg-[#1a1443]/50"
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute top-0 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? 'rotate-45 top-2.5' : ''
                }`}
              ></span>
              <span 
                className={`absolute top-2.5 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span 
                className={`absolute top-5 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? '-rotate-45 top-2.5' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu with smooth animation */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 z-[60] bg-[#0d1224] border-t border-[#25213b] glass-strong overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col items-stretch space-y-1 py-4 px-2">
          <li><MobileNavLink href={`/${locale}#about`} section="about">{t('about')}</MobileNavLink></li>
          <li><MobileNavLink href={`/${locale}#experience`} section="experience">{t('experience')}</MobileNavLink></li>
          <li><MobileNavLink href={`/${locale}#skills`} section="skills">{t('skills')}</MobileNavLink></li>
          <li><MobileNavLink href={`/${locale}#projects`} section="projects">{t('projects')}</MobileNavLink></li>
          <li><MobileNavLink href={`/${locale}#education`} section="education">{t('education')}</MobileNavLink></li>
          <li><MobileNavLink href={`/${locale}#contact`} section="contact">
            {locale === 'fa' ? 'تماس با من' : 'CONTACT'}
          </MobileNavLink></li>
        </ul>
      </div>
    </nav>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(Navbar);