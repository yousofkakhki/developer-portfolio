const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { run } = require('../scripts/resume-check.cjs');

const root = path.resolve(__dirname, '..');

test('stable résumé is one page and ATS text matches canonical facts', () => {
  assert.equal(run(), 0);
});

test('legacy résumé routes are declared as permanent redirects to the stable URL', async () => {
  const manifest = require('../utils/data/resume-manifest.cjs');
  const nextConfig = require('../next.config.js');
  const redirects = await nextConfig.redirects();

  for (const source of manifest.legacyUrls) {
    assert.ok(redirects.some(redirect => (
      redirect.source === source
      && redirect.destination === manifest.publicUrl
      && redirect.permanent === true
    )), `missing legacy résumé redirect: ${source}`);
  }
});

test('résumé generation and extraction support an isolated validation artifact', () => {
  assert.match(fs.readFileSync(path.join(root, 'scripts/generate-resume.cjs'), 'utf8'), /RESUME_OUTPUT_PATH/);
  assert.match(fs.readFileSync(path.join(root, 'scripts/resume-check.cjs'), 'utf8'), /RESUME_PATH/);
});
