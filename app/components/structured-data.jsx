import { personalData } from '@/utils/data/personal-data';

export default function StructuredData({ locale, messages }) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const t = (key) => key.split('.').reduce((value, part) => value?.[part], messages) || key;
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Yousef Kakhki',
        alternateName: t('personal.name'),
        jobTitle: t('personal.designation'),
        description: t('personal.description'),
        url: siteUrl,
        image: {
          '@type': 'ImageObject',
          '@id': `${siteUrl}/#profile-image`,
          url: `${siteUrl}/avatar.png`,
          contentUrl: `${siteUrl}/avatar.png`,
        },
        sameAs: [personalData.github, personalData.linkedIn].filter(Boolean),
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Amirkabir University of Technology (Tehran Polytechnic)',
          url: 'https://aut.ac.ir',
        },
        knowsAbout: [
          'Backend engineering', 'Distributed systems', 'WebRTC', 'LiveKit',
          'NATS JetStream', 'Apache Kafka', 'Node.js', 'Go', 'Python',
          'PostgreSQL', 'DevOps', 'Embedded Linux',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Yousef Kakhki — Engineering Portfolio',
        url: siteUrl,
        description: t('personal.description'),
        inLanguage: ['en', 'fa'],
        author: { '@id': personId },
        publisher: { '@id': personId },
      },
    ],
  };
  const json = JSON.stringify(graph).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
