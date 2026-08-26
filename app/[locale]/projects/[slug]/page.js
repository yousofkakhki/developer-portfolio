import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ConversionLink, ConversionView } from '@/app/components/analytics/conversion-link';
import ProjectVisual from '@/app/components/homepage/projects/project-visual';
import { getProjectCaseStudy } from '@/utils/data/project-case-studies';
import { getLocalBlogBySlug } from '@/utils/data/local-blogs';
import {
  caseStudyProjects,
  getLocalizedProject,
  getProjectBySlug,
} from '@/utils/data/project-catalog';
import { locales } from '@/i18n';

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
      title: `${project.name} | Yousef Kakhki`,
      description: project.description,
      locale: language === 'fa' ? 'fa_IR' : 'en_US',
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
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
  const url = `${siteUrl}/${language}/projects/${project.slug}`;
  const related = (caseStudy.relatedWriting || [])
    .map(relatedSlug => getLocalBlogBySlug(relatedSlug, language))
    .filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#case-study`,
        name: project.name,
        description: project.description,
        url,
        inLanguage: language === 'fa' ? 'fa-IR' : 'en-US',
        author: { '@id': `${siteUrl}/#person` },
        keywords: project.tools.join(', '),
        about: caseStudy.category,
        isPartOf: { '@id': `${siteUrl}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: language === 'fa' ? 'خانه' : 'Home', item: `${siteUrl}/${language}` },
          { '@type': 'ListItem', position: 2, name: t('indexTitle'), item: `${siteUrl}/${language}/projects` },
          { '@type': 'ListItem', position: 3, name: project.name, item: url },
        ],
      },
    ],
  };

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

      <figure className="brand-case-brief__visual">
        {project.images?.[0] ? (
          <Image
            src={project.images[0]}
            width={1280}
            height={720}
            sizes="(max-width: 768px) 100vw, 1216px"
            priority
            alt={caseStudy.visualAlt}
            className="h-auto w-full object-cover"
          />
        ) : (
          <div className="h-72 md:h-[30rem]">
            <ProjectVisual
              projectId={project.id}
              visualKind={project.visualKind}
              briefLabel={t('caseStudyLabel')}
              categoryLabel={caseStudy.category}
            />
          </div>
        )}
        <figcaption>{caseStudy.visualCaption}</figcaption>
      </figure>

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
