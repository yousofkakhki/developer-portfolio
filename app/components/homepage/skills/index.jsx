// @flow strict
"use client";
import { useTranslations, useLocale } from 'next-intl';
import { skillsData } from "@/utils/data/skills";
import { skillsImage } from "@/utils/skill-image";
import Image from "next/image";
import { memo, useMemo, useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';

/**
 * Skills component - Displays skills in a scrolling marquee
 * @returns {JSX.Element}
 */
function Skills() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';
  const [mounted, setMounted] = useState(false);
  
  // Memoize skills data to prevent unnecessary recalculations
  const memoizedSkills = useMemo(() => skillsData, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] rtl:right-[42%] rtl:left-auto translate-x-1/2 rtl:-translate-x-1/2 filter blur-3xl opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r rtl:bg-gradient-to-l from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-gradient-to-r rtl:bg-gradient-to-l from-transparent to-[#1a1443]"></span>
          <span className="bg-gradient-to-br from-[#1a1443] to-[#25213b] w-fit text-white p-2 px-5 text-xl rounded-md border border-[#16f2b3]/20 shadow-lg">
            {t('skills.title')}
          </span>
          <span className="w-24 h-[2px] bg-gradient-to-l rtl:bg-gradient-to-r from-transparent to-[#1a1443]"></span>
        </div>
      </div>

      <div className="w-full my-12 min-h-[140px]">
        {mounted ? (
          <Marquee
            gradient={false}
            speed={80}
            pauseOnHover={true}
            pauseOnClick={true}
            delay={0}
            play={true}
            direction={isRTL ? "right" : "left"}
          >
            {memoizedSkills.map((skill, id) => (
              <div className="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative hover:scale-[1.15] cursor-pointer"
                key={id}>
                <div className="h-full w-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-none shadow-gray-50 group-hover:border-violet-500 transition-all duration-500">
                  <div className="flex -translate-y-[1px] justify-center">
                    <div className="w-3/4">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 p-6">
                    <div className="h-8 sm:h-10">
                      {skillsImage(skill)?.src ? (
                        <Image
                          src={skillsImage(skill).src}
                          alt={skill}
                          width={40}
                          height={40}
                          className="h-full w-auto rounded-lg"
                        />
                      ) : (
                        <div className="h-full w-10 flex items-center justify-center text-white text-xs font-semibold bg-[#1a1443] rounded">
                          {skill.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm sm:text-lg">
                      {skill}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        ) : (
          <div className="w-full h-36 bg-[#0d1224] animate-pulse rounded-lg"></div>
        )}
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(Skills);
