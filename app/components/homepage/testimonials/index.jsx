// @flow strict
"use client";
import { memo } from 'react';
import Link from "next/link";
import { useTranslations } from 'next-intl';

function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonials = [
    {
      name: t('1.name'),
      title: t('1.title'),
      quote: t('1.quote'),
      letterUrl: "/recommendation.pdf"
    },
    {
      name: t('2.name'),
      title: t('2.title'),
      quote: t('2.quote'),
      letterUrl: "/recommendation-sara-mozaffari.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-12">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <article 
              key={index} 
              className="border border-slate-700 bg-slate-800/50 rounded p-6"
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
                className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
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