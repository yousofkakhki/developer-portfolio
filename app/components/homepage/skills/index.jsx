import { getLocale, getTranslations } from 'next-intl/server';
import { careerFacts, localized } from '@/utils/data/career-facts';

export default async function Skills() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'skills' });

  return (
    <section id="skills" className="brand-section" aria-labelledby="skills-heading">
      <div className="mx-auto max-w-5xl">
        <h2 id="skills-heading" className="brand-section__title mb-12 text-3xl font-semibold text-slate-100">
          {t('title')}
        </h2>

        <ul className="space-y-8">
          {careerFacts.technologyGroups.map(group => (
            <li key={group.id} className="brand-skill-group">
              <h3 className="mb-3 font-mono text-sm uppercase tracking-wide text-slate-400">
                {localized(group.label, locale)}
              </h3>
              <ul className="flex flex-wrap gap-2" aria-label={localized(group.label, locale)}>
                {group.technologies.map(technology => (
                  <li key={technology} className="brand-chip text-sm">
                    <bdi dir="ltr">{technology}</bdi>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
