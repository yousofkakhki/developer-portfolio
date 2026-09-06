const SOURCE_AVAILABILITY = Object.freeze({
  publicRepository: 'public-repository',
  companionReference: 'companion-reference',
  privateClientSource: 'private-client-source',
  academicRepository: 'academic-repository',
  notApplicable: 'not-applicable',
});

const PROJECT_ARTIFACT_TYPES = Object.freeze({
  repository: 'repository',
  demo: 'demo',
  technicalArticle: 'technical-article',
  architectureDiagram: 'architecture-diagram',
  designDocument: 'design-document',
  talk: 'talk',
  presentation: 'presentation',
});

const PROJECT_ARTIFACT_RELATIONSHIPS = Object.freeze({
  productionSource: 'production-source',
  sanitizedReference: 'sanitized-reference',
  supportingEvidence: 'supporting-evidence',
});

const projectSourceAvailability = Object.freeze({
  'real-time-learning-platform': SOURCE_AVAILABILITY.privateClientSource,
  'crypto-fiat-payment-gateway': SOURCE_AVAILABILITY.privateClientSource,
  'ai-hologram-realtime-backend': SOURCE_AVAILABILITY.privateClientSource,
  'investment-analytics-platform': SOURCE_AVAILABILITY.privateClientSource,
  'realtime-game-platform': SOURCE_AVAILABILITY.privateClientSource,
  'embedded-linux-ota': SOURCE_AVAILABILITY.privateClientSource,
  'learning-platform': SOURCE_AVAILABILITY.academicRepository,
  'transaction-ledger-system': SOURCE_AVAILABILITY.privateClientSource,
  'blockchain-backend-platform': SOURCE_AVAILABILITY.academicRepository,
});

const projectArtifactManifest = Object.freeze({
  'real-time-learning-platform': Object.freeze([
    Object.freeze({
      id: 'honar-definitive-production-case-study',
      type: PROJECT_ARTIFACT_TYPES.technicalArticle,
      relationship: PROJECT_ARTIFACT_RELATIONSHIPS.supportingEvidence,
      url: '/en/blog/honar-amoozesh-5000-concurrent-webrtc-case-study',
      urlByLocale: Object.freeze({
        en: '/en/blog/honar-amoozesh-5000-concurrent-webrtc-case-study',
        fa: '/fa/blog/honar-amoozesh-5000-concurrent-webrtc-case-study',
      }),
      label: Object.freeze({ en: 'Read the production case study', fa: 'مطالعهٔ موردی تولید را بخوانید' }),
      description: Object.freeze({
        en: 'Definitive account of the verified live WebRTC and delayed post-session HLS boundary.',
        fa: 'شرح قطعی مرز تأییدشدهٔ WebRTC زنده و HLS با تأخیر پس از نشست.',
      }),
      ownerApproved: true,
      lastVerifiedAt: '2026-08-31',
    }),
    Object.freeze({
      id: 'honar-sanitized-architecture-diagram',
      type: PROJECT_ARTIFACT_TYPES.architectureDiagram,
      relationship: PROJECT_ARTIFACT_RELATIONSHIPS.supportingEvidence,
      url: '/project-media/honar-live-post-session.svg',
      label: Object.freeze({ en: 'View architecture diagram', fa: 'مشاهدهٔ نمودار معماری' }),
      description: Object.freeze({
        en: 'Sanitized visual of the live-session and post-session media paths.',
        fa: 'نمای پاک‌سازی‌شدهٔ مسیرهای رسانه‌ای نشست زنده و پس از نشست.',
      }),
      ownerApproved: true,
      lastVerifiedAt: '2026-08-31',
    }),
  ]),
  'crypto-fiat-payment-gateway': Object.freeze([
    Object.freeze({
      id: 'gateway-sanitized-architecture-diagram',
      type: PROJECT_ARTIFACT_TYPES.architectureDiagram,
      relationship: PROJECT_ARTIFACT_RELATIONSHIPS.supportingEvidence,
      url: '/project-media/payment-idempotency-reconciliation.svg',
      label: Object.freeze({ en: 'View architecture diagram', fa: 'مشاهدهٔ نمودار معماری' }),
      description: Object.freeze({
        en: 'Sanitized workflow view of durable intent, provider boundaries, retries, and reconciliation.',
        fa: 'نمای پاک‌سازی‌شدهٔ جریان قصد پایدار، مرز ارائه‌دهندگان، تلاش مجدد و تطبیق.',
      }),
      ownerApproved: true,
      lastVerifiedAt: '2026-08-31',
    }),
  ]),
  'ai-hologram-realtime-backend': Object.freeze([
    Object.freeze({
      id: 'hologram-sanitized-architecture-diagram',
      type: PROJECT_ARTIFACT_TYPES.architectureDiagram,
      relationship: PROJECT_ARTIFACT_RELATIONSHIPS.supportingEvidence,
      url: '/project-media/hologram-delivery-architecture.svg',
      label: Object.freeze({ en: 'View architecture diagram', fa: 'مشاهدهٔ نمودار معماری' }),
      description: Object.freeze({
        en: 'Sanitized view of the perception, control, projection, and fallback boundaries.',
        fa: 'نمای پاک‌سازی‌شدهٔ مرزهای ادراک، کنترل، پروجکشن و رفتار جایگزین.',
      }),
      ownerApproved: true,
      lastVerifiedAt: '2026-08-31',
    }),
  ]),
});

function validateLocalized(value, field, id, errors) {
  for (const locale of ['en', 'fa']) {
    if (typeof value?.[locale] !== 'string' || !value[locale].trim()) {
      errors.push(`${id}: ${field}.${locale} is required.`);
    }
  }
}

function validateProjectArtifactManifest() {
  const errors = [];
  const ids = new Set();
  const types = new Set(Object.values(PROJECT_ARTIFACT_TYPES));
  const relationships = new Set(Object.values(PROJECT_ARTIFACT_RELATIONSHIPS));

  for (const [slug, artifacts] of Object.entries(projectArtifactManifest)) {
    if (!projectSourceAvailability[slug]) errors.push(`${slug}: source availability is required.`);
    for (const artifact of artifacts) {
      if (!artifact?.id || ids.has(artifact.id)) errors.push(`${slug}: artifact IDs must be unique and non-empty.`);
      ids.add(artifact?.id);
      if (!types.has(artifact?.type)) errors.push(`${artifact?.id}: unsupported artifact type.`);
      if (!relationships.has(artifact?.relationship)) errors.push(`${artifact?.id}: unsupported artifact relationship.`);
      if (typeof artifact?.url !== 'string' || !artifact.url.trim()) errors.push(`${artifact?.id}: URL is required.`);
      if (artifact?.url === 'https://github.com/yousofkakhki' || artifact?.url === 'https://github.com/yousofkakhki/') {
        errors.push(`${artifact?.id}: a generic profile cannot be a project source.`);
      }
      validateLocalized(artifact?.label, 'label', artifact?.id, errors);
      validateLocalized(artifact?.description, 'description', artifact?.id, errors);
      if (artifact?.ownerApproved !== true) errors.push(`${artifact?.id}: only owner-approved artifacts belong in the public manifest.`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(artifact?.lastVerifiedAt || '')) errors.push(`${artifact?.id}: lastVerifiedAt is required.`);
      if (artifact?.relationship === PROJECT_ARTIFACT_RELATIONSHIPS.productionSource && artifact?.type !== PROJECT_ARTIFACT_TYPES.repository) {
        errors.push(`${artifact?.id}: production source must be a repository.`);
      }
    }
  }
  return errors;
}

function getApprovedProjectArtifacts(slug) {
  return (projectArtifactManifest[slug] || []).filter(artifact => artifact.ownerApproved === true);
}

module.exports = {
  PROJECT_ARTIFACT_RELATIONSHIPS,
  PROJECT_ARTIFACT_TYPES,
  SOURCE_AVAILABILITY,
  getApprovedProjectArtifacts,
  projectArtifactManifest,
  projectSourceAvailability,
  validateProjectArtifactManifest,
};
