const PROJECT_PUBLICATION_TYPES = Object.freeze({
  caseStudy: 'case-study',
  projectSnapshot: 'project-snapshot',
  privateReference: 'private-reference',
});

const projectPublicationManifest = Object.freeze([
  { id: 1, slug: 'ai-hologram-realtime-backend', publicationType: PROJECT_PUBLICATION_TYPES.caseStudy },
  { id: 2, slug: 'investment-analytics-platform', publicationType: PROJECT_PUBLICATION_TYPES.caseStudy },
  { id: 3, slug: 'crypto-fiat-payment-gateway', publicationType: PROJECT_PUBLICATION_TYPES.caseStudy },
  { id: 4, slug: 'realtime-game-platform', publicationType: PROJECT_PUBLICATION_TYPES.projectSnapshot },
  { id: 5, slug: 'embedded-linux-ota', publicationType: PROJECT_PUBLICATION_TYPES.projectSnapshot },
  { id: 6, slug: 'learning-platform', publicationType: PROJECT_PUBLICATION_TYPES.projectSnapshot },
  { id: 7, slug: 'transaction-ledger-system', publicationType: PROJECT_PUBLICATION_TYPES.projectSnapshot },
  { id: 8, slug: 'blockchain-backend-platform', publicationType: PROJECT_PUBLICATION_TYPES.projectSnapshot },
]);

module.exports = {
  PROJECT_PUBLICATION_TYPES,
  projectPublicationManifest,
};
