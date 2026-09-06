const PUBLIC_ASSET_STATUSES = Object.freeze({
  published: 'published',
  supporting: 'published-supporting',
  legacyRedirectOnly: 'legacy-redirect-only',
  draftPrivate: 'draft-private',
  unreferenced: 'unreferenced',
  remove: 'remove',
});

const asset = (status, purpose, referenceFiles, publishedReferences, extra = {}) => Object.freeze({
  status,
  purpose,
  referenceFiles: Object.freeze(referenceFiles),
  publishedReferences: Object.freeze(publishedReferences),
  containsRecognizablePeople: false,
  provenance: Object.freeze({ kind: 'owner-authored' }),
  ...extra,
});

const publicAssetManifest = Object.freeze({
  'avatar-page-background.webp': asset(
    PUBLIC_ASSET_STATUSES.published,
    'canonical-profile-portrait',
    [
      'app/components/homepage/hero-section/index.jsx',
      'app/components/structured-data.jsx',
    ],
    ['/{locale}', '/{locale}#hero'],
    {
      containsRecognizablePeople: true,
      approvalEvidence: Object.freeze({ kind: 'owner-provided-for-public-profile' }),
      provenance: Object.freeze({ kind: 'owner-provided-profile-portrait' }),
    },
  ),
  'blog/hybrid-architecture-safe.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'published-article-cover',
    ['content/blogs/hybrid-room-scalability-blog.json'],
    ['/{locale}/blog/hybrid-room-scalability-nats-livekit'],
  ),
  'blog/portfolio-cover.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'published-article-cover',
    ['content/blogs/building-bilingual-portfolio.json'],
    ['/{locale}/blog/building-bilingual-portfolio-nextjs'],
  ),
  'blog/systems-edge.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'published-article-cover',
    ['content/blogs/ebpf-probes-for-faster-ota-fault-detection.json'],
    ['/{locale}/blog/ebpf-probes-for-faster-ota-fault-detection'],
  ),
  'blog/webrtc-scale.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'published-article-cover',
    [
      'content/blogs/ai-enhanced-sfu-for-low-latency-streaming.json',
      'content/blogs/eu-scale-livekit-sfu-clustering-in-frankfurt.json',
    ],
    [
      '/en/blog/ai-enhanced-sfu-for-low-latency-streaming',
      '/{locale}/blog/eu-scale-livekit-sfu-clustering-in-frankfurt',
    ],
  ),
  'brand/app-icon.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'web-app-manifest-icon',
    ['app/manifest.js'],
    ['/manifest.webmanifest'],
  ),
  'brand/favicon.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'site-icon',
    ['app/[locale]/layout.js'],
    ['/{locale}'],
  ),
  'brand/yk-micro-icon.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'navigation-brand-mark',
    ['app/components/navbar.jsx', 'app/components/footer.jsx'],
    ['/{locale}', '/{locale}/*'],
  ),
  'ota-1.jpg': asset(
    PUBLIC_ASSET_STATUSES.supporting,
    'sanitized-device-update-field-evidence',
    ['utils/data/project-media-manifest.cjs'],
    ['/{locale}/projects/embedded-linux-ota'],
    { provenance: Object.freeze({ kind: 'owner-project-archive', privacyReviewed: true }) },
  ),
  'project-media/atomic-ab-ota.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'project-architecture-evidence',
    ['utils/data/project-media-manifest.cjs'],
    ['/{locale}/projects/embedded-linux-ota'],
  ),
  'project-media/hologram-delivery-architecture.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'project-architecture-evidence',
    ['utils/data/project-media-manifest.cjs'],
    ['/{locale}/projects/ai-hologram-realtime-backend'],
  ),
  'project-media/hologram-fallback-states.svg': asset(
    PUBLIC_ASSET_STATUSES.supporting,
    'project-supporting-architecture-evidence',
    ['utils/data/project-media-manifest.cjs'],
    ['/{locale}/projects/ai-hologram-realtime-backend'],
  ),
  'project-media/hologram-installation-readiness.svg': asset(
    PUBLIC_ASSET_STATUSES.supporting,
    'project-supporting-architecture-evidence',
    ['utils/data/project-media-manifest.cjs'],
    ['/{locale}/projects/ai-hologram-realtime-backend'],
  ),
  'project-media/hologram-perception-control.svg': asset(
    PUBLIC_ASSET_STATUSES.supporting,
    'project-supporting-architecture-evidence',
    ['utils/data/project-media-manifest.cjs'],
    ['/{locale}/projects/ai-hologram-realtime-backend'],
  ),
  'project-media/honar-live-post-session.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'project-and-article-architecture-evidence',
    [
      'utils/data/project-media-manifest.cjs',
      'content/blogs/honar-amoozesh-5000-concurrent-webrtc-case-study.json',
    ],
    [
      '/{locale}/projects/real-time-learning-platform',
      '/{locale}/blog/honar-amoozesh-5000-concurrent-webrtc-case-study',
    ],
  ),
  'project-media/payment-idempotency-reconciliation.svg': asset(
    PUBLIC_ASSET_STATUSES.published,
    'project-architecture-evidence',
    ['utils/data/project-media-manifest.cjs'],
    ['/{locale}/projects/crypto-fiat-payment-gateway'],
  ),
});

module.exports = { PUBLIC_ASSET_STATUSES, publicAssetManifest };
