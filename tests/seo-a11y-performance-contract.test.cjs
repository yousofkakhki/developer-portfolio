const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('project case-study schema includes primary image metadata and suppresses private repository schema', () => {
  const { buildProjectCaseStudyGraph } = require('../utils/data/project-schema.cjs');
  const project = {
    slug: 'verified-system',
    name: 'Verified system',
    description: 'Evidence-bounded technical case study.',
    role: 'Backend engineer',
    tools: ['Go', 'PostgreSQL'],
    sourceAvailability: 'private-client-source',
    media: [{
      id: 'verified-architecture',
      primary: true,
      publicApproved: true,
      sensitive: false,
      src: '/project-media/verified.svg',
      width: 1600,
      height: 900,
      alt: 'Architecture boundary diagram',
      caption: 'Sanitized architecture boundary.',
    }],
    artifacts: [{
      id: 'supporting-diagram',
      type: 'architecture-diagram',
      relationship: 'supporting-evidence',
      url: '/project-media/verified.svg',
      ownerApproved: true,
    }],
  };

  const graph = buildProjectCaseStudyGraph({
    project,
    category: 'Distributed systems',
    locale: 'en',
    siteUrl: 'https://example.test',
    projectsLabel: 'Systems work',
  });
  const types = graph['@graph'].map(node => node['@type']);
  const article = graph['@graph'].find(node => node['@type'] === 'TechArticle');
  const image = graph['@graph'].find(node => node['@type'] === 'ImageObject');

  assert.deepEqual(types, ['TechArticle', 'ImageObject', 'BreadcrumbList']);
  assert.equal(article.image['@id'], 'https://example.test/en/projects/verified-system#primary-image');
  assert.equal(article.thumbnailUrl, 'https://example.test/en/projects/verified-system/opengraph-image');
  assert.deepEqual(image, {
    '@type': 'ImageObject',
    '@id': 'https://example.test/en/projects/verified-system#primary-image',
    url: 'https://example.test/project-media/verified.svg',
    contentUrl: 'https://example.test/project-media/verified.svg',
    width: 1600,
    height: 900,
    name: 'Architecture boundary diagram',
    caption: 'Sanitized architecture boundary.',
    thumbnailUrl: 'https://example.test/en/projects/verified-system/opengraph-image',
  });
  assert.equal(types.includes('SoftwareSourceCode'), false);

  const route = read('app/[locale]/projects/[slug]/page.js');
  assert.match(route, /buildProjectCaseStudyGraph/);
  assert.doesNotMatch(route, /'@type': 'CreativeWork'/);
});

test('structured image objects expose complete localized semantics and real dimensions', () => {
  const { buildImageObject } = require('../utils/data/image-schema.cjs');
  assert.deepEqual(buildImageObject({
    id: 'https://example.test/#profile-image',
    url: 'https://example.test/profile.webp',
    width: 1254,
    height: 1254,
    name: 'Portrait of Yousef Kakhki',
    caption: 'Professional profile portrait of Yousef Kakhki.',
    thumbnailUrl: 'https://example.test/en/opengraph-image',
  }), {
    '@type': 'ImageObject',
    '@id': 'https://example.test/#profile-image',
    url: 'https://example.test/profile.webp',
    contentUrl: 'https://example.test/profile.webp',
    width: 1254,
    height: 1254,
    name: 'Portrait of Yousef Kakhki',
    caption: 'Professional profile portrait of Yousef Kakhki.',
    thumbnailUrl: 'https://example.test/en/opengraph-image',
  });

  const globalSchema = read('app/components/structured-data.jsx');
  const articleRoute = read('app/[locale]/blog/[slug]/page.js');
  assert.match(globalSchema, /buildImageObject/);
  assert.match(globalSchema, /width:\s*1254/);
  assert.match(globalSchema, /height:\s*1254/);
  assert.match(globalSchema, /localized\(profileImageSemantics\.name, locale\)/);
  assert.match(globalSchema, /localized\(profileImageSemantics\.caption, locale\)/);
  assert.match(articleRoute, /buildImageObject/);
  assert.match(articleRoute, /name:\s*blog\.title/);
  assert.match(articleRoute, /caption:\s*blog\.seo_description/);
  assert.match(articleRoute, /thumbnailUrl:\s*articleImageUrl/);
});

test('Persian media captions isolate fixed technical identifiers without changing the text', () => {
  const { isolateBidiText, segmentBidiText } = require('../utils/data/bidi-text.cjs');
  const text = 'مرز LiveKit و WebRTC؛ بازپخش HLS پس از نشست.';
  const terms = ['LiveKit', 'WebRTC', 'HLS'];
  assert.deepEqual(segmentBidiText(text, terms), [
    { text: 'مرز ', direction: null },
    { text: 'LiveKit', direction: 'ltr' },
    { text: ' و ', direction: null },
    { text: 'WebRTC', direction: 'ltr' },
    { text: '؛ بازپخش ', direction: null },
    { text: 'HLS', direction: 'ltr' },
    { text: ' پس از نشست.', direction: null },
  ]);
  assert.equal(
    isolateBidiText(text, terms),
    'مرز \u2066LiveKit\u2069 و \u2066WebRTC\u2069؛ بازپخش \u2066HLS\u2069 پس از نشست.',
  );

  const figure = read('app/components/projects/project-media-figure.jsx');
  const catalog = read('utils/data/project-catalog.js');
  const manifest = read('utils/data/project-media-manifest.cjs');
  assert.match(figure, /<bdi dir="ltr"[^>]*>/);
  assert.match(figure, /isolateBidiText\(media\.alt, media\.technicalTerms\)/);
  assert.match(figure, /media\.locale === 'fa'/);
  assert.match(catalog, /locale,/);
  assert.match(manifest, /technicalTerms:\s*Object\.freeze\(\['LiveKit', 'WebRTC', 'HLS'\]\)/);
  assert.match(manifest, /technicalTerms:\s*Object\.freeze\(\['API\/WebSocket'\]\)/);
  assert.match(manifest, /technicalTerms:\s*Object\.freeze\(\['A\/B', 'artifact'\]\)/);
});

test('avatar visual and voice runtimes remain behind one explicit activation control', () => {
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');
  assert.match(overlay, /const startAvatarVisual = useCallback/);
  assert.match(overlay, /const startVoiceSession = useCallback\(\(\) => \{[\s\S]*startAvatarVisual\(\)/);
  assert.match(overlay, /onClick=\{startVoiceSession\}/);
  assert.match(overlay, /import\(['"]\.\/avatar-face-canvas['"]\)/);
  assert.match(overlay, /import\(['"]\.\/avatar-voice-session['"]\)/);
  assert.doesNotMatch(overlay, /window\.addEventListener\(['"]load['"]/);
  assert.doesNotMatch(overlay, /requestIdleCallback/);
  assert.doesNotMatch(overlay, /hardFallbackTimer/);
});

test('deployment-owned local article routes do not opt into runtime regeneration', () => {
  const routes = [
    'app/[locale]/blog/page.js',
    'app/[locale]/blog/[slug]/page.js',
    'app/[locale]/blog/pillar/[pillar]/page.js',
  ];

  for (const route of routes) {
    const source = read(route);
    assert.doesNotMatch(source, /export const revalidate\s*=\s*60/);
    assert.doesNotMatch(source, /force-dynamic|noStore\(|cache:\s*['"]no-store['"]/);
  }
});
