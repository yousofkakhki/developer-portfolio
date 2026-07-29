// @flow strict
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { memo, useMemo } from 'react';

function ProjectCard({ project }) {
  const t = useTranslations('projects');
  
  const hasDemo = useMemo(() => project.demo && project.demo.trim(), [project.demo]);
  const hasCode = useMemo(() => project.code && project.code.trim(), [project.code]);
  const firstImage = project.images?.[0];

  return (
    <article className="border border-slate-700 bg-slate-800/50 rounded overflow-hidden">
      {/* Image */}
      {firstImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={firstImage}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            alt={project.name}
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-medium text-slate-100 mb-3">
          {project.name}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
          {project.description}
        </p>
        
        {project.role && (
          <div className="text-sm mb-4">
            <span className="text-slate-400">Role:</span>
            <span className="text-slate-300 ml-2">{project.role}</span>
          </div>
        )}

        {/* Tools */}
        {project.tools?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tools.map((tool, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs text-slate-400 bg-slate-700/50 border border-slate-700 rounded"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 text-sm">
          {hasDemo && (
            <Link 
              href={project.demo} 
              target='_blank' 
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              View Demo →
            </Link>
          )}
          {hasCode && (
            <Link 
              href={project.code} 
              target='_blank' 
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              View Code →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProjectCard);