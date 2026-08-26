const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('technology, service, project, and profile collections use semantic lists', () => {
  const sources = {
    skills: read('app/components/homepage/skills/index.jsx'),
    experience: read('app/components/homepage/experience/index.jsx'),
    projectIndex: read('app/[locale]/projects/page.js'),
    projectDetail: read('app/[locale]/projects/[slug]/page.js'),
    work: read('app/[locale]/work-with-me/page.js'),
    footer: read('app/components/footer.jsx'),
    contact: read('app/components/homepage/contact/index.jsx'),
  };

  assert.match(sources.skills, /<ul className="space-y-8">/);
  assert.match(sources.skills, /<ul className="flex flex-wrap gap-2"/);
  assert.match(sources.experience, /<ul className="flex flex-wrap gap-2"/);
  assert.match(sources.projectIndex, /brand-project-index__technologies/);
  assert.match(sources.projectDetail, /<ul aria-label=\{t\('technology'\)\}>/);
  assert.match(sources.work, /<ul className="brand-evidence-sheet">/);
  assert.match(sources.footer, /<ul className="flex flex-wrap items-center gap-2"/);
  assert.match(sources.contact, /<ul className="flex flex-wrap items-center gap-3">/);
});

test('ornamental section counters and duplicate method numbering are absent', () => {
  const styles = read('app/css/globals.scss');
  const work = read('app/[locale]/work-with-me/page.js');

  assert.doesNotMatch(styles, /counter-(?:reset|increment):\s*system-section/);
  assert.doesNotMatch(styles, /content:\s*"0"\s*counter\(system-section\)/);
  assert.doesNotMatch(work, /Method \/ 01|روش همکاری \/ ۰۱/);
  assert.equal((work.match(/\{text\.methodLabel\}/g) || []).length, 1);
});
