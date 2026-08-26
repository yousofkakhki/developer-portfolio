const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const messages = (locale) => JSON.parse(read(`messages/${locale}.json`));

test('primary navigation is outside the main landmark and skip target is focusable', () => {
  const layout = read('app/[locale]/layout.js');
  assert.ok(layout.indexOf('<Navbar />') < layout.indexOf('<main'));
  assert.match(layout, /tabIndex=\{-1\}/);
});

test('skip-link and voice-state announcements are localized in every supported language', () => {
  const layout = read('app/[locale]/layout.js');
  const avatar = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');
  const voiceStates = ['starting', 'requestingMic', 'listening', 'processing', 'playing', 'speaking', 'paused', 'ready', 'blocked', 'error'];

  assert.match(layout, /aria-label=\{skipToMain\}/);
  assert.ok(avatar.includes("useTranslations('accessibility')"));
  assert.ok(avatar.includes("t('voiceState'"));
  for (const locale of ['en', 'fa']) {
    const accessibility = messages(locale).accessibility;
    assert.ok(accessibility.skipToMain);
    assert.ok(accessibility.voiceState);
    for (const state of voiceStates) assert.ok(accessibility.voiceStates[state]);
  }
});

test('section navigation lets cross-route links navigate normally and mobile menu is wired accessibly', () => {
  const navbar = read('app/components/navbar.jsx');
  assert.match(navbar, /targetUrl\.pathname !== window\.location\.pathname/);
  assert.match(navbar, /aria-controls="mobile-navigation"/);
  assert.match(navbar, /id="mobile-navigation"/);
  assert.match(navbar, /min-h-\[44px\] min-w-\[44px\]/);
  assert.equal((navbar.match(/<LanguageSwitcher \/>/g) || []).length, 1);
  assert.match(navbar, /prefers-reduced-motion: reduce/);
});

test('public hero, navigation, blog, contact, and footer copy is localized in both languages', () => {
  for (const locale of ['en', 'fa']) {
    const message = messages(locale);
    assert.ok(message.hero.eyebrow);
    assert.ok(message.hero.metricConcurrentUsers);
    assert.ok(message.hero.viewArchitecture);
    assert.ok(message.nav.workWithMe);
    assert.ok(message.about.paragraph1);
    assert.ok(message.skills.categories.languages);
    assert.ok(message.blog.viewAllPosts);
    assert.ok(message.contact.directContact);
    assert.ok(message.footer.resumePdf);
  }
});

test('language controls, form feedback, and motion preferences meet audited interaction requirements', () => {
  const switcher = read('app/components/language-switcher.jsx');
  const contact = read('app/components/homepage/contact/index.jsx');
  const styles = read('app/css/globals.scss');
  assert.match(switcher, /min-h-\[44px\] min-w-\[44px\]/);
  assert.match(switcher, /data-language-switcher/);
  assert.match(switcher, /href=\{englishTarget\.href\}/);
  assert.match(switcher, /href=\{persianTarget\.href\}/);
  assert.match(contact, /aria-invalid/);
  assert.match(contact, /aria-describedby/);
  assert.match(contact, /role="alert"/);
  assert.match(contact, /const tCommon = useTranslations\('common'\)/);
  assert.doesNotMatch(contact, /t\('common\.opensInNewTab'\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test('project cards do not expose an unapproved placeholder GitHub destination', () => {
  const catalog = read('utils/data/project-catalog.js');
  const card = read('app/components/homepage/projects/project-card.jsx');
  assert.doesNotMatch(catalog, /github\.com/i);
  assert.doesNotMatch(card, /project\.code|viewCode/);
});
