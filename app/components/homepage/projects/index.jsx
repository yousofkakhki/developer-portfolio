// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import ProjectCard from './project-card';
import { memo } from 'react';

const Projects = () => {
  const t = useTranslations();

  return (
    <section id='projects' className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-12">
          {t('projects.title')}
        </h2>

        <div className="space-y-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => {
            const project = t.raw(`projects.${id}`);
            if (!project) return null;
            return (
              <ProjectCard 
                key={id} 
                project={{ ...project, id, images: getProjectImages(id), tools: project.tools || [] }} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

function getProjectImages(id) {
  const imageMap = {
    1: ['/ai-1.jpg', '/ai-2.jpg', '/ai-3.jpg'],
    2: ['/capitalino-1.jpg', '/capitalino-2.jpg', '/capitalino-3.jpg'],
    3: ['/png/placeholder.png'],
    4: ['/game-1.jpg'],
    5: ['/ota-1.jpg', '/ota-2.jpg', '/ota-3.jpg'],
    6: ['/png/placeholder.png'],
    7: ['/png/placeholder.png'],
    8: ['/png/placeholder.png']
  };
  return imageMap[id] || [];
}

export default memo(Projects);