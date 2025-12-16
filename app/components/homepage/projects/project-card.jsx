// @flow strict
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, memo, useMemo, useCallback } from 'react';
import { FaCode, FaPlay } from 'react-icons/fa';
import { useScrollReveal } from '@/utils/hooks/useScrollReveal';
import dynamic from 'next/dynamic';

// Dynamically import Swiper component to reduce initial bundle size
// Swiper is a large library (~50KB), so we lazy load it
const ProjectCardSwiper = dynamic(
  () => import('./project-card-swiper'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden bg-[#0d1224] animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#16f2b3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
  }
);

/**
 * ProjectCard component - Displays project information with image carousel
 * @param {Object} props
 * @param {Object} props.project - Project data object
 * @param {string} props.project.name - Project name
 * @param {string} props.project.description - Project description
 * @param {string} props.project.role - User's role in the project
 * @param {string[]} props.project.tools - Array of tools/technologies used
 * @param {string[]} props.project.images - Array of image URLs
 * @param {string} [props.project.demo] - Demo URL (optional)
 * @param {string} [props.project.code] - Source code URL (optional)
 */
function ProjectCard({ project }) {
  const t = useTranslations('projects');
  const [cardRef, cardRevealed] = useScrollReveal({ 
    threshold: 0.05,
    rootMargin: '100px 0px -50px 0px'
  });
  const [isHovered, setIsHovered] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoize project data to prevent unnecessary recalculations
  const hasDemo = useMemo(() => project.demo && project.demo.trim(), [project.demo]);
  const hasCode = useMemo(() => project.code && project.code.trim(), [project.code]);

  return (
    <div 
      ref={cardRef}
      className={`group flex flex-col items-stretch gap-8 p-4 md:p-8 glass-strong shadow-2xl rounded-lg border border-[#1a1443] transition-all duration-500 ${
        cardRevealed 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-100 translate-y-0 scale-100'
      } hover:border-[#16f2b3]/40 hover:shadow-[0_0_30px_rgba(22,242,179,0.2)] card-3d`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Carousel with enhanced styling */}
      <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden bg-[#0d1224] relative group/image">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16f2b3]/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
        
        <ProjectCardSwiper images={project.images} projectName={project.name} />
      </div>

      {/* Project Details with enhanced typography */}
      <div className="w-full flex flex-col justify-between p-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#16f2b3] mb-4 group-hover:text-gradient transition-all duration-300">
            {project.name}
          </h3>
          <p className="text-text-secondary mb-4 text-justify leading-relaxed">
            {project.description}
          </p>
          <div className="mb-4">
            <span className="font-semibold text-text-primary">{t('myRole')}</span>
            <span className="text-text-tertiary ms-2 rtl:me-2 rtl:ms-0">{project.role}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <span className="font-semibold text-text-primary me-2 rtl:ms-2 rtl:me-0">{t('tools')}</span>
            {project.tools.map((tool, index) => (
              <span 
                key={index} 
                className="bg-[#1a1443] px-3 py-1 rounded-md text-sm text-violet-400 border border-violet-400/20 hover:border-violet-400/40 hover:bg-[#25213b] transition-all duration-300 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 min-h-[24px]">
            {hasDemo ? (
              <Link 
                href={project.demo} 
                target='_blank' 
                rel="noopener noreferrer" 
                className="group/link flex items-center gap-2 text-white hover:text-[#16f2b3] transition-all duration-300 relative overflow-hidden"
                aria-label={`View demo of ${project.name}`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 translate-x-[-100%] group-hover/link:translate-x-[100%] transition-transform duration-700"></span>
                <FaPlay className="transition-transform group-hover/link:scale-110" />
                <span className="relative">{t('viewDemo')}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-text-tertiary opacity-60">
                <FaPlay className="opacity-50" />
                <span className="text-sm">{t('demoNotAvailable') || 'Demo not available'}</span>
              </div>
            )}
            {hasCode ? (
              <Link 
                href={project.code} 
                target='_blank' 
                rel="noopener noreferrer" 
                className="group/link flex items-center gap-2 text-white hover:text-[#16f2b3] transition-all duration-300 relative overflow-hidden"
                aria-label={`View source code of ${project.name}`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 translate-x-[-100%] group-hover/link:translate-x-[100%] transition-transform duration-700"></span>
                <FaCode className="transition-transform group-hover/link:scale-110" />
                <span className="relative">{t('viewCode')}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-text-tertiary opacity-60">
                <FaCode className="opacity-50" />
                <span className="text-sm">{t('codeNotAvailable') || 'Code not available'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(ProjectCard);