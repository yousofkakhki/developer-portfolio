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
  { key: 'erpBusinessSystems', skills: ["Odoo Enterprise", "Odoo CRM", "Custom CRM Addons", "Self-Hosted ERP", "Persian/Jalali & Hijri Calendars"] },
];

function Skills() {
  const t = useTranslations();

  return (
    <section id="skills" className="brand-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="brand-section__title text-3xl font-semibold text-slate-100 mb-12">
          {t('skills.title')}
        </h2>

        <div className="space-y-8">
          {skillCategories.map(({ key, skills }) => (
            <div key={key} className="brand-skill-group">
              <h3 className="text-sm font-mono text-slate-400 mb-3 uppercase tracking-wide">
                {t(`skills.categories.${key}`)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="brand-chip text-sm"
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
