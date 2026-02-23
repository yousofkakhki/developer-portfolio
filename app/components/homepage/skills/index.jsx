// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import { memo } from 'react';

// Categorized skills for system architect
const skillCategories = {
  "Languages & Runtimes": ["Node.js", "TypeScript", "Go", "Python", "C++", "Java"],
  "Databases & Messaging": ["PostgreSQL", "Redis", "MongoDB", "NATS JetStream", "RabbitMQ"],
  "Infrastructure & DevOps": ["Docker Swarm", "Kubernetes", "HAProxy", "Nginx", "Prometheus", "Grafana", "ELK Stack"],
  "Streaming & Real-time": ["LiveKit", "WebRTC", "HLS", "FFmpeg"],
  "Systems & Embedded": ["Linux Kernel", "Yocto", "Embedded Linux", "OTA Updates"],
};

function Skills() {
  const t = useTranslations();

  return (
    <section id="skills" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-12">
          {t('skills.title')}
        </h2>

        <div className="space-y-8">
          {Object.entries(skillCategories).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-sm font-mono text-slate-500 mb-3 uppercase tracking-wide">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm text-slate-300 bg-slate-800 border border-slate-700 rounded hover:border-slate-600 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Skills);
