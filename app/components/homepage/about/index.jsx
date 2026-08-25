// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import { memo } from 'react';

/**
 * AboutSection component - Clean professional background section
 */
function AboutSection() {
  const t = useTranslations();

  return (
    <section id="about" className="brand-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="brand-section__title text-3xl font-semibold text-slate-100 mb-8">
          {t('about.title')}
        </h2>
        
        {/* Profile content */}
        <div className="brand-about-copy space-y-6 text-base leading-relaxed text-slate-400">
          <p>{t('about.paragraph1')}</p>
          <p>{t('about.paragraph2')}</p>
          <p>{t('about.paragraph3')}</p>
        </div>
        
        {/* ITEX Award Callout */}
        <div className="brand-panel brand-panel--accent brand-award mt-10 p-6">
          <div className="flex items-start gap-3">
            <span className="text-cyan-400 text-xl">🏆</span>
            <div>
              <p className="text-slate-200 font-medium">{t('about.awardTitle')}</p>
              <p className="text-slate-400 text-sm mt-1">
                {t('about.awardDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutSection);