import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ConversionLink, ConversionView } from '@/app/components/analytics/conversion-link';
import ProjectArtifactList from '@/app/components/projects/project-artifact-list';
import ProjectEvidenceGallery from '@/app/components/projects/project-evidence-gallery';
import ProjectHeroMedia from '@/app/components/projects/project-hero-media';
import ProjectStateTransitionTable from '@/app/components/projects/project-state-transition-table';
import { getProjectCaseStudy } from '@/utils/data/project-case-studies';
import projectSchema from '@/utils/data/project-schema.cjs';
import { getLocalBlogBySlug } from '@/utils/data/local-blogs';
import {
  caseStudyProjects,
  getLocalizedProject,
  getProjectBySlug,
} from '@/utils/data/project-catalog';
import { careerFacts, localized } from '@/utils/data/career-facts';
import { locales } from '@/i18n';

const { buildProjectCaseStudyGraph } = projectSchema;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';

function getProjectContent(locale, slug) {
  return getLocalizedProject(getProjectBySlug(slug), locale);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap(locale => caseStudyProjects.map(project => ({
    locale,
    slug: project.slug,
  })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const language = locale === 'fa' ? 'fa' : 'en';
  const project = getProjectContent(language, slug);
  if (!project) return {};

  const url = `${siteUrl}/${language}/projects/${project.slug}`;
  const ownerName = localized(careerFacts.identity.localizedName, language);
  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en/projects/${project.slug}`,
        fa: `${siteUrl}/fa/projects/${project.slug}`,
        'x-default': `${siteUrl}/en/projects/${project.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: `${project.name} | ${ownerName}`,
      description: project.description,
      locale: language === 'fa' ? 'fa_IR' : 'en_US',
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { locale, slug } = await params;
  const language = locale === 'fa' ? 'fa' : 'en';
  const project = getProjectContent(language, slug);
  if (!project) notFound();
  const t = await getTranslations({ locale: language, namespace: 'projects' });
  const caseStudy = getProjectCaseStudy(project.slug, language);
  if (!caseStudy) notFound();

  const narrativeSections = Object.entries(caseStudy.sections)
    .filter(([key, section]) => !['outcomes', 'evidence'].includes(key) && section?.body?.trim());
  const evidenceBoundary = caseStudy.sections.evidence?.body;
  const roleLabels = {
    architecture: t('evidenceRoles.architecture'),
    product: t('evidenceRoles.product'),
    delivery: t('evidenceRoles.delivery'),
    'team-context': t('evidenceRoles.team-context'),
    'field-context': t('evidenceRoles.field-context'),
    'supporting-only': t('evidenceRoles.supporting-only'),
  };
  const url = `${siteUrl}/${language}/projects/${project.slug}`;
  const related = (caseStudy.relatedWriting || [])
    .map(relatedSlug => getLocalBlogBySlug(relatedSlug, language))
    .filter(Boolean);
  const jsonLd = buildProjectCaseStudyGraph({
    project,
    category: caseStudy.category,
    locale: language,
    siteUrl,
    projectsLabel: t('indexTitle'),
  });

  return (
    <div className="brand-route brand-case-brief">
      <ConversionView eventName="project_case_study_view" source="project_case_study_page" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <Link href={`/${language}/projects`} className="brand-route__back">
        <span aria-hidden="true">←</span>
        <span>{t('backToProjects')}</span>
      </Link>

      <header className="brand-route__header brand-case-brief__header">
        <div>
          <p className="brand-route__eyebrow">{t('caseStudyLabel')}</p>
          <h1 className="brand-route__title">{project.name}</h1>
        </div>
        <p className="brand-route__lead">{project.description}</p>
      </header>

      <ProjectHeroMedia
        project={project}
        roleLabels={roleLabels}
        fallbackLabel={t('caseStudyLabel')}
        fallbackCategory={caseStudy.category}
        priority
      />

      <section className="brand-case-brief__facts" aria-label={t('projectFacts')}>
        <div className="brand-case-brief__fact">
          <h2>{t('role')}</h2>
          <p>{project.role}</p>
        </div>
        <div className="brand-case-brief__fact">
          <h2>{t('technology')}</h2>
          <ul aria-label={t('technology')}>
            {project.tools.map(tool => <li key={tool}><bdi dir="ltr">{tool}</bdi></li>)}
          </ul>
        </div>
      </section>

      <div className="brand-case-study-grid">
        {narrativeSections.map(([key, section]) => (
          <section key={key} className={`brand-route__section brand-case-study-section brand-case-study-section--${key}`} aria-labelledby={`${key}-heading`}>
            <h2 id={`${key}-heading`} className="brand-route__section-title">{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}

        <section className="brand-route__section brand-case-study-section brand-case-study-section--outcomes" aria-labelledby="outcomes-heading">
          <p className="brand-content-type">{t(`outcomeTypes.${project.outcomeType}`)}</p>
          <h2 id="outcomes-heading" className="brand-route__section-title">{t('sectionOutcomes')}</h2>
          <p>{project.outcome}</p>
        </section>

        {evidenceBoundary && (
          <section className="brand-route__section brand-case-study-section brand-case-study-section--evidence" aria-labelledby="evidence-heading">
            <h2 id="evidence-heading" className="brand-route__section-title">{t('evidenceBoundary')}</h2>
            <p>{evidenceBoundary}</p>
          </section>
        )}
      </div>

      <ProjectStateTransitionTable stateTransitions={caseStudy.stateTransitions} />

      <ProjectEvidenceGallery
        media={project.media}
        title={t('visualEvidence')}
        roleLabels={roleLabels}
      />

      <ProjectArtifactList
        artifacts={project.artifacts}
        sourceAvailability={project.sourceAvailability}
        title={t('projectArtifacts')}
        privateSourceNote={t('privateSourceNote')}
      />

      {related.length > 0 && (
        <section className="brand-route__section brand-case-study-related" aria-labelledby="related-writing-heading">
          <h2 id="related-writing-heading" className="brand-route__section-title">{t('relatedWriting')}</h2>
          <ul>
            {related.map(article => (
              <li key={article.slug}><Link href={`/${language}/blog/${article.slug}`}>{article.title} <span aria-hidden="true">→</span></Link></li>
            ))}
          </ul>
        </section>
      )}

      <section className="brand-route__cta" aria-labelledby="project-contact-heading">
        <h2 id="project-contact-heading">{t('discussSimilarWork')}</h2>
        <ConversionLink
          eventName="project_case_study_contact"
          source="project_case_study_page"
          href={`/${language}/work-with-me`}
          className="brand-button brand-button--primary"
        >
          {t('discussSimilarWork')}
        </ConversionLink>
      </section>
    </div>
  );
}
