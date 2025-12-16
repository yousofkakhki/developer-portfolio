// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { BsPersonWorkspace } from "react-icons/bs";
import experienceLottie from '../../../assets/lottie/code.json';
import AnimationLottie from "../../helper/animation-lottie";
import GlowCard from "../../helper/glow-card";

function Experience() {
  const t = useTranslations();

  return (
    <div id="experience" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <Image
        src="/section.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-gradient-to-r from-transparent to-[#1a1443]"></span>
          <span className="bg-gradient-to-br from-[#1a1443] to-[#25213b] w-fit text-white p-2 px-5 text-xl rounded-md border border-[#16f2b3]/20 shadow-lg">
            {t('experience.title')}
          </span>
          <span className="w-24 h-[2px] bg-gradient-to-l from-transparent to-[#1a1443]"></span>
        </div>
      </div>

      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex justify-center items-start">
            <div className="w-full h-full">
              <AnimationLottie animationPath={experienceLottie} />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              {
                [1, 2, 3, 4].map(id => {
                  const exp = t.raw(`experiences.${id}`);
                  return (
                    <GlowCard key={id} identifier={`experience-${id}`}>
                      <div className="p-3 relative">
                        <Image
                          src="/blur-23.svg"
                          alt=""
                          width={1080}
                          height={200}
                          className="absolute bottom-0 opacity-80 w-full h-auto"
                          aria-hidden="true"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 1080px"
                        />
                        <div className="flex justify-center">
                          <p className="text-xs sm:text-sm text-[#16f2b3]">
                            {exp.duration}
                          </p>
                        </div>
                        <div className="flex items-center gap-x-8 px-3 py-5">
                          <div className="text-violet-500  transition-all duration-300 hover:scale-125">
                            <BsPersonWorkspace size={36} />
                          </div>
                          <div>
                            <p className="text-base sm:text-xl mb-2 font-medium uppercase">
                              {exp.title}
                            </p>
                            <p className="text-sm sm:text-base text-text-tertiary">
                              {exp.company}
                            </p>
                          </div>
                        </div>
                        
                        {/* NEW: This section renders the description bullet points */}
                        <ul className="text-text-tertiary list-disc ms-4 rtl:me-4 rtl:ms-0 text-sm sm:text-base mt-2 px-3" style={{ listStylePosition: 'inside' }}>
                          {exp.description.map((desc, index) => (
                            <li key={index} className="mb-2">{desc}</li>
                          ))}
                        </ul>
                      </div>
                    </GlowCard>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;