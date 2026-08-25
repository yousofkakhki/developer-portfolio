// @flow strict
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { personalData } from '@/utils/data/personal-data';
import { careerFacts, getPublishableMetric, localized } from '@/utils/data/career-facts';
import { ConversionLink } from '../../analytics/conversion-link';
import { AvatarFaceOverlay } from './avatar-face-overlay';

async function HeroSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const platformConcurrency = careerFacts.metrics.platformConcurrency;
  const backendExperience = careerFacts.metrics.backendExperience;

  const proofPoints = [
    {
      index: '01',
      value: getPublishableMetric(platformConcurrency, 'homepage') ? localized(platformConcurrency.localizedValue, locale) : '—',
      label: localized(platformConcurrency.label, locale),
      detail: t('hero.metricConcurrentDetail'),
    },
    {
      index: '02',
      value: getPublishableMetric(backendExperience, 'homepage') ? localized(backendExperience.localizedValue, locale) : '—',
      label: localized(backendExperience.label, locale),
      detail: t('hero.metricBackendDetail'),
    },
    {
      index: '03',
      value: t('hero.metricDegree'),
      label: t('hero.metricComputerScience'),
      detail: t('hero.metricUniversity'),
    },
  ];
  const traceSteps = t.raw('hero.trace');

  return (
    <section id="hero" className="brand-section hero-shell">
      <div className="hero-content mx-auto w-full">
        <div className="hero-layout">
          <div className="hero-identity min-w-0">
            <div className="hero-eyebrow flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em]">
              <span className="h-px w-10 bg-cyan-400" aria-hidden="true" />
              <span>{t('hero.eyebrow')}</span>
            </div>

            <div className="hero-title-group">
              <h1 className="hero-title">{t('personal.name')}</h1>
              <p className="hero-designation">{localized(careerFacts.identity.primaryTitle, locale)}</p>
            </div>

            <p className="hero-proposition">
              {t('personal.title')}
            </p>

            <p className="hero-relocation">{localized(careerFacts.relocation.statement, locale)}</p>
          </div>

          <div className="hero-action-row flex flex-wrap items-center">
            <ConversionLink
              eventName="work_with_me_view"
              source="homepage_hero"
              href={`/${locale}/work-with-me`}
              className="brand-button brand-button--primary hero-action"
            >
              {t('hero.workWithMe')}
            </ConversionLink>

            <a href={`/${locale}/projects`} className="brand-button hero-action">
              {t('hero.viewArchitecture')}
            </a>

            <ConversionLink
              eventName="resume_download"
              source="homepage_hero"
              href={careerFacts.resume.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-action inline-flex min-h-[44px] items-center px-3 py-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
            >
              {t('hero.resumePdf')}
            </ConversionLink>

            <div className="hero-socials flex items-center">
              {personalData.github && (
                <ConversionLink
                  eventName="github_click"
                  source="homepage_hero"
                  href={personalData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 transition-colors"
                  aria-label={`${t('hero.githubProfile')} (${t('common.opensInNewTab')})`}
                >
                  <BsGithub size={21} />
                </ConversionLink>
              )}
              {personalData.linkedIn && (
                <ConversionLink
                  eventName="linkedin_click"
                  source="homepage_hero"
                  href={personalData.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 transition-colors"
                  aria-label={`${t('hero.linkedinProfile')} (${t('common.opensInNewTab')})`}
                >
                  <BsLinkedin size={21} />
                </ConversionLink>
              )}
            </div>
          </div>

          <div className="hero-portrait-column flex shrink-0 justify-center">
            <div className="hero-portrait-frame">
              <div className="hero-portrait relative overflow-hidden">
                <Image
                  src="/avatar-page-background.webp"
                  alt={t('personal.name')}
                  width={512}
                  height={512}
                  sizes="(max-width: 767px) 272px, (max-width: 1023px) 224px, 344px"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                  priority
                />
                <AvatarFaceOverlay />
              </div>
              <div className="hero-portrait-meta" aria-hidden="true">
                <span>Portrait / 01</span>
                <span>YK · Systems</span>
              </div>
            </div>
          </div>

          <ol className="hero-trace" aria-label={t('hero.focusAreas')}>
            {traceSteps.map((step, index) => (
              <li className="hero-trace__step" key={step}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <bdi>{step}</bdi>
              </li>
            ))}
          </ol>

          <div className="hero-proof-grid" aria-label={t('hero.focusAreas')}>
            {proofPoints.map(point => (
              <div className="hero-proof" key={point.index}>
                <span className="hero-proof-index" aria-hidden="true">{point.index}</span>
                <div className="hero-metric-value font-mono font-semibold">{point.value}</div>
                <div className="hero-metric-label text-sm">{point.label}</div>
                <div className="hero-metric-detail text-xs font-mono">{point.detail}</div>
              </div>
            ))}
          </div>

          <div className="hero-credentials flex flex-wrap text-sm text-slate-400">
            <span>{localized(careerFacts.identity.primaryTitle, locale)}</span>
            <span aria-hidden="true">•</span>
            <span>WebRTC · LiveKit</span>
            <span aria-hidden="true">•</span>
            <span>NATS · Kafka</span>
            <span aria-hidden="true">•</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
