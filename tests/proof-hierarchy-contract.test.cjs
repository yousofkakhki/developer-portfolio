const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const expectedHomepageWriting = [
  'honar-amoozesh-5000-concurrent-webrtc-case-study',
  'hybrid-room-scalability-nats-livekit',
  'ai-enhanced-sfu-for-low-latency-streaming',
  'ebpf-probes-for-faster-ota-fault-detection',
];

function publishedArticles() {
  return fs.readdirSync(path.join(root, 'content/blogs'))
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(read(`content/blogs/${file}`)))
    .filter(article => article.publishedAt && article.published !== false && !article.draft);
}

test('homepage writing is selected only by explicit editorial fields', () => {
  const articles = publishedArticles();
  for (const article of articles) {
    assert.equal(typeof article.homepageFeatured, 'boolean', `${article.slug}: homepageFeatured`);
    if (article.homepageFeatured) {
      assert.ok(Number.isInteger(article.homepagePriority), `${article.slug}: homepagePriority`);
      assert.ok(article.homepagePriority > 0, `${article.slug}: positive homepagePriority`);
    }
  }

  const selected = articles
    .filter(article => article.homepageFeatured)
    .sort((a, b) => a.homepagePriority - b.homepagePriority);
  assert.deepEqual(selected.map(article => article.slug), expectedHomepageWriting);
  assert.deepEqual(selected.map(article => article.homepagePriority), [1, 2, 3, 4]);

  const loader = read('utils/data/local-blogs.js');
  const page = read('app/[locale]/page.js');
  const section = read('app/components/homepage/blog/index.jsx');
  assert.match(loader, /export function getHomepageBlogs/);
  assert.match(loader, /homepageFeatured === true/);
  assert.match(loader, /homepagePriority/);
  assert.match(page, /getHomepageBlogs\(locale\)/);
  assert.doesNotMatch(page, /getLocalBlogs\(locale\)/);
  assert.doesNotMatch(section, /filter\(blog => blog\?\.cover_image\)/);
  assert.doesNotMatch(section, /slice\(0, 4\)/);
});

test('work page capabilities link to real evidence and exposes a four-step consulting process', () => {
  const page = read('app/[locale]/work-with-me/page.js');
  const destinations = [
    'projects/real-time-learning-platform',
    'projects/crypto-fiat-payment-gateway',
    'projects/ai-hologram-realtime-backend',
    'projects#project-embedded-linux-ota',
    '#erp-expertise',
  ];

  for (const destination of destinations) {
    assert.match(page, new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(page, /import Link from 'next\/link'/);
  assert.match(page, /text\.evidence\.map\(\(\{ id, title, detail, href \}/);
  assert.match(page, /href=\{href\}/);
  assert.match(page, /text\.viewEvidence/);
  assert.match(page, /text\.process\.map/);
  assert.match(page, /<ol className="brand-consulting-process"/);

  for (const locale of ['en', 'fa']) {
    assert.match(page, new RegExp(`${locale}: \\{[\\s\\S]*processTitle:`));
  }
  assert.match(page, /id: 'discovery'/);
  assert.match(page, /id: 'architecture-review'/);
  assert.match(page, /id: 'decision-brief'/);
  assert.match(page, /id: 'implementation-follow-up'/);
  assert.doesNotMatch(page, /notice period|timezone|hourly|price|€|\$\d/i);

  const css = read('app/css/globals.scss');
  assert.match(css, /\.brand-evidence-sheet__row--linked\s*\{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.brand-evidence-sheet__link\s*\{/);
  assert.match(css, /\.brand-consulting-process\s*\{/);
  assert.match(css, /\.brand-consulting-process\s+li\s*\{/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*\.brand-evidence-sheet__row--linked/);
});

test('homepage hero keeps two proof values and moves the degree into a compact credential line', () => {
  const hero = read('app/components/homepage/hero-section/index.jsx');
  const css = read('app/css/globals.scss');
  const proofSource = hero.slice(hero.indexOf('const proofPoints = ['), hero.indexOf('];', hero.indexOf('const proofPoints = [')));

  assert.equal((proofSource.match(/\bid:/g) || []).length, 2);
  assert.doesNotMatch(proofSource, /education\.msc-computer-science|metricDegree|metricUniversity/);
  assert.match(hero, /className="hero-degree-line"/);
  assert.match(hero, /t\('hero\.metricDegree'\)/);
  assert.match(hero, /t\('hero\.metricComputerScience'\)/);
  assert.match(hero, /t\('hero\.metricUniversity'\)/);
  assert.doesNotMatch(hero, /traceSteps|hero-trace|hero-proof-index|hero-socials|getApprovedGlobalProfiles|BsLinkedin/);
  assert.doesNotMatch(hero, /hero-metric-detail|WebRTC · LiveKit|NATS · Kafka|PostgreSQL/);

  assert.match(hero, /href=\{`\/\$\{locale\}\/work-with-me`\}/);
  assert.match(hero, /href=\{`\/\$\{locale\}\/projects`\}/);
  assert.match(hero, /href=\{careerFacts\.resume\.publicUrl\}/);
  assert.match(hero, /avatar-page-background\.webp/);
  assert.match(hero, /AvatarFaceOverlay/);

  assert.match(css, /grid-template-areas:[\s\S]*"summary portrait"[\s\S]*"actions portrait"[\s\S]*"proof portrait"[\s\S]*"credential portrait"/);
  assert.match(css, /\.hero-proof-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,/);
  assert.match(css, /\.hero-degree-line\s*\{/);
});
