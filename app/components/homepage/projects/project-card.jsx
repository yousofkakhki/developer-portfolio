import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import ProjectHeroMedia from '@/app/components/projects/project-hero-media';

export default async function ProjectCard({ project }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'projects' });
  const roleLabels = {
    architecture: t('evidenceRoles.architecture'),
    product: t('evidenceRoles.product'),
    delivery: t('evidenceRoles.delivery'),
    'team-context': t('evidenceRoles.team-context'),
    'field-context': t('evidenceRoles.field-context'),
    'supporting-only': t('evidenceRoles.supporting-only'),
  };

  return (
    <article
      className="brand-panel brand-panel--interactive overflow-hidden"
      data-fact-ids={project.factIds?.join(' ')}
    >
      <ProjectHeroMedia
        project={project}
        roleLabels={roleLabels}
        fallbackLabel={t('caseStudyLabel')}
        fallbackCategory={t(`visualKinds.${project.visualKind}`)}
        compact
      />

      <div className="p-6">
        <p className="brand-content-type mb-3">{t('caseStudyLabel')}</p>
        <h3 className="mb-3 text-xl font-medium text-slate-100">{project.name}</h3>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">{project.description}</p>

        {project.role && (
          <p className="mb-4 text-sm text-slate-300">
            <span className="text-slate-400">{t('role')} </span>{project.role}
          </p>
        )}

        {project.tools?.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-2" aria-label={t('technology')}>
            {project.tools.map(tool => (
              <li key={tool} className="brand-chip font-mono text-slate-400">
                <bdi dir="ltr">{tool}</bdi>
              </li>
            ))}
          </ul>
        )}

        <div className="mb-4 text-sm leading-relaxed text-slate-300">
          <p className="text-slate-400">{t(`outcomeTypes.${project.outcomeType}`)}</p>
          <p>{project.outcome}</p>
        </div>

        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="inline-flex min-h-[44px] items-center text-cyan-300 transition-colors hover:text-cyan-100"
          aria-label={`${t('readCaseStudy')}: ${project.name}`}
        >
          {t('readCaseStudy')} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
