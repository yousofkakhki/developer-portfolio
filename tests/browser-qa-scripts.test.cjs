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
  assert.match(accessibility, /resolveBrowserExecutable/);
});
