// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { BsPersonWorkspace } from "react-icons/bs";
import lottieFile from '../../../assets/lottie/study.json';
import AnimationLottie from "../../helper/animation-lottie";
import GlowCard from "../../helper/glow-card";
import { educations } from "@/utils/data/educations";

function Education() {
  const t = useTranslations('education');

  return (
    <div id="education" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <Image
        src="/section.svg"
        alt=""
        width={1572}
        height={795}
        className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-none h-auto"
        aria-hidden="true"
        loading="lazy"
      />
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full" />
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex justify-center items-start">
            <div className="w-3/4 h-3/4">
              <AnimationLottie animationPath={lottieFile} />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              {
                educations.map(education => {
                  const eduData = t.raw(`${education.id}`);
                  const title = eduData?.title || education.title;
                  const institution = eduData?.institution || education.institution;
                  const details = eduData?.details || [];
                  
                  return (
                    <GlowCard key={education.id} identifier={`education-${education.id}`}>
                      <div className="p-3 relative text-white">
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
                            {education.duration}
                          </p>
                        </div>
                        <div className="flex items-center gap-x-8 px-3 py-5">
                          <div className="text-violet-500  transition-all duration-300 hover:scale-125">
                            <BsPersonWorkspace size={36} />
                          </div>
                          <div>
                            <p className="text-base sm:text-xl mb-2 font-medium uppercase">
                              {title}
                            </p>
                            <p className="text-sm sm:text-base text-text-tertiary">{institution}</p>
                          </div>
                        </div>
                        {details.length > 0 && (
                          <ul className="text-text-tertiary list-disc list-inside ms-4 rtl:me-4 rtl:ms-0 text-sm sm:text-base mt-2 px-3" style={{ listStylePosition: 'inside' }}>
                            {details.map((detail, index) => (
                              <li key={index} className="mb-2">{detail}</li>
                            ))}
                          </ul>
                        )}
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

export default Education;