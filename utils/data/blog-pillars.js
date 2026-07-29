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
  'pwa-product': {
    title: 'PWA & Applied Product Engineering',
    description: 'Offline-first architecture, web sensors, service workers, WASM, and practical product-engineering trade-offs.',
    tags: ['pwa', 'sensors', 'web-sensors', 'offline', 'offline-first', 'service-worker', 'wasm', 'product', 'indexeddb', 'next.js', 'react', 'i18n', 'portfolio'], color: '#A855F7',
  },
  'leadership-eu': {
    title: 'Engineering Leadership & EU Journey',
    description: 'Tech-lead craft, engineering teams, hiring, and an evidence-based Iran-to-Europe career journey.',
    tags: ['leadership', 'engineering-leadership', 'engineering-management', 'blue-card', 'eu-immigration', 'europe', 'career', 'team', 'hiring'], color: '#EAB308',
  },
};

export const PILLAR_SLUGS = Object.keys(PILLARS);

export function getPillarForTags(tags = []) {
  const normalized = tags.map(tag => tag.toLowerCase());
  return PILLAR_SLUGS.find(slug => PILLARS[slug].tags.some(tag => normalized.includes(tag)));
}

export function getActivePillarSlugs(blogs = []) {
  const active = new Set(blogs.map(blog => getPillarForTags(blog.tag_list || blog.tags || [])).filter(Boolean));
  return PILLAR_SLUGS.filter(slug => active.has(slug));
}
