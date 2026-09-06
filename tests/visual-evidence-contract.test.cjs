const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const expectedCaseStudies = [
  'real-time-learning-platform',
  'crypto-fiat-payment-gateway',
  'ai-hologram-realtime-backend',
];

test('project publication order leads with the three evidence-backed flagship case studies', () => {
  const { PROJECT_PUBLICATION_TYPES, projectPublicationManifest } = require('../utils/data/project-publication-manifest.cjs');
  const caseStudies = projectPublicationManifest
    .filter(project => project.publicationType === PROJECT_PUBLICATION_TYPES.caseStudy)
    .map(project => project.slug);
  const snapshots = projectPublicationManifest
    .filter(project => project.publicationType === PROJECT_PUBLICATION_TYPES.projectSnapshot)
    .map(project => project.slug);

  assert.deepEqual(caseStudies, expectedCaseStudies);
  assert.deepEqual(snapshots, [
    'investment-analytics-platform',
    'realtime-game-platform',
    'embedded-linux-ota',
    'learning-platform',
    'transaction-ledger-system',
    'blockchain-backend-platform',
  ]);
});

test('published project media is bilingual, approved, role-correct, and has one primary per case study', () => {
  const {
    PROJECT_MEDIA_EVIDENCE_ROLES,
    PROJECT_MEDIA_TYPES,
    projectMediaManifest,
    validateProjectMediaManifest,
  } = require('../utils/data/project-media-manifest.cjs');

  assert.deepEqual(validateProjectMediaManifest(), []);
  for (const slug of expectedCaseStudies) {
    const media = projectMediaManifest[slug] || [];
    assert.equal(media.filter(item => item.primary && item.publicApproved && !item.sensitive).length, 1, slug);
  }

  const honar = projectMediaManifest['real-time-learning-platform'];
  assert.equal(honar[0].type, PROJECT_MEDIA_TYPES.architectureDiagram);
  assert.equal(honar[0].evidenceRole, PROJECT_MEDIA_EVIDENCE_ROLES.architecture);
  assert.match(honar[0].src, /honar-live-post-session\.svg$/);
  assert.ok(honar[0].alt.en && honar[0].alt.fa);
  assert.ok(honar[0].caption.en && honar[0].caption.fa);

  const hologram = projectMediaManifest['ai-hologram-realtime-backend'];
  const supporting = hologram.filter(item => !item.primary && item.publicApproved && !item.sensitive);
  assert.deepEqual(supporting.map(item => item.src), [
    '/project-media/hologram-perception-control.svg',
    '/project-media/hologram-installation-readiness.svg',
    '/project-media/hologram-fallback-states.svg',
  ]);
  assert.ok(hologram.every(item => item.type === PROJECT_MEDIA_TYPES.architectureDiagram));
  assert.ok(hologram.every(item => !/\.(?:jpe?g|png|webp)$/i.test(item.src)));
  assert.deepEqual(projectMediaManifest['realtime-game-platform'], []);
});

test('project catalog consumes validated media and artifact manifests instead of untyped image arrays', () => {
  const catalog = read('utils/data/project-catalog.js');
  assert.match(catalog, /getPublishableProjectMedia/);
  assert.match(catalog, /getApprovedProjectArtifacts/);
  assert.match(catalog, /projectSourceAvailability/);
  assert.doesNotMatch(catalog, /\bimages\s*:/);
});

test('project artifacts render only approved real relationships and never use a generic profile as source', () => {
  const {
    projectArtifactManifest,
    validateProjectArtifactManifest,
  } = require('../utils/data/project-artifact-manifest.cjs');

  assert.deepEqual(validateProjectArtifactManifest(), []);
  const json = JSON.stringify(projectArtifactManifest);
  assert.doesNotMatch(json, /github\.com\/yousofkakhki\/?["']/i);
  assert.doesNotMatch(json, /codeRepository/i);
});

test('project index renders manifest-backed primary media before snapshot fallbacks', () => {
  const index = read('app/[locale]/projects/page.js');
  const hero = read('app/components/projects/project-hero-media.jsx');

  assert.match(index, /ProjectHeroMedia/);
  assert.doesNotMatch(index, /import ProjectVisual/);
  assert.match(index, /project=\{project\}/);
  assert.match(index, /fallbackLabel=/);
  assert.match(hero, /if \(!primary\)/);
  assert.match(hero, /<ProjectVisual/);
});

test('generic visual fallback is truthful, project-specific, and limited to snapshots', () => {
  const hero = read('app/components/projects/project-hero-media.jsx');
  const visual = read('app/components/homepage/projects/project-visual.jsx');

  assert.match(hero, /project\.publicationType !== 'project-snapshot'/);
  assert.match(hero, /publicationType=\{project\.publicationType\}/);
  assert.match(hero, /projectLabel=\{project\.name\}/);
  assert.match(visual, /data-project-visual=\{publicationType\}/);
  assert.match(visual, /data-project-visual-kind=\{visualKind\}/);
  assert.match(visual, /\{projectLabel\}/);
  assert.doesNotMatch(visual, /data-project-visual="case-study"/);
});

test('payment case study exposes a localized semantic state-transition table', () => {
  const source = read('utils/data/project-case-studies.js')
    .replace(/^import .*;\s*$/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/export function /g, 'function ');
  const sandbox = {
    EVIDENCE_STATUS: { verifiedPublic: 'verified-public' },
    localized: (value, locale = 'en') => typeof value === 'string' ? value : value?.[locale] || value?.en || '',
    result: null,
  };
  vm.runInNewContext(
    `${source}\nresult = { en: getProjectCaseStudy('crypto-fiat-payment-gateway', 'en'), fa: getProjectCaseStudy('crypto-fiat-payment-gateway', 'fa') };`,
    sandbox,
  );
  const localizedStudies = JSON.parse(JSON.stringify(sandbox.result));

  for (const locale of ['en', 'fa']) {
    const table = localizedStudies[locale].stateTransitions;
    assert.ok(table?.title, `${locale}: state-transition title`);
    assert.equal(table.columns.length, 3, `${locale}: columns`);
    assert.deepEqual(table.rows.map(row => row.id), [
      'initial-request',
      'duplicate-request',
      'provider-timeout',
      'classified-result',
    ]);
    assert.ok(table.rows.every(row => row.trigger && row.state && row.action));
  }

  const component = read('app/components/projects/project-state-transition-table.jsx');
  const detail = read('app/[locale]/projects/[slug]/page.js');
  assert.match(component, /<table/);
  assert.match(component, /<caption/);
  assert.match(component, /scope="col"/);
  assert.match(component, /scope="row"/);
  assert.match(component, /tabIndex="0"/);
  assert.match(detail, /ProjectStateTransitionTable/);
  assert.match(detail, /stateTransitions=\{caseStudy\.stateTransitions\}/);

  const css = read('app/css/globals.scss');
  assert.match(css, /\.project-state-transitions__scroll[\s\S]*overflow-x:\s*auto/);
  assert.match(css, /\.project-state-transitions table[\s\S]*min-width:\s*42rem/);
  assert.match(css, /\.project-state-transitions :where\(th, td\)[\s\S]*text-align:\s*start/);
  assert.match(css, /\.project-state-transitions__scroll:focus-visible/);
});

test('project media and artifact presentation stays server-rendered, semantic, and conditional', () => {
  const hero = read('app/components/projects/project-hero-media.jsx');
  const figure = read('app/components/projects/project-media-figure.jsx');
  const gallery = read('app/components/projects/project-evidence-gallery.jsx');
  const artifacts = read('app/components/projects/project-artifact-list.jsx');
  const card = read('app/components/homepage/projects/project-card.jsx');
  const detail = read('app/[locale]/projects/[slug]/page.js');

  for (const source of [hero, figure, gallery, artifacts, card]) {
    assert.doesNotMatch(source, /["']use client["']/);
  }
  assert.match(figure, /<figure/);
  assert.match(figure, /<figcaption/);
  assert.match(gallery, /supportingMedia\.length < 2/);
  assert.match(gallery, /ProjectMediaFigure/);
  assert.match(artifacts, /ownerApproved/);
  assert.match(artifacts, /private-client-source/);
  assert.doesNotMatch(artifacts, /disabled/);
  assert.match(card, /ProjectHeroMedia/);
  assert.doesNotMatch(card, /useState|data-project-media-state|onError/);
  assert.match(detail, /ProjectHeroMedia/);
  assert.match(detail, /ProjectEvidenceGallery/);
  assert.match(detail, /ProjectArtifactList/);
});

test('Honar visual separates live WebRTC from delayed post-session HLS without a live fallback claim', () => {
  const svg = read('public/project-media/honar-live-post-session.svg');
  assert.match(svg, /LIVE SESSION/);
  assert.match(svg, /POST-SESSION/);
  assert.match(svg, /time boundary/i);
  assert.match(svg, /WebRTC \/ LiveKit/);
  assert.match(svg, /HLS playback available later/);
  assert.doesNotMatch(svg, /HLS fallback|passive viewers|transparent switch|5,000 publishers|one SFU/i);
});

test('SVG claim detection inspects visible text instead of gradient coordinates', () => {
  const { findEmbeddedPerformanceClaims } = require('../scripts/audit-public-assets.cjs');
  assert.deepEqual(
    findEmbeddedPerformanceClaims('gradient.svg', Buffer.from('<svg><stop offset="100%"/></svg>')),
    [],
  );
  assert.deepEqual(
    findEmbeddedPerformanceClaims('claim.svg', Buffer.from('<svg><text>5,000+ concurrent users</text></svg>')),
    ['plus-quantity: 5,000+', 'audience-capacity: 5,000+ concurrent users'],
  );
});

test('public image audit has a complete fail-closed classification manifest', () => {
  const { publicAssetManifest } = require('../utils/data/public-asset-manifest.cjs');
  const { auditPublicAssets } = require('../scripts/audit-public-assets.cjs');
  const result = auditPublicAssets({ write: false });

  assert.equal(result.errors.length, 0, result.errors.join('\n'));
  assert.deepEqual(result.scannedPaths, Object.keys(publicAssetManifest).sort());
  assert.ok(result.assets.length > 0);
  assert.equal(result.summary['draft-private'] || 0, 0);
  assert.equal(result.summary.remove || 0, 0);
  assert.equal(result.summary.unreferenced || 0, 0);

  for (const asset of result.assets) {
    assert.ok(asset.width > 0 && asset.height > 0, `${asset.path}: dimensions`);
    assert.ok(asset.byteSize > 0 && asset.format, `${asset.path}: file metadata`);
    assert.ok(asset.publishedReferences.length > 0, `${asset.path}: published reference`);
    assert.deepEqual(asset.embeddedPerformanceClaims, [], `${asset.path}: embedded claims`);
    if (asset.containsRecognizablePeople) {
      assert.ok(asset.approvalEvidence?.kind, `${asset.path}: explicit people approval`);
    }
  }

  for (const relativePath of [
    'public/blog/og',
    'public/ai-1.jpg',
    'public/ai-2.jpg',
    'public/ai-3.jpg',
    'public/game-1.jpg',
    'public/recommendation-ali-mohammadian.jpg',
    'public/recommendation-sara-mozaffari.jpg',
    'public/og-default.png',
    'public/png/placeholder.png',
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), false, `${relativePath} must not remain public`);
  }
  assert.equal(
    fs.existsSync(path.join(root, 'app/components/homepage/projects/single-project.jsx')),
    false,
    'unused legacy project component must not retain a deleted placeholder import',
  );
});
