const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('when enabled, the portrait stays initial and the AI face transitions after a brief visible delay', () => {
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');
  const styles = read('app/css/globals.scss');

  assert.match(overlay, /const AVATAR_TRANSITION_DELAY_MS = 3200;/);
  assert.match(overlay, /const AVATAR_TRANSITION_DURATION_MS = 900;/);
  assert.match(overlay, /useState\(['"]portrait['"]\)/);
  assert.match(overlay, /data-avatar-visual-state=\{visualState\}/);
  assert.match(overlay, /['"]preparing['"]/);
  assert.match(overlay, /['"]transitioning['"]/);
  assert.match(overlay, /['"]avatar['"]/);
  assert.match(overlay, /['"]fallback['"]/);
  assert.match(overlay, /document\.visibilityState === ['"]visible['"]/);
  assert.match(overlay, /window\.setTimeout\([^,]+, AVATAR_TRANSITION_DELAY_MS\)/s);
  assert.match(styles, /\.avatar-face-layer\[data-avatar-visual-state=['"]transitioning['"]\]/);
  assert.match(styles, /transition-duration:\s*900ms/);
  assert.match(styles, /\.avatar-face-layer\[data-avatar-visual-state=['"]avatar['"]\]\s*\{[^}]*transition:\s*none/);
  assert.match(styles, /clip-path/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*avatar-face-layer/);
});

test('WebGL and model failures return cleanly to the real portrait', () => {
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');
  const canvas = read('app/components/homepage/hero-section/avatar-face-canvas.jsx');

  assert.match(overlay, /<AvatarFaceCanvas onReady=\{handleAvatarReady\} onFailure=\{enterFallback\}/);
  assert.match(canvas, /function AvatarFaceCanvas\(\{ onReady, onFailure \}\)/);
  assert.match(canvas, /const AVATAR_RENDER_TIMEOUT_MS = 20000;/);
  assert.match(canvas, /onFailureRef\.current\?\.\(\)/);
  assert.match(canvas, /window\.setTimeout\(reportFailure, AVATAR_RENDER_TIMEOUT_MS\)/);
  assert.match(canvas, /window\.clearTimeout\(failureTimer\)/);
});

test('AI eye treatment is restrained and scoped to eye meshes', () => {
  const canvas = read('app/components/homepage/hero-section/avatar-face-canvas.jsx');

  assert.match(canvas, /const AVATAR_EYE_COLOR = 0x67e8f9;/);
  assert.match(canvas, /const AVATAR_EYE_EMISSIVE_INTENSITY = 0\.18;/);
  assert.match(canvas, /const HIDDEN_FACE_MATERIALS = new Set\(\[['"]SPINE['"]\]\)/);
  assert.match(canvas, /const FACE_SUPERSAMPLE = 2;/);
  assert.match(canvas, /const FACE_MAX_PIXEL_RATIO = 3;/);
  assert.match(canvas, /const EYE_MESH_NAMES = new Set\(\[['"]EYES['"], ['"]EYES\.001['"]\]\)/);
  assert.match(canvas, /EYE_MESH_NAMES\.has\(node\.name\)/);
  assert.match(canvas, /material\.clone\(\)/);
  assert.match(canvas, /eyeMaterial\.emissive\.setHex\(AVATAR_EYE_COLOR\)/);
  assert.match(canvas, /eyeMaterial\.emissiveIntensity = AVATAR_EYE_EMISSIVE_INTENSITY/);
  assert.doesNotMatch(canvas, /FACE_MESH_NAMES[^\n]*NECK/);
});
