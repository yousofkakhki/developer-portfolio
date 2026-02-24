// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import Image from "next/image";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { personalData } from "@/utils/data/personal-data";
import { memo } from "react";

function HeroSection() {
  const t = useTranslations();

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-10">
          
          {/* Text column */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-50 mb-2">
              {t('personal.name')}
            </h1>
            
            <h2 className="text-xl md:text-2xl font-medium text-slate-300 mb-4">
              {t('personal.designation')}
            </h2>
            
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              {t('personal.title')}
            </p>
            
            {/* Key Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="border border-slate-700 bg-slate-800 p-4 rounded">
                <div className="text-2xl font-semibold text-slate-50 font-mono">1,200+</div>
                <div className="text-sm text-slate-400">Concurrent Users</div>
                <div className="text-xs text-slate-500 font-mono">WebRTC/HLS</div>
              </div>
              <div className="border border-slate-700 bg-slate-800 p-4 rounded">
                <div className="text-2xl font-semibold text-slate-50 font-mono">Sub-100ms</div>
                <div className="text-sm text-slate-400">Latency</div>
                <div className="text-xs text-slate-500 font-mono">Trade Execution</div>
              </div>
              <div className="border border-slate-700 bg-slate-800 p-4 rounded">
                <div className="text-2xl font-semibold text-slate-50 font-mono">78%</div>
                <div className="text-sm text-slate-400">Cost Reduction</div>
                <div className="text-xs text-slate-500 font-mono">Infrastructure</div>
              </div>
            </div>
            
            {/* Credentials Strip */}
            <div className="flex flex-wrap gap-3 mb-8 text-sm text-slate-500">
              <span>M.Sc. System Design</span>
              <span>•</span>
              <span>Tehran Polytechnic</span>
              <span>•</span>
              <span>IELTS 7.5</span>
              <span>•</span>
              <span>EU Blue Card Eligible</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4 flex-wrap">
              <a 
                href="#experience"
                className="inline-block px-6 py-3 border border-slate-500 text-slate-100 rounded hover:bg-slate-800 transition-colors"
              >
                View architecture work ↓
              </a>
              
              <a
                href="/files/yousef-kakhki-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Download Résumé (PDF)
              </a>
              
              <div className="flex items-center gap-4">
                {personalData.github && (
                  <Link
                    href={personalData.github}
                    target='_blank'
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="GitHub profile"
                  >
                    <BsGithub size={24} />
                  </Link>
                )}
                {personalData.linkedIn && (
                  <Link
                    href={personalData.linkedIn}
                    target='_blank'
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <BsLinkedin size={24} />
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile image column */}
          <div className="flex-shrink-0 flex justify-center md:justify-end">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden">
              <Image
                src="/avatar.png"
                alt={t('personal.name')}
                width={256}
                height={256}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);
