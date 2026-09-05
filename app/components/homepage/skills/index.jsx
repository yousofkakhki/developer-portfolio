// @flow strict
"use client";
import { useTranslations } from 'next-intl';
import { memo } from 'react';

// Categorized skills for system architect
const skillCategories = [
  { key: 'languagesRuntimes', skills: ["Node.js", "TypeScript", "Go", "Python", "C++", "Java"] },
  { key: 'databasesMessaging', skills: ["PostgreSQL", "Redis", "MongoDB", "NATS JetStream", "RabbitMQ"] },
  { key: 'infrastructureDevops', skills: ["Docker Swarm", "Kubernetes", "HAProxy", "Nginx", "Prometheus", "Grafana", "ELK Stack"] },
  { key: 'streamingRealtime', skills: ["LiveKit", "WebRTC", "HLS", "FFmpeg"] },
  { key: 'systemsEmbedded', skills: ["Linux Kernel", "Yocto", "Embedded Linux", "OTA Updates"] },
];

function Skills() {
  const t = useTranslations();

  return (
    <section id="skills" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-12">
          {t('skills.title')}
        </h2>

        <div className="space-y-8">
          {skillCategories.map(({ key, skills }) => (
            <div key={key}>
              <h3 className="text-sm font-mono text-slate-400 mb-3 uppercase tracking-wide">
                {t(`skills.categories.${key}`)}
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
