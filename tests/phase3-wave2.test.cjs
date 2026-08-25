const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('blog index snippets match the currently published subject inventory', () => {
  const page = read('app/[locale]/blog/page.js');
  assert.match(page, /WebRTC, LiveKit, distributed backend architecture/);
  assert.match(page, /بک‌اند، سیستم‌های توزیع‌شده و WebRTC/);
  assert.doesNotMatch(page, /reliable fintech workflows|درگاه‌های پرداخت کریپتو|بهینه‌سازی کرنل لینوکس/);
});

test('Bing verification is optional, environment-controlled, and documented', () => {
  const layout = read('app/[locale]/layout.js');
  const example = read('.env.example');
  assert.match(layout, /NEXT_PUBLIC_BING_SITE_VERIFICATION/);
  assert.match(layout, /msvalidate\.01/);
  assert.match(example, /NEXT_PUBLIC_BING_SITE_VERIFICATION=/);
  assert.doesNotMatch(layout, /msvalidate\.01['"]\s*:\s*['"][A-Za-z0-9_-]{8,}/);
});

test('search-growth baseline maps every indexable route without fabricating metrics', () => {
  const baseline = read('docs/search-growth-baseline-2026-07-28.md');
  assert.match(baseline, /13 canonical URLs/);
  assert.match(baseline, /Unavailable, not zero/i);
  assert.match(baseline, /honar-amoozesh-5000-concurrent-webrtc-case-study/);
  assert.match(baseline, /building-bilingual-portfolio-nextjs/);
  assert.doesNotMatch(baseline, /Current clicks:\s*[1-9]|Current impressions:\s*[1-9]|Average position:\s*\d/);
});

test('SEO watchdog covers crawl, canonical, indexability, schema, redirects, and TLS', () => {
  const monitor = read('scripts/seo-health-check.cjs');
  assert.match(monitor, /sitemap\.xml/);
  assert.match(monitor, /canonical/i);
  assert.match(monitor, /noindex/i);
  assert.ok(monitor.includes('application\\/ld\\+json'));
  assert.match(monitor, /redirect/i);
  assert.match(monitor, /tls\.connect/);
  assert.match(monitor, /process\.stdout\.write/);
  assert.match(read('package.json'), /seo:health/);
});
