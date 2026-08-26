import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { caseStudyProjects, getLocalizedProject } from '@/utils/data/project-catalog';
import ProjectCard from './project-card';

export default async function Projects() {
  const locale = await getLocale();
  const language = locale === 'fa' ? 'fa' : 'en';
  const t = await getTranslations({ locale: language, namespace: 'projects' });
  const projects = caseStudyProjects.map(project => getLocalizedProject(project, language));

  return (
    <section id="projects" className="brand-section" aria-labelledby="projects-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <h2 id="projects-heading" className="brand-section__title mb-3 text-3xl font-semibold text-slate-100">
            {t('title')}
          </h2>
          <p className="leading-relaxed text-slate-400">{t('featuredIntro')}</p>
        </div>

        <div className="space-y-8">
          {projects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href={`/${language}/projects`} className="brand-button min-h-[44px]">
            {t('viewAllProjects')}
          </Link>
        </div>
      </div>
    </section>
  );
}
