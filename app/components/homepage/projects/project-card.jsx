// @flow strict
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useMemo, useState } from 'react';
import ProjectVisual from './project-visual';

function ProjectCard({ project }) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const hasDemo = useMemo(() => project.demo && project.demo.trim(), [project.demo]);
  const hasCode = useMemo(() => project.code && project.code.trim(), [project.code]);
  const firstImage = project.images?.[0];
  const [mediaStatus, setMediaStatus] = useState(firstImage ? 'loading' : 'architecture-brief');
  const showImage = Boolean(firstImage) && mediaStatus !== 'failed';

  return (
    <article className="brand-panel brand-panel--interactive overflow-hidden">
      <div
        data-project-media-state={mediaStatus}
        className="relative h-48 overflow-hidden border-b border-slate-700/70 bg-slate-950"
      >
        {mediaStatus !== 'ready' && (
          <ProjectVisual
            projectId={project.id}
            visualKind={project.visualKind}
            briefLabel={t('architectureBrief')}
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

        {project.role && (
          <div className="mb-4 text-sm">
            <span className="text-slate-400">{t('role')}</span>
            <span className="ms-2 text-slate-300">{project.role}</span>
          </div>
        )}

        {project.tools?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="brand-chip font-mono text-slate-400"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="inline-flex min-h-[44px] items-center text-cyan-300 hover:text-cyan-100 transition-colors"
            aria-label={`${t('caseStudy')}: ${project.name}`}
          >
            {t('caseStudy')} →
          </Link>
          {hasDemo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={`${t('viewDemo')} — ${project.name} (${tCommon('opensInNewTab')})`}
            >
              {t('viewDemo')} →
            </Link>
          )}
          {hasCode && (
            <Link
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={`${t('viewCode')} — ${project.name} (${tCommon('opensInNewTab')})`}
            >
              {t('viewCode')} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProjectCard);
