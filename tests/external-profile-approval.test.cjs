const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const { externalProfiles, getApprovedGlobalProfiles } = require('../utils/data/external-profiles.cjs');

test('only owner-approved external identities appear on global brand surfaces', () => {
  assert.equal(externalProfiles.github.approvedForGlobalBranding, false);
  assert.equal(externalProfiles.linkedIn.approvedForGlobalBranding, true);
  assert.deepEqual(getApprovedGlobalProfiles().map(profile => profile.id), ['linkedin']);

  for (const file of [
    'app/components/homepage/hero-section/index.jsx',
    'app/components/homepage/contact/index.jsx',
    'app/components/footer.jsx',
    'app/components/structured-data.jsx',
  ]) {
    const source = read(file);
    assert.match(source, /getApprovedGlobalProfiles/);
    assert.doesNotMatch(source, /personalData\.github/);
  }

  const schema = read('app/components/structured-data.jsx');
  assert.match(schema, /sameAs:\s*getApprovedGlobalProfiles\(\)\.map/);
  assert.doesNotMatch(schema, /personalData\.github|externalProfiles\.github\.url/);
});

test('global profile links are semantic and visibly named', () => {
  const footer = read('app/components/footer.jsx');
  const contact = read('app/components/homepage/contact/index.jsx');
  const hero = read('app/components/homepage/hero-section/index.jsx');

  assert.match(footer, /<ul[^>]*profileLinks/);
  assert.match(footer, /<span>\{tFooter\(`\$\{profile\.id\}Profile`\)\}<\/span>/);
  assert.match(contact, /<ul className="flex flex-wrap items-center gap-3">/);
  assert.match(contact, /<span>\{t\(`\$\{profile\.id\}Profile`\)\}<\/span>/);
  assert.match(hero, /<ul className="hero-socials/);
});
