// @flow strict
"use client";

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { memo, useMemo, useState } from 'react';
import { careerFacts, getLocalizedRole } from '@/utils/data/career-facts';

const featuredExperienceCount = 3;

function Experience() {
  const t = useTranslations();
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const experiences = useMemo(
    () => careerFacts.roles.map(role => getLocalizedRole(role, locale)),
    [locale]
  );
  const visibleExperiences = expanded ? experiences : experiences.slice(0, featuredExperienceCount);

  return (
    <section id="experience" className="brand-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="brand-section__title text-3xl font-semibold text-slate-100 mb-4">
          {t('experience.title')}
        </h2>
        <p className="max-w-2xl mb-12 text-slate-400">
          {t('experience.featuredIntro')}
        </p>

        <div id="experience-list" className="brand-experience-list space-y-6">
          {visibleExperiences.map(exp => (
            <article
              key={exp.id}
              data-fact-id={`role.${exp.id}`}
              className="brand-panel brand-experience-card p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-medium text-slate-100">
                    {exp.title}
                  </h3>
                  <p className="text-slate-400">
                    {exp.company}
                  </p>
                </div>
                <span className="text-sm text-slate-400 font-mono whitespace-nowrap">
                  {exp.publicDate}
                </span>
              </div>

              {exp.technologies?.length > 0 && (
                <div className="mb-4">
                  <ul className="flex flex-wrap gap-2" aria-label={t('experience.technologyLabel')}>
                    {exp.technologies.map(technology => (
                      <li key={technology} className="brand-chip font-mono text-slate-300">
                        <bdi dir="ltr">{technology}</bdi>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="space-y-2 text-slate-400 text-sm">
                {exp.summary.map((desc, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span aria-hidden="true" className="text-slate-600 mt-1">—</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {experiences.length > featuredExperienceCount && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(value => !value)}
              aria-expanded={expanded}
              aria-controls="experience-list"
              className="brand-button min-h-[44px]"
            >
              {expanded ? t('experience.showFewerRoles') : t('experience.viewEarlierRoles')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(Experience);
