// @flow strict
"use client";
import { memo } from "react";
import Link from "next/link";
import { FaTrophy, FaFilePdf } from "react-icons/fa";

function AuthorityBar() {
  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 p-6 rounded bg-slate-800/50 border border-slate-700">
        <div className="flex items-center gap-3">
          <FaTrophy className="text-yellow-500 text-2xl md:text-3xl" />
          <div className="text-center md:text-left">
            <span className="text-white font-semibold text-sm md:text-base">
              Best Booth Award – ITEX 2024
            </span>
            <p className="text-slate-500 text-xs md:text-sm">
              AI Hologram Lead
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-slate-700"></div>
        <div className="md:hidden w-32 h-px bg-slate-700"></div>

        <Link
          href="/files/yousef-kakhki-resume.pdf"
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 rounded border border-burgundy text-slate-200 hover:bg-burgundy hover:text-white transition-colors group"
        >
          <FaFilePdf className="text-burgundy group-hover:text-white transition-colors" />
          <span className="font-medium text-sm">View Recommendation Letter</span>
        </Link>
      </div>
    </section>
  );
}

export default memo(AuthorityBar);
