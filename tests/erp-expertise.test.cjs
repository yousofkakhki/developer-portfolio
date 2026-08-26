const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const messages = locale => JSON.parse(read(`messages/${locale}.json`));

test('ERP facts identify Holoo, Odoo Enterprise, three-month delivery, calendars, and CRM addon work', () => {
  const data = read('utils/data/erp-expertise.js');

  assert.match(data, /company:\s*['"]Holoo Corp['"]/);
  assert.match(data, /product:\s*['"]Odoo Enterprise['"]/);
  assert.match(data, /deliveryWindowMonths:\s*3/);
  for (const capability of ['selfHostedOdoo', 'calendarLocalization', 'crmAddon']) {
    assert.match(data, new RegExp(`['"]${capability}['"]`));
  }
});

test('ERP copy is bilingual and frames three months as delivery rather than total experience', () => {
  const en = messages('en').erpExpertise;
  const fa = messages('fa').erpExpertise;

  assert.equal(en.title, 'ERP & Odoo Expertise');
  assert.match(en.deliveryBadge, /3-month focused delivery.*Holoo Corp/i);
  assert.match(en.intro, /Odoo Enterprise/i);
  assert.match(en.capabilities.selfHostedOdoo.description, /self-hosted/i);
  assert.match(en.capabilities.calendarLocalization.description, /Persian\/Jalali.*Hijri/i);
  assert.match(en.capabilities.crmAddon.description, /further developed and customized.*CRM addons.*Odoo CRM team at Holoo Corp/i);
  assert.doesNotMatch(JSON.stringify(en), /three months of ERP (experience|expertise)/i);

  assert.match(fa.deliveryBadge, /سه‌ماهه.*هلو/);
  assert.match(fa.intro, /Odoo Enterprise/);
  assert.match(fa.capabilities.selfHostedOdoo.description, /خودمیزبان/);
  assert.match(fa.capabilities.calendarLocalization.description, /فارسی.*هجری/);
  assert.match(fa.capabilities.crmAddon.description, /توسعه.*سفارشی‌سازی.*افزونه‌های CRM.*تیم (?:Odoo )?CRM.*هلو/);
});

test('homepage keeps ERP semantic and below the primary evidence narrative', () => {
  const page = read('app/[locale]/page.js');
  const section = read('app/components/homepage/erp-expertise/index.jsx');

  assert.match(page, /import ERPExpertise/);
  const orderedSections = [
    '<HeroSection />',
    '<Projects />',
    '<Experience />',
    '<Blog blogs={blogs} />',
    '<AboutSection />',
    '<Skills />',
    '<ERPExpertise />',
    '<Education />',
    '<EngagementCta />',
    '<ContactSection />',
  ];
  for (let index = 1; index < orderedSections.length; index += 1) {
    assert.ok(page.indexOf(orderedSections[index - 1]) < page.indexOf(orderedSections[index]));
  }
  assert.match(section, /<section[^>]+id="erp-expertise"[^>]+aria-labelledby="erp-expertise-heading"/);
  assert.match(section, /<h2 id="erp-expertise-heading"/);
  assert.match(section, /<ul/);
  assert.match(section, /<li/);
  assert.doesNotMatch(section, /capabilityIndexes/);
  assert.match(section, /erpExpertise\.capabilities\.map/);
});

test('ERP remains discoverable without competing with the primary work navigation', () => {
  const navbar = read('app/components/navbar.jsx');
  const skills = read('app/components/homepage/skills/index.jsx');
  const work = read('app/[locale]/work-with-me/page.js');

  assert.match(navbar, /\/projects/);
  assert.doesNotMatch(navbar, /#erp-expertise/);
  assert.doesNotMatch(navbar, /['"]erp-expertise['"]/);
  assert.match(skills, /careerFacts\.technologyGroups\.map/);
  assert.doesNotMatch(skills, /Odoo Enterprise|Custom CRM Addons/);
  assert.match(work, /ERP and business systems/);
  assert.match(work, /Odoo Enterprise/);
  assert.match(work, /Holoo Corp/);
});

test('Capitalino experience no longer claims the Holoo ERP delivery', () => {
  for (const locale of ['en', 'fa']) {
    const capitalino = messages(locale).experiences['2'];
    assert.doesNotMatch(capitalino.tech, /Odoo|ERP/i);
    assert.doesNotMatch(capitalino.description.join(' '), /Odoo|ERP/i);
  }

  const legacy = read('utils/data/experience.js');
  const capitalinoBlock = legacy.match(/company: ["']Capitalino["'][\s\S]*?\n  \},/)?.[0] || '';
  assert.doesNotMatch(capitalinoBlock, /Odoo|ERP/);
});
