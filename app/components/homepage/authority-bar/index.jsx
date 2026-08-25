// @flow strict
"use client";
import { memo } from "react";
import { FaTrophy, FaFilePdf } from "react-icons/fa";

function AuthorityBar() {
  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 p-6 rounded bg-slate-800/50 border border-slate-700">
        <div className="flex items-center gap-3">
          <FaTrophy className="text-cyan-400 text-2xl md:text-3xl" />
          <div className="text-center md:text-left">
            <span className="text-white font-semibold text-sm md:text-base">
              Best Booth Award – ITEX 2024
            </span>
            <p className="text-slate-400 text-xs md:text-sm">
              AI Hologram Lead
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-slate-700"></div>
        <div className="md:hidden w-32 h-px bg-slate-700"></div>

        <span className="flex items-center gap-2 px-6 py-3 rounded border border-slate-700 text-slate-400">
          <FaFilePdf className="text-slate-400" aria-hidden="true" />
          <span className="font-medium text-sm">Proof document available on request</span>
        </span>
      </div>
    </section>
  );
}

export default memo(AuthorityBar);
