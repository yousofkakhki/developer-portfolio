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
    <section id="about" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-8">
          {t('about.title')}
        </h2>
        
        {/* Profile content */}
        <div className="space-y-6 text-base leading-relaxed text-slate-400">
          <p>{t('about.paragraph1')}</p>
          <p>{t('about.paragraph2')}</p>
          <p>{t('about.paragraph3')}</p>
        </div>
        
        {/* ITEX Award Callout */}
        <div className="mt-8 rounded-e border-s-4 border-burgundy bg-slate-800 p-6">
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