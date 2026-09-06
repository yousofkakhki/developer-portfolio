import { careerFacts, localized } from '@/utils/data/career-facts';
import profileConfig from '@/utils/data/external-profiles.cjs';
import imageSchema from '@/utils/data/image-schema.cjs';

const { getApprovedGlobalProfiles } = profileConfig;
const { buildImageObject } = imageSchema;

export default function StructuredData({ locale }) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kakhki.me';
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const profileImageSemantics = careerFacts.identity.profileImageSemantics;
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
        image: buildImageObject({
          id: `${siteUrl}/#profile-image`,
          url: `${siteUrl}/avatar-page-background.webp`,
          width: 1254,
          height: 1254,
          name: localized(profileImageSemantics.name, locale),
          caption: localized(profileImageSemantics.caption, locale),
          thumbnailUrl: `${siteUrl}/${locale}/opengraph-image`,
        }),
        sameAs: getApprovedGlobalProfiles().map(profile => profile.url),
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
