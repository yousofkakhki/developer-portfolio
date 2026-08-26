const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('browser QA resolves an installed Chromium without pinning a machine-specific path', () => {
  const resolver = read('scripts/browser-executable.cjs');
  const viewport = read('scripts/viewport-check.cjs');
  const accessibility = read('scripts/accessibility-check.cjs');

  assert.match(resolver, /PUPPETEER_EXECUTABLE_PATH/);
  assert.match(resolver, /ms-playwright/);
  assert.doesNotMatch(resolver, /chromium-\d+/);
  assert.match(viewport, /resolveBrowserExecutable/);
  assert.match(viewport, /case-study-hologram-en-390[.]png/);
  assert.match(viewport, /article-honar-en-390[.]png/);
  assert.match(accessibility, /resolveBrowserExecutable/);
});

test('internal link QA crawls the sitemap, assets, Open Graph images, and stable résumé links', () => {
  const source = read('scripts/internal-link-check.cjs');

  assert.match(source, /sitemap[.]xml/);
  assert.match(source, /og-image/);
  assert.match(source, /stale_resume_link/);
  assert.match(source, /retired_recommendation_link/);
  assert.match(source, /response[.]status >= 400/);
});
