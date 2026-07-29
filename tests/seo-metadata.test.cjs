const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('layout delegates canonical and hreflang metadata to individual routes', () => {
  const source = read('app/[locale]/layout.js');
  assert.doesNotMatch(source, /<link rel="canonical"/);
  assert.doesNotMatch(source, /hreflang=/);
  assert.doesNotMatch(source, /https:\/\/kakhki\.ir/);
});

test('article metadata is self-canonical and does not duplicate the title template', () => {
  const source = read('app/[locale]/blog/[slug]/page.js');
  assert.match(source, /canonical:.*\/blog\/\$\{slug\}/);
  assert.match(source, /languages[,|:]/);
  assert.doesNotMatch(source, /title: `\$\{blog\.title\} \| Yousef Kakhki`/);
});

test('sitemap includes only complete article locales with hreflang alternates', () => {
  const source = read('app/sitemap.js');
  assert.match(source, /getAvailableBlogLocales/);
  assert.match(source, /alternates:/);
  assert.doesNotMatch(source, /locales\.map\(locale => \(\{/);
});

test('content loader excludes explicitly unpublished articles', () => {
  const source = read('utils/data/local-blogs.js');
  assert.match(source, /published\s*!==\s*false/);
});

test('robots points crawlers at the canonical domain without blocking Next assets', () => {
  const robots = read('public/robots.txt');
  assert.match(robots, /Sitemap: https:\/\/kakhki\.me\/sitemap\.xml/);
  assert.doesNotMatch(robots, /kakhki\.ir/);
  assert.doesNotMatch(robots, /Disallow: \/_next\//);
  assert.doesNotMatch(robots, /Crawl-delay:/);
});
