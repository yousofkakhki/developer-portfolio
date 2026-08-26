const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const {
  BLOG_TRANSLATION_AVAILABILITY,
  getLocaleSwitchTarget,
} = require('../utils/data/translation-availability.cjs');
const { availableBlogLocales } = require('../utils/data/blog-locales.cjs');

function evaluateModule(file, resultExpression, context = {}) {
  const source = read(file)
    .replace(/^import .*;\s*$/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/export function /g, 'function ');
  const sandbox = { ...context, result: null };
  vm.runInNewContext(source + '\nresult = ' + resultExpression + ';', sandbox, { filename: file });
  return sandbox.result;
}

const careerFacts = evaluateModule('utils/data/career-facts.js', 'careerFacts');
const publicationManifest = require('../utils/data/project-publication-manifest.cjs');
const projectCatalog = evaluateModule(
  'utils/data/project-catalog.js',
  'projectCatalog',
  {
    publicationManifest,
    localized: (value, locale = 'en') => typeof value === 'string' ? value : value?.[locale] || value?.en || '',
  },
);

test('declared article translations match complete localized content exactly', () => {
  const blogs = fs.readdirSync(path.join(root, 'content/blogs'))
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(read('content/blogs/' + file)))
    .filter(article => article.published !== false && !article.draft);

  assert.deepEqual(
    Object.keys(BLOG_TRANSLATION_AVAILABILITY).sort(),
    blogs.map(article => article.slug).sort(),
  );
  for (const article of blogs) {
    assert.deepEqual(
      [...BLOG_TRANSLATION_AVAILABILITY[article.slug]],
      availableBlogLocales(article, ['en', 'fa']),
      article.slug,
    );
  }
});

test('locale switching preserves translated article identity and labels fallbacks', () => {
  assert.deepEqual(
    getLocaleSwitchTarget('/en/blog/honar-amoozesh-5000-concurrent-webrtc-case-study', 'en', 'fa'),
    {
      href: '/fa/blog/honar-amoozesh-5000-concurrent-webrtc-case-study',
      exact: true,
      reason: null,
    },
  );
  assert.deepEqual(
    getLocaleSwitchTarget('/en/blog/ai-enhanced-sfu-for-low-latency-streaming', 'en', 'fa'),
    {
      href: '/fa/blog',
      exact: false,
      reason: 'article-translation-unavailable',
    },
  );
  assert.deepEqual(
    getLocaleSwitchTarget('/en/blog/pillar/real-time-media', 'en', 'fa'),
    {
      href: '/fa/blog',
      exact: false,
      reason: 'topic-translation-unavailable',
    },
  );
  assert.equal(getLocaleSwitchTarget('/fa/projects', 'fa', 'en').href, '/en/projects');

  const switcher = read('app/components/language-switcher.jsx');
  assert.match(switcher, /persianTarget\.exact/);
  assert.match(switcher, /persianIndexFallback/);
  assert.match(switcher, /brand-language__fallback/);
});

test('canonical roles and projects carry identical fact IDs and certainty across locales', () => {
  for (const role of careerFacts.roles) {
    assert.ok(role.id);
    assert.ok(role.title.en && role.title.fa, role.id);
    assert.ok(role.publicDate.en && role.publicDate.fa, role.id);
    assert.equal(role.summary.en.length, role.summary.fa.length, role.id);
    assert.ok(role.evidenceStatus);
  }

  for (const project of projectCatalog) {
    assert.ok(project.factIds.length > 0, project.slug);
    assert.ok(project.name.en && project.name.fa, project.slug);
    assert.ok(project.summary.en && project.summary.fa, project.slug);
    assert.ok(project.outcome.en && project.outcome.fa, project.slug);
    assert.ok(project.evidenceLevel, project.slug);
    assert.ok(project.publicationType, project.slug);
  }

  assert.match(read('app/components/homepage/hero-section/index.jsx'), /data-fact-id=\{point\.id\}/);
  assert.match(read('app/components/homepage/experience/index.jsx'), /data-fact-id=/);
  assert.match(read('app/components/homepage/projects/project-card.jsx'), /data-fact-ids=\{project\.factIds/);
  assert.match(read('app/[locale]/projects/page.js'), /data-fact-ids=\{project\.factIds/);
});

test('Persian evidence copy is neutral and technical tokens keep explicit direction', () => {
  const publicCopy = [
    read('messages/fa.json'),
    read('utils/data/career-facts.js'),
    read('utils/data/project-catalog.js'),
    read('app/[locale]/work-with-me/page.js'),
  ].join('\n');

  assert.doesNotMatch(publicCopy, /۱۰\+\s*تجربه/);
  assert.doesNotMatch(publicCopy, /معماری کسری/);
  assert.doesNotMatch(publicCopy, /امن و پربازده|یکپارچه و قابل اعتماد|موفقیت بزرگ|تأخیر بسیار کم/);
  assert.match(read('app/[locale]/work-with-me/page.js'), /مشاورهٔ معماری سامانه به‌صورت پروژه‌ای یا پاره‌وقت/);

  const avin = careerFacts.roles.find(role => role.id === 'avin-avisa');
  assert.deepEqual(
    [...avin.technologies],
    ['Node.js', 'Web3.js', 'PostgreSQL', 'Redis'],
  );
  assert.equal(JSON.parse(read('messages/fa.json')).experiences, undefined);
  assert.equal(fs.existsSync(path.join(root, 'utils/data/projects-data.js')), false);

  for (const file of [
    'app/components/homepage/skills/index.jsx',
    'app/components/homepage/experience/index.jsx',
    'app/components/homepage/projects/project-card.jsx',
    'app/[locale]/projects/page.js',
  ]) {
    assert.match(read(file), /<bdi dir="ltr">/);
  }
});
