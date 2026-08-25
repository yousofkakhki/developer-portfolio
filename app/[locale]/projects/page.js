import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { projectCatalog } from '@/utils/data/project-catalog';
import ProjectVisual from '@/app/components/homepage/projects/project-visual';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const title = isFa ? 'مطالعات موردی سیستم‌ها | یوسف کاخکی' : 'Systems Case Studies | Yousef Kakhki';
  const description = isFa
    ? 'مطالعات موردی معماری بک‌اند، رسانهٔ بلادرنگ، پرداخت و پلتفرم‌های توزیع‌شدهٔ یوسف کاخکی.'
    : 'Evidence-led case studies covering backend architecture, real-time media, payments, and distributed platforms by Yousef Kakhki.';
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
      title,
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
  const t = await getTranslations({ locale, namespace: 'projects' });
  const projects = projectCatalog.map(project => ({
    ...project,
    ...t.raw(String(project.id)),
  }));
  const url = `${siteUrl}/${locale}/projects`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: t('indexTitle'),
    description: t('indexIntro'),
    inLanguage: locale === 'fa' ? 'fa-IR' : 'en-US',
    isPartOf: { '@id': `${siteUrl}/#website` },
    author: { '@id': `${siteUrl}/#person` },
    hasPart: projects.map(project => ({
      '@type': 'CreativeWork',
      name: project.name,
      url: `${siteUrl}/${locale}/projects/${project.slug}`,
    })),
  };

  return (
    <div className="brand-route brand-project-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="brand-route__header">
        <div>
          <p className="brand-route__eyebrow">{t('architectureBrief')} / Index</p>
          <h1 className="brand-route__title">{t('indexTitle')}</h1>
        </div>
        <p className="brand-route__lead">{t('indexIntro')}</p>
      </header>

      <ol className="brand-project-index__list">
        {projects.map(project => (
          <li key={project.slug} className="brand-project-index__item">
            <Link href={`/${locale}/projects/${project.slug}`} className="brand-project-index__link">
              <div className="brand-project-index__visual">
                <ProjectVisual
                  projectId={project.id}
                  visualKind={project.visualKind}
                  briefLabel={t('architectureBrief')}
                  categoryLabel={t(`visualKinds.${project.visualKind}`)}
                />
              </div>
              <div className="brand-project-index__copy">
                <p className="brand-route__eyebrow">{String(project.id).padStart(2, '0')} · {project.role}</p>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                <span>{t('caseStudy')} <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
