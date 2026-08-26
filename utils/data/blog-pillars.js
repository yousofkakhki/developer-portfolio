export const PILLARS = {
  'real-time-media': {
    title: 'Real-Time Media at Scale',
    description: 'Architecture, trade-offs, and operating patterns for WebRTC, LiveKit, NATS JetStream, HLS, and low-latency media systems.',
    tags: ['webrtc', 'livekit', 'nats', 'streaming', 'real-time', 'hls', 'sfu', 'rtc'], color: '#06B6D4',
  },
  fintech: {
    title: 'Reliable Fintech Backends',
    description: 'Idempotency, reconciliation, payment workflows, and distributed-system patterns for dependable fintech backends.',
    tags: ['fintech', 'payments', 'crypto', 'high-availability', 'backend', 'reliability', 'kafka'], color: '#22C55E',
  },
  'systems-edge': {
    title: 'Systems & Edge Engineering',
    description: 'Linux performance, observability, embedded systems, and reliable delivery patterns for constrained edge hardware.',
    tags: ['linux', 'kernel', 'embedded', 'edge', 'ota', 'ebpf', 'systems', 'performance'], color: '#F97316',
  },
  'site-engineering': {
    title: 'Site Engineering',
    description: 'Implementation notes about this portfolio, bilingual routing, accessibility, and deployment boundaries.',
    tags: ['nextjs', 'next.js', 'react', 'i18n', 'portfolio', 'site-engineering'], color: '#64748B',
  },
  'leadership-eu': {
    title: 'Engineering Leadership & EU Journey',
    description: 'Tech-lead craft, engineering teams, hiring, and an evidence-based Iran-to-Europe career journey.',
    tags: ['leadership', 'engineering-leadership', 'engineering-management', 'blue-card', 'eu-immigration', 'europe', 'career', 'team', 'hiring'], color: '#EAB308',
  },
};

export const PILLAR_SLUGS = Object.keys(PILLARS);
export const MIN_INDEXABLE_PILLAR_ARTICLES = 3;

export function getPillarForTags(tags = []) {
  const normalized = tags.map(tag => tag.toLowerCase());
  return PILLAR_SLUGS.find(slug => PILLARS[slug].tags.some(tag => normalized.includes(tag)));
}

export function getActivePillarSlugs(blogs = []) {
  const counts = blogs.reduce((result, blog) => {
    const pillar = getPillarForTags(blog.tag_list || blog.tags || []);
    if (pillar) result.set(pillar, (result.get(pillar) || 0) + 1);
    return result;
  }, new Map());
  return PILLAR_SLUGS.filter(slug => (counts.get(slug) || 0) >= MIN_INDEXABLE_PILLAR_ARTICLES);
}
