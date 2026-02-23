// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import { memo } from 'react';

/**
 * AboutSection component - Clean professional background section
 */
function AboutSection() {
  const t = useTranslations();

  return (
    <section id="about" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-8">
          {t('about.title')}
        </h2>
        
        {/* Profile content */}
        <div className="space-y-6 text-base leading-relaxed text-slate-400">
          <p>
            Head of Software & System Architect with an M.Sc. in System Design from Amirkabir 
            University of Technology (Tehran Polytechnic – Iran&apos;s #1 ranked university in Computer Science). 
            Expert in bridging hardware-level efficiency with cloud-scale architecture.
          </p>
          <p>
            Proven track record in leading cross-functional teams, optimizing Linux kernels, and 
            architecting hybrid WebRTC/HLS infrastructures for high-concurrency Fintech and Media platforms. 
            Career trajectory spans embedded systems (Linux kernel optimization, IoT firmware), high-frequency 
            trading engines (sub-100ms matching with ACID compliance), to enterprise cloud infrastructure 
            (Docker Swarm orchestration, ELK stacks, disaster recovery).
          </p>
          <p>
            Current focus: designing production-grade distributed systems that serve thousands of concurrent 
            users while maintaining operational excellence (99.9%+ uptime, sub-100ms latency, measurable 
            cost optimization).
          </p>
        </div>
        
        {/* ITEX Award Callout */}
        <div className="mt-8 border-l-4 border-burgundy bg-slate-800 p-6 rounded-r">
          <div className="flex items-start gap-3">
            <span className="text-burgundy text-xl">🏆</span>
            <div>
              <p className="text-slate-200 font-medium">Best Booth Award – ITEX 2024</p>
              <p className="text-slate-400 text-sm mt-1">
                AI Hologram Project Lead – Capitalino
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutSection);