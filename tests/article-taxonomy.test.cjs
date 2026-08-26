const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const blogsDir = path.join(root, 'content/blogs');
const { ARTICLE_TYPE_VALUES } = require('../utils/data/article-types.cjs');
const { availableBlogLocales } = require('../utils/data/blog-locales.cjs');

const published = fs.readdirSync(blogsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(fs.readFileSync(path.join(blogsDir, file), 'utf8')))
  .filter(article => article.published !== false && !article.draft);

const expectedTypes = new Map([
  ['honar-amoozesh-5000-concurrent-webrtc-case-study', 'production-case-study'],
  ['hybrid-room-scalability-nats-livekit', 'design-guide'],
  ['eu-scale-livekit-sfu-clustering-in-frankfurt', 'reference-architecture'],
  ['ai-enhanced-sfu-for-low-latency-streaming', 'architecture-essay'],
  ['ebpf-probes-for-faster-ota-fault-detection', 'design-hypothesis'],
  ['building-bilingual-portfolio-nextjs', 'site-engineering'],
]);

test('every published article has exactly one explicit supported content type', () => {
  assert.equal(published.length, expectedTypes.size);
  for (const article of published) {
    assert.ok(ARTICLE_TYPE_VALUES.includes(article.articleType), article.slug);
    assert.equal(article.articleType, expectedTypes.get(article.slug), article.slug);
  }
});

test('translation availability is derived from complete localized article records', () => {
  const expectedLocales = new Map([
    ['honar-amoozesh-5000-concurrent-webrtc-case-study', ['en', 'fa']],
    ['hybrid-room-scalability-nats-livekit', ['en', 'fa']],
    ['building-bilingual-portfolio-nextjs', ['en', 'fa']],
    ['ai-enhanced-sfu-for-low-latency-streaming', ['en']],
    ['eu-scale-livekit-sfu-clustering-in-frankfurt', ['en']],
    ['ebpf-probes-for-faster-ota-fault-detection', ['en']],
  ]);
  for (const article of published) {
    assert.deepEqual(availableBlogLocales(article, ['en', 'fa']), expectedLocales.get(article.slug), article.slug);
  }
});

test('site-engineering copy matches installed framework majors and current delivery boundaries', () => {
  const article = published.find(candidate => candidate.slug === 'building-bilingual-portfolio-nextjs');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const nextMajor = pkg.dependencies.next.match(/(\d+)/)[1];
  const reactMajor = pkg.dependencies.react.match(/(\d+)/)[1];
  assert.match(article.content.en, new RegExp(`Next\\.js ${nextMajor}`));
  assert.match(article.content.en, new RegExp(`React ${reactMajor}`));
  assert.match(article.content.en, /does not publish or deploy the image/i);
  assert.match(article.content.en, /not automated visual regression testing/i);
  assert.doesNotMatch(article.content.en, /this portfolio is open source|visual regression testing is planned|deployment automation is planned/i);
});

test('thin PWA and one-post topic pages are not presented as indexable pillars', () => {
  const pillars = fs.readFileSync(path.join(root, 'utils/data/blog-pillars.js'), 'utf8');
  const redirects = fs.readFileSync(path.join(root, 'next.config.js'), 'utf8');
  assert.doesNotMatch(pillars, /pwa-product/);
  assert.match(pillars, /MIN_INDEXABLE_PILLAR_ARTICLES\s*=\s*3/);
  assert.match(redirects, /blog\/pillar\/pwa-product/);
  assert.match(redirects, /blog\/pillar\/systems-edge/);
});
