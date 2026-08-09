// @flow strict
import { getLocale, getTranslations } from 'next-intl/server';
import Link from "next/link";
import Image from "next/image";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { personalData } from "@/utils/data/personal-data";
import { ConversionLink } from "../../analytics/conversion-link";
import { AvatarFaceOverlay } from './avatar-face-overlay';

async function HeroSection() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-10">
          
          {/* Text column */}
          <div className="flex-1">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-400">
              <span className="h-px w-10 bg-cyan-400" aria-hidden="true" />
              <span>Systems Backbone / 01</span>
            </div>
            {locale === 'en' ? (
              <div className="mb-6 max-w-[560px]" data-brand-lockup>
                <Image
                  src="/brand/yk-horizontal-lockup.svg"
                  alt="Yousef Kakhki — System Architect & Technical Lead"
                  width={900}
                  height={300}
                  className="h-auto w-full object-contain object-left"
                />
                <h1 className="sr-only">{t('personal.name')}</h1>
                <h2 className="sr-only">{t('personal.designation')}</h2>
              </div>
            ) : (
              <>
                <h1 className="font-display text-4xl font-medium tracking-[0.08em] text-slate-50 md:text-5xl">
                  {t('personal.name')}
                </h1>
                <h2 className="mt-3 text-xl font-medium tracking-[0.12em] text-cyan-400 md:text-2xl">
                  {t('personal.designation')}
                </h2>
              </>
            )}
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              {t('personal.title')}
            </p>
            <div className="mt-5 hidden max-w-2xl border-t border-slate-700/70 pt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 sm:block">
              Distributed Systems <span className="text-cyan-400">•</span> Real-Time Platforms <span className="text-cyan-400">•</span> AI Systems <span className="text-cyan-400">•</span> Infrastructure
            </div>
            
            {/* Key Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="border border-slate-700 bg-slate-800 p-4 rounded">
                <div className="text-2xl font-semibold text-slate-50 font-mono">5,000+</div>
                <div className="text-sm text-slate-400">Concurrent Users</div>
                <div className="text-xs text-slate-400 font-mono">WebRTC/HLS</div>
              </div>
              <div className="border border-slate-700 bg-slate-800 p-4 rounded">
                <div className="text-2xl font-semibold text-slate-50 font-mono">10+ Years</div>
                <div className="text-sm text-slate-400">Backend Engineering</div>
                <div className="text-xs text-slate-400 font-mono">Node.js · Go · Python</div>
              </div>
              <div className="border border-slate-700 bg-slate-800 p-4 rounded">
                <div className="text-2xl font-semibold text-slate-50 font-mono">M.Sc.</div>
                <div className="text-sm text-slate-400">Computer Science</div>
                <div className="text-xs text-slate-400 font-mono">Amirkabir University</div>
              </div>
            </div>
            
            {/* Credentials Strip */}
            <div className="flex flex-wrap gap-3 mb-8 text-sm text-slate-400">
              <span>Senior Backend Engineer</span>
              <span>•</span>
              <span>WebRTC · LiveKit</span>
              <span>•</span>
              <span>NATS · Kafka</span>
              <span>•</span>
              <span>PostgreSQL</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4 flex-wrap">
              <a 
                href="#experience"
                className="inline-block px-6 py-3 border border-slate-500 text-slate-100 rounded hover:bg-slate-800 transition-colors"
              >
                View architecture work ↓
              </a>
              
              <ConversionLink
                eventName="work_with_me_view"
                source="homepage_hero"
                href={`/${locale}/work-with-me`}
                className="inline-block px-6 py-3 bg-cyan-700 text-white rounded hover:bg-cyan-600 transition-colors"
              >
                {locale === 'fa' ? 'همکاری با من' : 'Work with me'}
              </ConversionLink>

              <ConversionLink
                eventName="resume_download"
                source="homepage_hero"
                href="/files/yousef-kakhki-resume-2026-06.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Download Résumé (PDF)
              </ConversionLink>
              
              <div className="flex items-center gap-4">
                {personalData.github && (
                  <ConversionLink
                    eventName="github_click"
                    source="homepage_hero"
                    href={personalData.github}
                    target='_blank'
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="GitHub profile"
                  >
                    <BsGithub size={24} />
                  </ConversionLink>
                )}
                {personalData.linkedIn && (
                  <ConversionLink
                    eventName="linkedin_click"
                    source="homepage_hero"
                    href={personalData.linkedIn}
                    target='_blank'
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <BsLinkedin size={24} />
                  </ConversionLink>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile image column */}
          <div className="flex-shrink-0 flex justify-center md:justify-end">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden">
              <Image
                src="/avatar-512.webp"
                alt={t('personal.name')}
                width={256}
                height={256}
                sizes="(max-width: 767px) 192px, 256px"
                fetchPriority="high"
                className="object-cover w-full h-full"
                priority
              />
              <AvatarFaceOverlay />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
