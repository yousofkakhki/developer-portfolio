const test = require('node:test');
const assert = require('node:assert/strict');
const { run } = require('../scripts/content-integrity-check.cjs');

test('public content integrity rules pass', () => {
  assert.equal(run(), 0);
});
