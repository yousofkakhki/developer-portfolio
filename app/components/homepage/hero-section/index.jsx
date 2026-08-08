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
