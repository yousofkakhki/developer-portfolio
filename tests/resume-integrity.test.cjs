const test = require('node:test');
const assert = require('node:assert/strict');
const { run } = require('../scripts/resume-check.cjs');

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
