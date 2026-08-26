// @flow strict
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useState } from 'react';
import ProjectVisual from './project-visual';

function ProjectCard({ project }) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const firstImage = project.images?.[0];
  const [mediaStatus, setMediaStatus] = useState(firstImage ? 'loading' : 'architecture-brief');
  const showImage = Boolean(firstImage) && mediaStatus !== 'failed';

  return (
    <article
      className="brand-panel brand-panel--interactive overflow-hidden"
      data-fact-ids={project.factIds?.join(' ')}
    >
      <div
        data-project-media-state={mediaStatus}
        className="relative h-48 overflow-hidden border-b border-slate-700/70 bg-slate-950"
      >
        {mediaStatus !== 'ready' && (
          <ProjectVisual
            projectId={project.id}
            visualKind={project.visualKind}
            briefLabel={t('caseStudyLabel')}
            categoryLabel={t(`visualKinds.${project.visualKind}`)}
          />
        )}
        {showImage && (
          <Image
            src={firstImage}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            alt={project.name}
            onLoad={() => setMediaStatus('ready')}
            onError={() => setMediaStatus('failed')}
            className={`object-cover transition-opacity duration-300 ${mediaStatus === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>

      <div className="p-6">
        <h3 className="mb-3 text-xl font-medium text-slate-100">
          {project.name}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          {project.description}
        </p>

        <p className="brand-content-type mb-3">{t('caseStudyLabel')}</p>

        {project.role && <p className="mb-4 text-sm text-slate-300"><span className="text-slate-400">{t('role')} </span>{project.role}</p>}

        {project.tools?.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-2" aria-label={t('technology')}>
            {project.tools.map((tool) => (
              <li
                key={tool}
                className="brand-chip font-mono text-slate-400"
              >
                <bdi dir="ltr">{tool}</bdi>
              </li>
            ))}
          </ul>
        )}

        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          <span className="text-slate-400">{t(`outcomeTypes.${project.outcomeType}`)}: </span>
          {project.outcome}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="inline-flex min-h-[44px] items-center text-cyan-300 hover:text-cyan-100 transition-colors"
            aria-label={`${t('readCaseStudy')}: ${project.name}`}
          >
            {t('readCaseStudy')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default memo(ProjectCard);
