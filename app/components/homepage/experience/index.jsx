// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import { memo } from 'react';

function Experience() {
  const t = useTranslations();

  return (
    <section id="experience" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-12">
          {t('experience.title')}
        </h2>

        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map(id => {
            const exp = t.raw(`experiences.${id}`);
            if (!exp) return null;
            
            return (
              <article 
                key={id} 
                className="border border-slate-700 bg-slate-800/50 rounded p-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-medium text-slate-100">
                      {exp.title}
                    </h3>
                    <p className="text-slate-400">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-sm text-slate-500 font-mono whitespace-nowrap">
                    {exp.duration}
                  </span>
                </div>
                
                {/* Tech Stack */}
                {exp.tech && (
                  <div className="mb-4">
                    <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                      {exp.tech}
                    </span>
                  </div>
                )}
                
                {/* Description */}
                <ul className="space-y-2 text-slate-400 text-sm">
                  {exp.description.map((desc, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-slate-600 mt-1">—</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(Experience);