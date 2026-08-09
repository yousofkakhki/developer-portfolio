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

test('3D avatar face progressively enhances the portrait after page load', () => {
  const hero = read('app/components/homepage/hero-section/index.jsx');
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');
  const canvas = read('app/components/homepage/hero-section/avatar-face-canvas.jsx');
  const securityHeaders = read('middleware-security.js');

  assert.match(hero, /AvatarFaceOverlay/);
  assert.match(hero, /avatar-512\.webp/);
  assert.match(overlay, /window\.addEventListener\(['"]load['"]/);
  assert.match(overlay, /requestIdleCallback/);
  assert.match(overlay, /hardFallbackTimer/);
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
  assert.match(canvas, /const FACE_TRANSLATE_X = -5\.5;/);
  assert.match(canvas, /const FACE_TRANSLATE_Y = 10\.5;/);
  assert.match(
    canvas,
    /translate\(\$\{FACE_TRANSLATE_X\}px, \$\{FACE_TRANSLATE_Y\}px\) scaleX\(1\.28\)/,
  );
  assert.match(canvas, /powerPreference: 'high-performance'/);
  assert.match(canvas, /const FACE_SUPERSAMPLE = 1\.5;/);
  assert.match(canvas, /const FACE_MAX_PIXEL_RATIO = 3;/);
  assert.match(
    canvas,
    /Math\.min\(\(window\.devicePixelRatio \|\| 1\) \* FACE_SUPERSAMPLE, FACE_MAX_PIXEL_RATIO\)/,
  );
  assert.match(canvas, /polygon\(0 0, 100% 0, 100% 58%/);
  assert.match(canvas, /parser\.associations\.get\(object\)/);
  assert.match(canvas, /object\.visible = faceMeshIndexes\.has\(meshIndex\)/);
  assert.match(overlay, /top-\[3\.5%\]/);
  assert.match(canvas, /headPosition\.y \+ 0\.05/);
  assert.match(canvas, /headPosition\.y \+ 0\.04/);
  assert.match(canvas, /headPosition\.z \+ 0\.72/);
  assert.match(canvas, /kakhki-robot\.vrm/);
  assert.match(canvas, /ResizeObserver/);
  assert.match(canvas, /readPixels/);
  assert.match(canvas, /VRMUtils\.deepDispose/);
  assert.doesNotMatch(canvas, /VRMUtils\.(removeUnnecessaryVertices|combineSkeletons)/);
  assert.match(securityHeaders, /connect-src[^"\n]*blob:/);
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
