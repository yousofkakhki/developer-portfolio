// @flow strict
"use client";

import { useTranslations } from 'next-intl';
import { memo, useMemo, useState } from 'react';
import { projectCatalog } from '@/utils/data/project-catalog';
import ProjectCard from './project-card';

const featuredProjectCount = 3;

const Projects = () => {
  const t = useTranslations('projects');
  const [expanded, setExpanded] = useState(false);
  const projects = useMemo(
    () => projectCatalog.map((project) => {
      const localizedProject = t.raw(String(project.id));
      return localizedProject
        ? { ...localizedProject, ...project, tools: localizedProject.tools || [] }
        : null;
    }).filter(Boolean),
    [t],
  );
  const visibleProjects = expanded ? projects : projects.slice(0, featuredProjectCount);

  return (
    <section id="projects" className="brand-section" aria-labelledby="projects-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <h2 id="projects-heading" className="brand-section__title mb-3 text-3xl font-semibold text-slate-100">
            {t('title')}
          </h2>
          <p className="leading-relaxed text-slate-400">{t('featuredIntro')}</p>
        </div>

        <div id="project-list" className="space-y-8">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length > featuredProjectCount && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="project-list"
              onClick={() => setExpanded(value => !value)}
              className="brand-button min-h-[44px]"
            >
              {expanded ? t('showFewerProjects') : t('viewAllProjects')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(Projects);
