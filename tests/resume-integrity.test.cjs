const test = require('node:test');
const assert = require('node:assert/strict');
const { run } = require('../scripts/resume-check.cjs');

test('stable résumé is two pages and ATS text extraction is intact', () => {
  assert.equal(run(), 0);
});
