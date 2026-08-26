const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const blogsDir = path.join(root, 'content/blogs');
const legacyUnsafeSlugs = [
  'getting-a-german-blue-card-without-a-degree-in-2026',
  'hybrid-sfumcu-webinar-architecture-for-10k-viewers',
  'idempotent-cryptofiat-gateway-in-frankfurt',
  'offlinefirst-pwa-web-sensors-sleep',
  'preemptrt-tuning-for-sub-second-ota-on-arm-edge-nodes',
  'sfu-first-webrtc-scaling-in-frankfurt-for-1k',
];

const publicSourceRoots = ['app', 'utils', 'messages', 'content', 'public'];
const publicTextExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.svg', '.txt', '.xml', '.webmanifest']);

function collectPublicSource(directory, collected = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectPublicSource(absolute, collected);
    else if (publicTextExtensions.has(path.extname(entry.name))) collected.push(fs.readFileSync(absolute, 'utf8'));
  }
  return collected;
}

test('public sources reject unsupported and internal editorial wording', () => {
  const publicSource = publicSourceRoots
    .flatMap(relative => collectPublicSource(path.join(root, relative)))
    .join('\n');

  for (const pattern of [
    /under\s+80\s*ms/i,
    /کمتر از\s*۸۰\s*میلی[‌\s-]*ثانیه/,
    /200\+\s*exhibitors/i,
    /unsupported latency figures are intentionally omitted/i,
    /this is an award claim/i,
    /selected public facts are evidence-bounded/i,
    /10\+\s+across/i,
    /(?:10|۱۰)\+\s*تجربه/,
    /System Architect & Technical Lead/i,
  ]) {
    assert.doesNotMatch(publicSource, pattern);
  }
});

test('legacy unsupported case-study drafts cannot be published if reintroduced', () => {
  const bySlug = new Map(fs.readdirSync(blogsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(blogsDir, file), 'utf8')))
    .map(blog => [blog.slug, blog]));
  for (const slug of legacyUnsafeSlugs) {
    const blog = bySlug.get(slug);
    if (blog) assert.equal(blog.published, false, slug);
  }
});

test('revised hybrid-classroom article is evidence-bounded and explicitly separates delayed HLS', () => {
  const article = JSON.parse(fs.readFileSync(path.join(blogsDir, 'hybrid-room-scalability-blog.json'), 'utf8'));
  const copy = JSON.stringify(article);
  assert.equal(article.published, true);
  assert.equal(article.draft, false);
  assert.doesNotMatch(copy, /78%|1000\+|1,000\+|cost reduction/i);
  assert.match(article.content.en, /HLS is useful when the product requirement is recorded or processed material available after the session/i);
  assert.match(article.content.en, /not a substitute for a participant who needs to join the class now/i);
  assert.match(article.content.fa, /بازپخش با تأخیر/);

  const image = fs.readFileSync(path.join(root, 'public/blog/og/hybrid-room-scalability-nats-livekit.png'));
  assert.deepEqual(image.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);

  const page = fs.readFileSync(path.join(root, 'app/[locale]/blog/[slug]/page.js'), 'utf8');
  assert.equal((page.match(/width: 1200, height: 630/g) || []).length, 2);
});

test('published copy excludes unsupported case-study claims', () => {
  const published = fs.readdirSync(blogsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(blogsDir, file), 'utf8')))
    .filter(blog => blog.published !== false && !blog.draft)
    .map(blog => JSON.stringify(blog))
    .join('\n');
  assert.doesNotMatch(published, /10[,. ]?000 concurrent viewers|99\.99+% uptime|€55[,.]?000|4 ms per sensor|sub-1 ms OTA|78%|verified 78|EU-scale education platforms|1,000\+ concurrent-student workload/i);
});

test('public profile copy uses canonical credentials and scale claims', () => {
  const files = ['messages/en.json', 'messages/fa.json', 'utils/data/experience.js', 'app/components/homepage/hero-section/index.jsx'];
  const copy = files.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert.doesNotMatch(copy, /\$2M|99\.999%|78%|۷۸٪|M\.Sc\. in System Design|کارشناسی ارشد طراحی سیستم/i);
  assert.match(copy, /M\.Sc\. Computer Science|M\.Sc\. in Computer Science/);
});
