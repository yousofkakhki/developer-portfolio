const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('the systems-documentation identity has a restrained dark token system', () => {
  const css = read('app/css/globals.scss');

  assert.match(css, /--field-paper:\s*#08111f/i);
  assert.match(css, /--carbon:\s*#f3f7fb/i);
  assert.match(css, /--deep-petrol:\s*#22d3ee/i);
  assert.match(css, /--signal-copper:\s*#f59e0b/i);
  assert.match(css, /--night:\s*#08111f/i);
  assert.match(css, /--space-section:\s*clamp\(/i);
  assert.match(css, /--radius-panel:\s*0\.25rem/i);
  assert.match(css, /\.site-body::before/);
  assert.match(css, /\.brand-home/);
  assert.match(css, /\.brand-section/);
  assert.match(css, /\.brand-panel/);
  assert.match(css, /\.brand-chip/);
  assert.match(css, /\.brand-button--primary/);
  assert.match(css, /section:not\(#hero\)[\s\S]*?counter-increment/i);
});

test('the shared shell exposes the branded navigation, page canvas, and footer', () => {
  const layout = read('app/[locale]/layout.js');
  const page = read('app/[locale]/page.js');
  const nav = read('app/components/navbar.jsx');
  const footer = read('app/components/footer.jsx');

  assert.match(layout, /site-body/);
  assert.match(layout, /site-main/);
  assert.match(page, /brand-home/);
  assert.match(nav, /brand-nav/);
  assert.match(nav, /brand-nav__inner/);
  assert.match(nav, /brand-nav__link/);
  assert.match(footer, /brand-footer/);
  assert.match(footer, /brand-footer__statement/);
});

test('shared controls and identity assets use the Field Systems language at every surface', () => {
  const nav = read('app/components/navbar.jsx');
  const switcher = read('app/components/language-switcher.jsx');
  const footer = read('app/components/footer.jsx');
  const scroll = read('app/components/helper/scroll-to-top.jsx');
  const layout = read('app/[locale]/layout.js');
  const assets = [
    'public/brand/yk-micro-icon.svg',
    'public/brand/favicon.svg',
    'public/brand/app-icon.svg',
    'public/brand/social-avatar.svg',
  ];

  assert.match(nav, /hidden lg:flex/);
  assert.match(nav, /lg:hidden/);
  assert.doesNotMatch(nav, /hidden md:flex/);
  assert.match(switcher, />\s*فارسی\s*</);
  assert.match(footer, /getTranslations\('hero'\)/);
  assert.doesNotMatch(footer, /Signal · Structure · Scale/);
  assert.match(scroll, /brand-scroll-top/);
  assert.doesNotMatch(scroll, /rounded-full|backdrop-blur|shadow-lg/);
  assert.match(layout, /const ogImagePath = locale === 'fa' \? '\/og-fa\.png' : '\/og-en\.png';/);
  assert.match(layout, /`\$\{siteUrl\}\$\{ogImagePath\}`/);

  for (const asset of assets) {
    const svg = read(asset);
    assert.match(svg, /#08111f/i, `${asset} must use navy`);
    assert.match(svg, /#f3f7fb/i, `${asset} must use primary text`);
    assert.match(svg, /#22d3ee/i, `${asset} must use cyan`);
    assert.match(svg, /#f59e0b/i, `${asset} must use amber`);
  }
});

test('the active Field Systems cascade is explicit, motion-safe, and free of neon project visuals', () => {
  const css = read('app/css/globals.scss');
  const layout = read('app/[locale]/layout.js');
  const hero = read('app/components/homepage/hero-section/index.jsx');
  const projectVisual = read('app/components/homepage/projects/project-visual.jsx');
  const interactivePanels = [
    'app/components/homepage/projects/project-card.jsx',
    'app/components/homepage/blog/blog-card.jsx',
  ];
  const titledSections = [
    'app/components/homepage/about/index.jsx',
    'app/components/homepage/blog/index.jsx',
    'app/components/homepage/contact/index.jsx',
    'app/components/homepage/education/index.jsx',
    'app/components/homepage/erp-expertise/index.jsx',
    'app/components/homepage/experience/index.jsx',
    'app/components/homepage/projects/index.jsx',
    'app/components/homepage/skills/index.jsx',
    'app/components/homepage/testimonials/index.jsx',
  ];

  assert.match(layout, /\$\{manrope\.variable\}/);
  assert.match(layout, /\$\{vazirmatn\.variable\}/);
  assert.doesNotMatch(layout, /card\.scss/);
  assert.doesNotMatch(layout, /className="site-main[^"]*text-white/);

  assert.doesNotMatch(css, /h2:first-of-type/);
  assert.match(css, /\.brand-section__title/);
  assert.doesNotMatch(css, /\.brand-panel:is\(:hover, :focus-within\)/);
  assert.match(css, /\.brand-panel--interactive:is\(:hover, :focus-within\)/);
  assert.doesNotMatch(css, /\.hero-actions\s*\{/);
  assert.match(css, /\.hero-layout\s*\{[^}]*flex-direction:\s*column;/);
  assert.doesNotMatch(css, /\.hero-layout\s*\{[^}]*display:\s*contents/);
  assert.match(css, /html\[dir="rtl"\] \.hero-title\s*\{[\s\S]*?letter-spacing:\s*0;/);
  assert.match(css, /grid-template-areas:[\s\S]*?"summary portrait"[\s\S]*?"trace portrait"[\s\S]*?"actions portrait"[\s\S]*?"proof portrait"[\s\S]*?"credentials portrait"/);
  const mobileRegionOrder = [
    'hero-identity',
    'hero-action-row',
    'hero-portrait-column',
    'hero-trace',
    'hero-proof-grid',
    'hero-credentials',
  ].map(className => hero.indexOf(className));
  for (let index = 1; index < mobileRegionOrder.length; index += 1) {
    assert.ok(mobileRegionOrder[index] > mobileRegionOrder[index - 1], 'hero DOM order must be summary, actions, portrait, trace, proof, credentials');
  }
  assert.ok(
    css.lastIndexOf('@media (min-width: 768px) and (max-height: 700px)') > css.indexOf('Systems documentation'),
    'short-height hero rules must remain in the final cascade',
  );

  for (const file of titledSections) {
    assert.match(read(file), /<h2[^>]*brand-section__title/, `${file} must own its heading rhythm explicitly`);
  }
  for (const file of interactivePanels) {
    assert.match(read(file), /brand-panel brand-panel--interactive/, `${file} must opt into panel motion`);
  }

  assert.match(projectVisual, /#22D3EE/);
  assert.match(projectVisual, /#08111F/);
  assert.match(projectVisual, /#F59E0B/);
});

test('the hero uses human-first identity typography and proof-strip composition', () => {
  const hero = read('app/components/homepage/hero-section/index.jsx');

  assert.match(hero, /hero-identity/);
  assert.match(hero, /hero-title/);
  assert.match(hero, /hero-designation/);
  assert.match(hero, /hero-proof-grid/);
  assert.match(hero, /hero-proof/);
  assert.match(hero, /hero-trace/);
  assert.match(hero, /hero-trace__step/);
  assert.match(hero, /hero-portrait-frame/);
  assert.match(hero, /hero-portrait-meta/);
  assert.doesNotMatch(hero, /yk-horizontal-lockup\.svg/);
});

test('secondary routes use the shared editorial field-system vocabulary', () => {
  const routes = [
    'app/[locale]/work-with-me/page.js',
    'app/[locale]/projects/[slug]/page.js',
    'app/[locale]/blog/page.js',
    'app/[locale]/blog/[slug]/page.js',
    'app/[locale]/blog/pillar/[pillar]/page.js',
  ];

  for (const route of routes) {
    assert.match(read(route), /brand-route/, `${route} must use the shared route shell`);
  }

  assert.match(read('app/[locale]/work-with-me/page.js'), /brand-evidence-sheet/);
  assert.match(read('app/[locale]/projects/[slug]/page.js'), /brand-case-brief/);
  assert.match(read('app/[locale]/blog/[slug]/page.js'), /brand-article/);
  assert.match(read('app/[locale]/blog/blog-page-client.jsx'), /brand-publication-index/);
});

test('high-value sections use the shared brand section and panel vocabulary', () => {
  const files = [
    'app/components/homepage/about/index.jsx',
    'app/components/homepage/experience/index.jsx',
    'app/components/homepage/erp-expertise/index.jsx',
    'app/components/homepage/skills/index.jsx',
    'app/components/homepage/projects/index.jsx',
    'app/components/homepage/testimonials/index.jsx',
    'app/components/homepage/education/index.jsx',
    'app/components/homepage/blog/index.jsx',
    'app/components/homepage/contact/index.jsx',
  ];

  for (const file of files) {
    assert.match(read(file), /brand-section/, `${file} must opt into the shared section rhythm`);
  }

  assert.match(read('app/components/homepage/experience/index.jsx'), /brand-panel/);
  assert.match(read('app/components/homepage/projects/project-card.jsx'), /brand-panel/);
  assert.match(read('app/components/homepage/contact/index.jsx'), /brand-field/);
});

test('the floating scroll control never flashes over first-viewport content', () => {
  const scroll = read('app/components/helper/scroll-to-top.jsx');

  assert.match(scroll, /useState\(false\)/);
  assert.match(scroll, /handleScroll\(\);/);
  assert.match(scroll, /window\.innerHeight \* 0\.75/);
  assert.match(scroll, /min-h-\[44px\]/);
});

test('branding motion remains bounded for reduced-motion users', () => {
  const css = read('app/css/globals.scss');
  const reducedMotion = css.match(/@media \(prefers-reduced-motion: reduce\)[\s\S]*$/)?.[0] || '';

  assert.match(reducedMotion, /\.brand-home::before/);
  assert.match(reducedMotion, /animation:\s*none/i);
  assert.match(reducedMotion, /transition-duration:\s*0\.01ms/i);
});
