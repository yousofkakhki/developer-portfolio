import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  getLocalizedProject,
  isCaseStudyProject,
  projectCatalog,
} from '@/utils/data/project-catalog';
import ProjectVisual from '@/app/components/homepage/projects/project-visual';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const title = isFa ? 'نمونه‌کارهای سیستم‌ها' : 'Systems Work';
  const description = isFa
    ? 'سه مطالعهٔ موردی فنی و پنج نمایهٔ کوتاه از کارهای یوسف کاخکی در بک‌اند، رسانهٔ بلادرنگ، پرداخت و سیستم‌های نهفته.'
    : 'Three technical case studies and five concise project snapshots across backend systems, real-time media, payments, and embedded delivery.';
  const url = `${siteUrl}/${locale}/projects`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en/projects`,
        fa: `${siteUrl}/fa/projects`,
        'x-default': `${siteUrl}/en/projects`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: isFa ? `${title} | یوسف کاخکی` : `${title} | Yousef Kakhki`,
      description,
      locale: isFa ? 'fa_IR' : 'en_US',
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fa' }];
}

export default async function ProjectsIndex({ params }) {
  const { locale } = await params;
  const language = locale === 'fa' ? 'fa' : 'en';
  const t = await getTranslations({ locale: language, namespace: 'projects' });
  const projects = projectCatalog.map(project => getLocalizedProject(project, language));
  const url = `${siteUrl}/${language}/projects`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: t('indexTitle'),
    description: t('indexIntro'),
    inLanguage: language === 'fa' ? 'fa-IR' : 'en-US',
    isPartOf: { '@id': `${siteUrl}/#website` },
    author: { '@id': `${siteUrl}/#person` },
    hasPart: projects.map(project => ({
      '@type': isCaseStudyProject(project) ? 'TechArticle' : 'CreativeWork',
      name: project.name,
      description: project.description,
      ...(isCaseStudyProject(project) && {
        url: `${siteUrl}/${language}/projects/${project.slug}`,
      }),
    })),
  };

  return (
    <div className="brand-route brand-project-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="brand-route__header">
        <div>
          <p className="brand-route__eyebrow">{t('indexEyebrow')}</p>
          <h1 className="brand-route__title">{t('indexTitle')}</h1>
        </div>
        <p className="brand-route__lead">{t('indexIntro')}</p>
      </header>

      <ol className="brand-project-index__list">
        {projects.map(project => {
          const isCaseStudy = isCaseStudyProject(project);
          const content = (
            <>
              <div className="brand-project-index__visual">
                <ProjectVisual
                  projectId={project.id}
                  visualKind={project.visualKind}
                  briefLabel={isCaseStudy ? t('caseStudyLabel') : t('snapshotLabel')}
                  categoryLabel={t(`visualKinds.${project.visualKind}`)}
                />
              </div>
              <div className="brand-project-index__copy">
                <p className="brand-content-type">
                  {isCaseStudy ? t('caseStudyLabel') : t('snapshotLabel')}
                </p>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                <dl className="brand-project-index__facts">
                  <div>
                    <dt>{t('role')}</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>{t(`outcomeTypes.${project.outcomeType}`)}</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                </dl>
                <ul className="brand-project-index__technologies" aria-label={t('technology')}>
                  {project.tools.map(tool => <li key={tool}><bdi dir="ltr">{tool}</bdi></li>)}
                </ul>
                {isCaseStudy && <span>{t('readCaseStudy')} <span aria-hidden="true">→</span></span>}
              </div>
            </>
          );

          return (
            <li id={`project-${project.slug}`} key={project.slug} className="brand-project-index__item scroll-mt-28">
              {isCaseStudy ? (
                <Link href={`/${language}/projects/${project.slug}`} className="brand-project-index__link">
                  {content}
                </Link>
              ) : (
                <article className="brand-project-index__link brand-project-index__link--snapshot">
                  {content}
                </article>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
