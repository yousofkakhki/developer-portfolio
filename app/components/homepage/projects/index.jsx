// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import ProjectCard from './project-card';
import { memo } from 'react';
import { useScrollReveal } from '@/utils/hooks/useScrollReveal';

/**
 * Projects component - Displays a list of project cards.
 * @returns {JSX.Element}
 */
const Projects = () => {
  const t = useTranslations();
  const [sectionRef, sectionRevealed] = useScrollReveal({ 
    threshold: 0.01,
    rootMargin: '200px 0px -100px 0px'
  });

  return (
    <div 
      id='projects' 
      ref={sectionRef}
      className={`relative z-50 my-12 lg:my-24 overflow-hidden transition-all duration-1000 ${
        sectionRevealed ? 'opacity-100' : 'opacity-100'
      }`}
    >
      <Image
        src="/section.svg"
        alt=""
        width={1572}
        height={795}
        className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-none h-auto"
        aria-hidden="true"
        loading="lazy"
      />
      <div className="flex justify-center -mb-4">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 filter blur-3xl opacity-30"></div>
      </div>
      
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-gradient-to-r from-transparent to-[#1a1443]"></span>
          <span className="bg-gradient-to-br from-[#1a1443] to-[#25213b] w-fit text-white p-2 px-5 text-xl rounded-md border border-[#16f2b3]/20 shadow-lg">
            {t('projects.title')}
          </span>
          <span className="w-24 h-[2px] bg-gradient-to-l from-transparent to-[#1a1443]"></span>
        </div>
      </div>

      {/* This is now a simple container with a vertical gap */}
      <div className="pt-12 flex flex-col gap-8 lg:gap-16">
        {
          [1, 2, 3, 4, 5, 6, 7, 8].map((id) => {
            const project = t.raw(`projects.${id}`);
            return (
              <div className="w-full max-w-4xl mx-auto" key={id}>
                <ProjectCard project={{ ...project, id, images: getProjectImages(id), tools: project.tools || [] }} />
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

// Helper function to get project images
function getProjectImages(id) {
  const imageMap = {
    // Project 1: Capitalino - AI Hologram (Award-Winning, ITEX 2024)
    1: ['/ai-1.jpg', '/ai-2.jpg', '/ai-3.jpg', '/ai-4.jpg', '/ai-5.jpg', '/ai-6.jpg'],
    // Project 2: Capitalino - Digital Investment Dashboard
    2: ['/capitalino-1.jpg', '/capitalino-2.jpg', '/capitalino-3.jpg'],
    // Project 3: Capitalino - Crypto-to-Fiat Payment Gateway
    3: ['/png/placeholder.png', '/png/placeholder.png'], // TODO: Add gateway screenshots
    // Project 4: Financial Trading Gamification Platform (ITEX 2023)
    4: ['/game-1.jpg', '/png/placeholder.png'], // TODO: Add game-2.png if available
    // Project 5: Batna - Secure OTA Update System
    5: ['/ota-1.jpg', '/ota-2.jpg', '/ota-3.jpg'],
    // Project 6: GreedyLearner - Gamified Algorithm Tutor
    6: ['/png/placeholder.png', '/png/placeholder.png'], // TODO: Add learner screenshots
    // Project 7: Avin Avisa - P2P Cryptocurrency Trading Platform
    7: ['/png/placeholder.png', '/png/placeholder.png'], // TODO: Add P2P platform screenshots
    // Project 8: Blockchain-Based Virtual Coin System
    8: ['/png/placeholder.png', '/png/placeholder.png'] // TODO: Add blockchain coin system screenshots
  };
  return imageMap[id] || [];
}

export default Projects;