// @flow strict
"use client";
import { memo } from "react";
import Link from "next/link";
import { FaTrophy, FaFilePdf } from "react-icons/fa";
import { useScrollReveal } from "@/utils/hooks/useScrollReveal";

/**
 * AuthorityBar component - Displays award and recommendation letter
 * @returns {JSX.Element}
 */
function AuthorityBar() {
  const [ref, revealed] = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className={`py-8 transition-all duration-1000 ${
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 p-6 rounded-xl bg-dark-800/50 border border-dark-600">
        {/* Award Badge */}
        <div className="flex items-center gap-3">
          <FaTrophy className="text-yellow-500 text-2xl md:text-3xl" />
          <div className="text-center md:text-left">
            <span className="text-white font-semibold text-sm md:text-base">
              Best Booth Award - ITEX 2024
            </span>
            <p className="text-text-muted text-xs md:text-sm">
              AI Hologram Lead
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-12 bg-dark-400"></div>
        <div className="md:hidden w-32 h-px bg-dark-400"></div>

        {/* Recommendation Letter Button */}
        <Link
          href="/resume-gemini-new.pdf"
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#800020] text-white hover:bg-[#800020] hover:text-white transition-all duration-300 group"
        >
          <FaFilePdf className="text-[#800020] group-hover:text-white transition-colors" />
          <span className="font-medium text-sm">View Official Recommendation Letter</span>
        </Link>
      </div>
    </section>
  );
}

export default memo(AuthorityBar);
