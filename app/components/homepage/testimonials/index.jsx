// @flow strict
"use client";
import { memo } from 'react';
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { careerFacts } from '@/utils/data/career-facts';

function Testimonials() {
  const t = useTranslations('testimonials');
  const tCommon = useTranslations('common');

  const testimonials = careerFacts.testimonials
    .filter(testimonial => testimonial.publish)
    .map(testimonial => ({
      name: t(`${testimonial.id}.name`),
      title: t(`${testimonial.id}.title`),
      quote: t(`${testimonial.id}.quote`),
      letterUrl: testimonial.asset,
    }));

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="brand-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="brand-section__title text-3xl font-semibold text-slate-100 mb-12">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <article 
              key={index} 
              className="brand-panel p-6"
            >
              <blockquote className="text-slate-400 mb-4 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              
              <div className="mb-4">
                <p className="font-medium text-slate-200">{testimonial.name}</p>
                <p className="text-sm text-slate-400">{testimonial.title}</p>
              </div>
              
              <Link
                href={testimonial.letterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-sm text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={`${t('readFullLetter')} (${tCommon('opensInNewTab')})`}
              >
                {t('readFullLetter')}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Testimonials);
