// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { educations } from "@/utils/data/educations";

function Education() {
  const t = useTranslations();

  return (
    <section id="education" className="brand-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="brand-section__title text-3xl font-semibold text-slate-100 mb-12">
          {t('education.title')}
        </h2>

        <div className="space-y-6">
          {educations.map(education => {
            const eduData = t.raw(`education.${education.id}`);
            const title = eduData?.title || education.title;
            const institution = eduData?.institution || education.institution;
            const details = eduData?.details || [];
            
            return (
              <article 
                key={education.id} 
                className="brand-panel p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-slate-100">
                      {title}
                    </h3>
                    <p className="text-slate-400">
                      {institution}
                    </p>
                  </div>
                  <span className="text-sm text-slate-400 font-mono whitespace-nowrap">
                    {education.duration}
                  </span>
                </div>
                
                {details.length > 0 && (
                  <ul className="space-y-1 text-slate-400 text-sm mt-3">
                    {details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-slate-600 mt-1">—</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(Education);