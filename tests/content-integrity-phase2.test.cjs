const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const blogsDir = path.join(root, 'content/blogs');
const unsafeSlugs = [
  'getting-a-german-blue-card-without-a-degree-in-2026',
  'hybrid-sfumcu-webinar-architecture-for-10k-viewers',
  'idempotent-cryptofiat-gateway-in-frankfurt',
  'offlinefirst-pwa-web-sensors-sleep',
  'preemptrt-tuning-for-sub-second-ota-on-arm-edge-nodes',
  'sfu-first-webrtc-scaling-in-frankfurt-for-1k',
  'hybrid-room-scalability-nats-livekit',
];

test('unsupported case-study articles remain unpublished', () => {
  const bySlug = new Map(fs.readdirSync(blogsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(blogsDir, file), 'utf8')))
    .map(blog => [blog.slug, blog]));
  for (const slug of unsafeSlugs) {
    const blog = bySlug.get(slug);
    assert.ok(blog, `missing article ${slug}`);
    assert.equal(blog.published, false, slug);
  }
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
