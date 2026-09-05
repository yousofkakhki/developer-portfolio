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
  assert.match(source, /avatar-page-background\.webp/);
});

test('3D avatar remains available only as an explicitly activated enhancement', () => {
  const hero = read('app/components/homepage/hero-section/index.jsx');
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');
  const canvas = read('app/components/homepage/hero-section/avatar-face-canvas.jsx');
  const securityHeaders = read('middleware-security.js');

  assert.match(hero, /AvatarFaceOverlay/);
  assert.match(hero, /avatar-page-background\.webp/);
  assert.match(overlay, /const startAvatarVisual = useCallback/);
  assert.match(overlay, /const startVoiceSession = useCallback\(\(\) => \{[\s\S]*startAvatarVisual\(\)/);
  assert.match(overlay, /onClick=\{startVoiceSession\}/);
  assert.doesNotMatch(overlay, /window\.addEventListener\(['"]load['"]|requestIdleCallback|hardFallbackTimer/);
  assert.match(overlay, /data-avatar-stage/);
  assert.match(overlay, /prefers-reduced-motion: reduce/);
  assert.match(overlay, /saveData/);
  assert.match(overlay, /import\(['"]\.\/avatar-face-canvas['"]\)/);
  assert.match(canvas, /FACE_MESH_NAMES/);
  assert.match(canvas, /HIDDEN_FACE_MATERIALS/);
  assert.match(canvas, /SPINE/);
  assert.match(canvas, /HEAD/);
  assert.match(canvas, /EYES\.001/);
  assert.doesNotMatch(canvas, /FACE_MESH_NAMES[^\n]*NECK/);
  assert.doesNotMatch(overlay, /bg-slate-900/);
  assert.doesNotMatch(overlay, /indicatorState\.dotClass/);
  assert.match(overlay, /data-voice-state/);
  assert.match(canvas, /const FACE_TRANSLATE_X = -3\.5;/);
  assert.match(canvas, /const FACE_TRANSLATE_Y = 16\.5;/);
  assert.match(
    canvas,
    /translate\(\$\{FACE_TRANSLATE_X\}px, \$\{FACE_TRANSLATE_Y\}px\) scaleX\(1\.28\)/,
  );
  assert.match(canvas, /powerPreference: 'high-performance'/);
  assert.match(canvas, /const FACE_SUPERSAMPLE = 2;/);
  assert.match(canvas, /const FACE_MAX_PIXEL_RATIO = 3;/);
  assert.match(
    canvas,
    /Math\.min\(\(window\.devicePixelRatio \|\| 1\) \* FACE_SUPERSAMPLE, FACE_MAX_PIXEL_RATIO\)/,
  );
  assert.match(canvas, /polygon\(0 0, 100% 0, 100% 58%/);
  assert.match(canvas, /parser\.associations\.get\(object\)/);
  assert.match(canvas, /object\.visible = faceMeshIndexes\.has\(meshIndex\)/);
  assert.match(overlay, /left-\[27%\]/);
  assert.match(overlay, /top-\[7\.5%\]/);
  assert.match(overlay, /h-\[58%\]/);
  assert.match(overlay, /w-\[46%\]/);
  assert.match(canvas, /headPosition\.y \+ 0\.05/);
  assert.match(canvas, /headPosition\.y \+ 0\.04/);
  assert.match(canvas, /headPosition\.z \+ 0\.72/);
  assert.match(canvas, /kakhki-robot\.vrm/);
  assert.match(canvas, /ResizeObserver/);
  assert.match(canvas, /readPixels/);
  assert.match(canvas, /VRMUtils\.deepDispose/);
  assert.doesNotMatch(canvas, /VRMUtils\.(removeUnnecessaryVertices|combineSkeletons)/);
  assert.match(securityHeaders, /connect-src[^"\n]*blob:/);
  assert.match(securityHeaders, /microphone=\(self\)/);
  assert.ok(fs.existsSync(path.join(root, 'public/avatar/kakhki-robot.vrm')));
});

test('Three.js and VRM code stay in a post-load async chunk', () => {
  const nextConfig = read('next.config.js');
  assert.match(nextConfig, /name: ['"]avatar-vrm['"]/);
  assert.match(nextConfig, /chunks: ['"]async['"]/);
  assert.match(nextConfig, /three\|@pixiv/);
});

test('global layout does not ship Toastify', () => {
  const source = read('app/[locale]/layout.js');
  assert.doesNotMatch(source, /react-toastify|ToastContainer/);
});

test('contact uses native fetch and accessible inline status', () => {
  const source = read('app/components/homepage/contact/index.jsx');
  assert.doesNotMatch(source, /axios|react-toastify|toast\./);
  assert.match(source, /fetch\(['"]\/api\/contact/);
  assert.match(source, /role=\{status\.type === 'error' \? 'alert' : 'status'\}/);
  assert.match(source, /getApprovedGlobalProfiles/);
  assert.match(source, /<ul className="flex flex-wrap items-center gap-3">/);
  assert.match(source, /<span>\{t\(`\$\{profile\.id\}Profile`\)\}<\/span>/);
});

test('icon controls and visible abbreviations have accessible names', () => {
  const scroll = read('app/components/helper/scroll-to-top.jsx');
  const nav = read('app/components/navbar.jsx');
  const switcher = read('app/components/language-switcher.jsx');
  assert.match(scroll, /aria-label=\{t\('scrollToTop'\)\}/);
  assert.match(nav, /aria-label=\{t\('home'\)\}/);
  assert.match(switcher, /aria-label=\{englishTarget\.exact \? t\('englishLabel'\) : t\('englishIndexFallback'\)\}/);
  assert.match(switcher, /aria-label=\{persianTarget\.exact \? t\('persianLabel'\) : t\('persianIndexFallback'\)\}/);
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

test('official Field Systems brand assets and metadata are wired into the site', () => {
  const layout = read('app/[locale]/layout.js');
  const globals = read('app/css/globals.scss');
  const manifest = read('app/manifest.js');
  const navbar = read('app/components/navbar.jsx');

  assert.match(globals, /--field-paper:\s*#08111f/i);
  assert.match(globals, /--deep-petrol:\s*#22d3ee/i);
  assert.match(globals, /--signal-copper:\s*#f59e0b/i);
  assert.match(layout, /Manrope/);
  assert.match(layout, /IBM_Plex_Mono/);
  assert.match(layout, /\/brand\/favicon\.svg/);
  assert.match(manifest, /#08111f/i);
  assert.match(navbar, /\/brand\/yk-micro-icon\.svg/);
  assert.match(read('app/components/homepage/hero-section/index.jsx'), /hero-title/);
  assert.doesNotMatch(read('app/components/homepage/hero-section/index.jsx'), /\/brand\/yk-horizontal-lockup\.svg/);
  for (const asset of [
    'public/brand/yk-micro-icon.svg',
    'public/brand/app-icon.svg',
    'public/brand/favicon.svg',
    'app/icon.png',
    'app/apple-icon.png',
  ]) {
    assert.equal(fs.existsSync(path.join(root, asset)), true, `missing ${asset}`);
  }
  for (const asset of [
    'public/brand/yk-horizontal-lockup.svg',
    'public/og-default.png',
    'public/og-en.png',
    'public/og-fa.png',
  ]) {
    assert.equal(fs.existsSync(path.join(root, asset)), false, `${asset} must be replaced by active route assets`);
  }
  assert.equal(fs.existsSync(path.join(root, 'app/[locale]/opengraph-image.js')), true);
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
