const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { renderMarkdown } = require('../utils/render-markdown.cjs');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const caseStudyPath = 'content/blogs/honar-amoozesh-5000-concurrent-webrtc-case-study.json';

test('first-party analytics stores only allowlisted non-personal conversion data', () => {
  const route = read('app/api/analytics/route.js');
  assert.match(route, /ALLOWED_EVENTS/);
  assert.match(route, /appendFile/);
  assert.match(route, /ANALYTICS_DIR/);
  assert.doesNotMatch(route, /x-forwarded-for|x-real-ip|user-agent|cookie/i);
  assert.match(read('docker-compose.yml'), /\.\/data\/analytics:\/app\/data\/analytics/);
  assert.match(read('.gitignore'), /data\/analytics\/\*\.jsonl/);
});

test('conversion actions emit first-party measurement events', () => {
  const tracker = read('app/components/analytics/conversion-link.jsx');
  assert.match(tracker, /sendBeacon/);
  assert.match(tracker, /dataLayer/);
  assert.match(read('app/components/homepage/contact/index.jsx'), /contact_submit/);
  assert.match(read('app/components/homepage/hero-section/index.jsx'), /resume_download/);
  assert.match(read('app/[locale]/work-with-me/page.js'), /work_with_me_view/);
});

test('work-with-me route is bilingual, canonical, and included in sitemap', () => {
  const page = read('app/[locale]/work-with-me/page.js');
  assert.match(page, /generateMetadata/);
  assert.match(page, /senior individual-contributor/i);
  assert.match(page, /فرصت‌های مهندسی/);
  assert.match(page, /ProfilePage/);
  assert.match(read('app/sitemap.js'), /work-with-me/);
  assert.match(read('app/components/navbar.jsx'), /work-with-me/);
});

test('flagship WebRTC case study is published and constrained to verified facts', () => {
  const article = JSON.parse(read(caseStudyPath));
  assert.equal(article.published, true);
  assert.equal(article.draft, false);
  assert.match(article.title.en, /5,000 Concurrent Users/);
  assert.match(article.content.en, /HonarAmoozesh/);
  assert.match(article.content.en, /LiveKit/);
  assert.match(article.content.en, /NATS JetStream/);
  assert.match(article.content.en, /HLS/);
  assert.match(article.content.en, /does not mean 5,000 simultaneous publishers/i);
  assert.ok(article.tags.includes('webrtc'));
  assert.equal(article.coverImage, '/blog/og/honar-amoozesh-5000-concurrent-webrtc-case-study.png');
  assert.doesNotMatch(article.content.en, /78%|99\.99|sub-100|€|\$[0-9]|Frankfurt production/i);
});

test('articles offer a measured recruiter conversion path', () => {
  const articlePage = read('app/[locale]/blog/[slug]/page.js');
  assert.match(articlePage, /article_work_with_me/);
  assert.match(articlePage, /work-with-me/);
});

test('local Markdown renders semantic headings and grouped lists', () => {
  const html = renderMarkdown('## Decision\n\n- WebRTC for participants\n- HLS for viewers\n\n1. authorize\n2. connect');
  assert.match(html, /<h2>Decision<\/h2>/);
  assert.match(html, /<ul>\s*<li>WebRTC for participants<\/li>\s*<li>HLS for viewers<\/li>\s*<\/ul>/);
  assert.match(html, /<ol>\s*<li>authorize<\/li>\s*<li>connect<\/li>\s*<\/ol>/);
  assert.doesNotMatch(html, /<br\s*\/?>/);
  const persianList = renderMarkdown('۱. اول\n۲. دوم');
  assert.match(persianList, /<ol>\s*<li>اول<\/li>\s*<li>دوم<\/li>\s*<\/ol>/);
  assert.match(read('app/[locale]/blog/[slug]/page.js'), /className="blog-content"/);
  assert.match(read('app/css/globals.scss'), /\.blog-content[\s\S]*list-style: disc outside/);
});
