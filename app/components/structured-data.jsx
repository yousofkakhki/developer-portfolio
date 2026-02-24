import { personalData } from '@/utils/data/personal-data';

export default function StructuredData({ locale, messages }) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.ir';
  const t = (key) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": t('personal.name'),
    "jobTitle": t('personal.designation'),
    "description": t('personal.description'),
    "url": siteUrl,
    "email": personalData.email,
    "telephone": personalData.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tehran",
      "addressCountry": "IR"
    },
    "sameAs": [
      personalData.github,
      personalData.linkedIn,
      personalData.facebook
    ].filter(Boolean),
    "image": `${siteUrl}/avatar.png`,
    "alumniOf": [
      {
        "@type": "CollegeOrUniversity",
        "name": "Amirkabir University of Technology (Tehran Polytechnic)",
        "url": "https://aut.ac.ir"
      }
    ],
    "knowsAbout": [
      "System Architecture",
      "WebRTC",
      "LiveKit",
      "HLS Streaming",
      "NATS JetStream",
      "High-Frequency Trading",
      "Node.js",
      "TypeScript",
      "Go",
      "Docker Swarm",
      "Kubernetes",
      "Linux Kernel",
      "Embedded Linux",
      "PostgreSQL",
      "Redis",
      "DevOps",
      "IoT",
      "Yocto",
      "HAProxy",
      "Prometheus"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `${t('personal.name')} - Portfolio`,
    "url": siteUrl,
    "description": t('personal.description'),
    "inLanguage": locale === 'fa' ? 'fa-IR' : 'en-US',
    "author": {
      "@type": "Person",
      "name": t('personal.name')
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

