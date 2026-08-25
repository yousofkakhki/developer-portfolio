const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('the supplied professional portrait is the shared hero and profile image', () => {
  const hero = read('app/components/homepage/hero-section/index.jsx');
  const structuredData = read('app/components/structured-data.jsx');
  const asset = path.join(root, 'public/avatar-page-background.webp');

  assert.match(hero, /avatar-page-background\.webp/);
  assert.match(structuredData, /avatar-page-background\.webp/);
  assert.equal(fs.existsSync(asset), true);
  assert.ok(fs.statSync(asset).size > 50_000);
});
