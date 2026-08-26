const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('hero portrait uses a page-background-matched asset with no visible edge rectangle', () => {
  const hero = read('app/components/homepage/hero-section/index.jsx');
  const compositor = read('scripts/create-page-background-avatar.py');
  const asset = path.join(root, 'public/avatar-page-background.webp');

  assert.match(hero, /avatar-page-background\.webp/);
  assert.match(hero, /hero-portrait/);
  assert.match(compositor, /PAGE_BACKGROUND = \(7, 16, 24\)/);
  assert.match(compositor, /Image\.composite\(page_background, image, mask\)/);
  assert.equal(fs.existsSync(asset), true, 'the composited portrait asset must be present');
});

test('hero avoids desktop vertical centering and exposes a short-viewport compaction contract', () => {
  const hero = read('app/components/homepage/hero-section/index.jsx');
  const globals = read('app/css/globals.scss');

  assert.match(hero, /hero-shell/);
  assert.match(hero, /hero-content/);
  assert.match(hero, /hero-action-row/);
  assert.doesNotMatch(hero, /min-h-screen/);
  assert.doesNotMatch(hero, /<section id="hero" className="[^"]*justify-center/);
  assert.match(hero, /hero-identity/);
  assert.match(globals, /grid-template-columns:\s*minmax\(0, 1\.42fr\)/);
  assert.match(globals, /\.hero-shell/);
  assert.match(globals, /\.hero-content/);
  assert.match(globals, /\.hero-action-row/);
  assert.match(globals, /max-height:\s*700px/);
});

test('AI head uses a calibrated whole-head host and beard-line attachment', () => {
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');
  const canvas = read('app/components/homepage/hero-section/avatar-face-canvas.jsx');

  assert.match(overlay, /left-\[27%\]/);
  assert.match(overlay, /top-\[7\.5%\]/);
  assert.match(overlay, /h-\[58%\]/);
  assert.match(overlay, /w-\[46%\]/);
  assert.match(canvas, /const FACE_TRANSLATE_X = -3\.5;/);
  assert.match(canvas, /const FACE_TRANSLATE_Y = 16\.5;/);
  assert.match(canvas, /translate\(\$\{FACE_TRANSLATE_X\}px, \$\{FACE_TRANSLATE_Y\}px\)/);
});

test('VRM head replacement remains passive while voice loads only after explicit activation', () => {
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');

  assert.match(overlay, /NEXT_PUBLIC_ENABLE_VRM_AVATAR/);
  assert.match(overlay, /const AVATAR_VISUAL_ENABLED = process\.env\.NEXT_PUBLIC_ENABLE_VRM_AVATAR !== 'false'/);
  const fallbackGuards = overlay.match(/!AVATAR_VISUAL_ENABLED \|\| reducedMotion \|\| saveData/g) || [];
  assert.equal(fallbackGuards.length, 2, 'both loading and transition effects must honor visual fallback');
  assert.match(overlay, /const startVoiceSession = useCallback/);
  assert.match(overlay, /onClick=\{startVoiceSession\}/);
  assert.match(overlay, /import\(['"]\.\/avatar-voice-session['"]\)/);
  assert.doesNotMatch(overlay, /const voiceSessionImport = import/);
  assert.doesNotMatch(overlay, /useEffect\(\(\) => \{\s*startVoiceSession\(\)/);
});

test('avatar publishes voice status only after activation and provides retry and stop controls', () => {
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');

  assert.match(overlay, /VOICE_STATUS_STYLES/);
  assert.match(overlay, /data-vad-indicator/);
  assert.match(overlay, /voiceActive && AvatarVoiceSession/);
  assert.match(overlay, /role="status"/);
  assert.match(overlay, /bg-emerald-400/);
  assert.match(overlay, /bg-rose-400/);
  assert.match(overlay, /voiceStates\.\$\{voiceState\}/);
  assert.match(overlay, /aria-live="polite"/);
  assert.match(overlay, /retryVoiceSession/);
  assert.match(overlay, /stopVoiceSession/);
});
