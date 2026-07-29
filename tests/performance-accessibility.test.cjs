const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('LCP avatar is server rendered, right-sized, and high priority', () => {
  const source = read('app/components/homepage/hero-section/index.jsx');
  assert.doesNotMatch(source, /["']use client["']/);
  assert.match(source, /getTranslations/);
  assert.match(source, /fetchPriority="high"/);
  assert.match(source, /sizes=/);
  assert.match(source, /avatar-512\.webp/);
});

test('global layout does not ship Toastify', () => {
  const source = read('app/[locale]/layout.js');
  assert.doesNotMatch(source, /react-toastify|ToastContainer/);
});

test('contact uses native fetch and accessible inline status', () => {
  const source = read('app/components/homepage/contact/index.jsx');
  assert.doesNotMatch(source, /axios|react-toastify|toast\./);
  assert.match(source, /fetch\(['"]\/api\/contact/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-label="GitHub profile"/);
  assert.match(source, /aria-label="LinkedIn profile"/);
});

test('icon controls and visible abbreviations have accessible names', () => {
  const scroll = read('app/components/helper/scroll-to-top.jsx');
  const nav = read('app/components/navbar.jsx');
  const switcher = read('app/components/language-switcher.jsx');
  assert.match(scroll, /aria-label="Scroll to top"/);
  assert.match(nav, /aria-label="YK — Home"/);
  assert.match(switcher, /aria-label="EN — English"/);
  assert.match(switcher, /aria-label="FA — فارسی"/);
});

test('footer is server rendered', () => {
  const footer = read('app/components/footer.jsx');
  assert.doesNotMatch(footer, /use client/);
  assert.match(footer, /getTranslations/);
});

test('layout self-hosts fonts without render-blocking Google CSS', () => {
  const layout = read('app/[locale]/layout.js');
  assert.doesNotMatch(layout, /fonts\.googleapis\.com/);
  assert.match(layout, /Vazirmatn/);
});

test('homepage secondary text meets contrast requirements', () => {
  const files = [
    'app/components/homepage/experience/index.jsx',
    'app/components/homepage/education/index.jsx',
    'app/components/homepage/skills/index.jsx',
    'app/components/homepage/projects/project-card.jsx',
    'app/components/homepage/testimonials/index.jsx',
    'app/components/homepage/blog/index.jsx',
    'app/components/homepage/blog/blog-card.jsx',
    'app/components/homepage/authority-bar/index.jsx',
  ];
  const copy = files.map(read).join('\n');
  assert.doesNotMatch(copy, /text-slate-500/);
});
