const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('global schema uses a connected canonical graph', () => {
  const source = read('app/components/structured-data.jsx');
  assert.match(source, /'@graph'|"@graph"/);
  assert.match(source, /#person/);
  assert.match(source, /#website/);
  assert.doesNotMatch(source, /kakhki\.ir/);
});

test('article schema is BlogPosting with breadcrumbs and stable references', () => {
  const source = read('app/[locale]/blog/[slug]/page.js');
  assert.match(source, /BlogPosting/);
  assert.match(source, /BreadcrumbList/);
  assert.match(source, /mainEntityOfPage/);
  assert.match(source, /dateModified/);
  assert.match(source, /inLanguage/);
  assert.match(source, /#person/);
});

test('title template keeps branding compact', () => {
  const source = read('app/[locale]/layout.js');
  assert.match(source, /ownerName\s*=\s*localized\(careerFacts\.identity\.localizedName, locale\)/);
  assert.match(source, /template:\s*`%s \| \$\{ownerName\}`/);
  assert.doesNotMatch(source, /template:.*System Architect/);
});

test('metadata remains in head for all crawler user agents', () => {
  const source = read('next.config.js');
  assert.match(source, /htmlLimitedBots:\s*\/\.\*\//);
});

test('pillars expose only genuine English routes', () => {
  const pillar = read('app/[locale]/blog/pillar/[pillar]/page.js');
  const blog = read('app/[locale]/blog/page.js');
  assert.match(pillar, /locale:\s*'en'/);
  assert.doesNotMatch(pillar, /fa:\s*`\$\{siteUrl\}\/fa\/blog\/pillar/);
  assert.match(blog, /locale\s*===\s*['"]en['"]/);
});

test('sitemap contains pillars and stable static modification dates', () => {
  const source = read('app/sitemap.js');
  assert.match(source, /getActivePillarSlugs/);
  assert.match(source, /siteRouteManifest/);
  assert.match(source, /blog\/pillar/);
  assert.doesNotMatch(source, /lastModified:\s*new Date\(\)/);
});

test('only pillars backed by published articles are routed and linked', () => {
  const pillarPage = read('app/[locale]/blog/pillar/[pillar]/page.js');
  assert.match(read('utils/data/blog-pillars.js'), /getActivePillarSlugs/);
  assert.match(pillarPage, /getActivePillarSlugs/);
  assert.match(pillarPage, /getPillarForTags/);
  assert.match(read('app/[locale]/blog/page.js'), /getActivePillarSlugs/);
  assert.match(read('app/sitemap.js'), /getActivePillarSlugs/);
});
