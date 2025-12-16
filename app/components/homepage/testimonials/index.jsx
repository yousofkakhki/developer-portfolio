// @flow strict
"use client";
import React from 'react';
import Link from "next/link";
import { useTranslations } from 'next-intl';

function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonials = [
    {
      name: t('1.name'),
      title: t('1.title'),
      quote: t('1.quote'),
      letterUrl: "/recommendation-ali-mohammadian.jpg"
    },
    {
      name: t('2.name'),
      title: t('2.title'),
      quote: t('2.quote'),
      letterUrl: "/recommendation-sara-mozaffari.jpg"
    }
  ];

  return (
    <div id="testimonials" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="flex justify-center -mt-1">
        <div className="w-40 h-1 bg-[#25213b] rounded-full"></div>
      </div>
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-gradient-to-r from-transparent to-[#1a1443]"></span>
          <span className="bg-gradient-to-br from-[#1a1443] to-[#25213b] w-fit text-white p-2 px-5 text-xl rounded-md border border-[#16f2b3]/20 shadow-lg">
            {t('title')}
          </span>
          <span className="w-24 h-[2px] bg-gradient-to-l from-transparent to-[#1a1443]"></span>
        </div>
      </div>

      <div className="py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 px-4 md:px-0">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-lg bg-[linear-gradient(90deg,#281e57_0%,#201435_100%)] border border-[#1a1443] shadow-lg flex flex-col justify-between">
              <div>
               <blockquote className="text-lg italic text-text-secondary mb-4">
  &quot;{testimonial.quote}&quot;
</blockquote>
                <div className="mb-6">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-violet-400">{testimonial.title}</p>
                </div>
              </div>
              <Link
                href={testimonial.letterUrl}
                target="_blank"
                className="self-start mt-auto text-pink-500 font-semibold hover:underline"
              >
                {t('readFullLetter')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;