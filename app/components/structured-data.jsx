import { personalData } from '@/utils/data/personal-data';
import { careerFacts, localized } from '@/utils/data/career-facts';

export default function StructuredData({ locale }) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: careerFacts.identity.name,
        alternateName: localized(careerFacts.identity.localizedName, locale),
        jobTitle: localized(careerFacts.identity.primaryTitle, locale),
        description: localized(careerFacts.identity.description, locale),
        url: siteUrl,
        image: {
          '@type': 'ImageObject',
          '@id': `${siteUrl}/#profile-image`,
          url: `${siteUrl}/avatar-page-background.webp`,
          contentUrl: `${siteUrl}/avatar-page-background.webp`,
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
        description: localized(careerFacts.identity.description, locale),
        inLanguage: ['en', 'fa'],
        author: { '@id': personId },
        publisher: { '@id': personId },
      },
    ],
  };
  const json = JSON.stringify(graph).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
