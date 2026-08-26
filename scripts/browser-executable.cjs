const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function commandPath(command) {
  try {
    return execFileSync('which', [command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function playwrightCacheCandidates() {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    path.join(os.homedir(), '.cache', 'ms-playwright'),
  ].filter(Boolean);
  const candidates = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root).filter(name => name.startsWith('chromium-')).sort().reverse()) {
      candidates.push(
        path.join(root, entry, 'chrome-linux64', 'chrome'),
        path.join(root, entry, 'chrome-linux', 'chrome'),
      );
    }
  }
  return candidates;
}

function resolveBrowserExecutable() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    commandPath('chromium'),
    commandPath('chromium-browser'),
    commandPath('google-chrome'),
    ...playwrightCacheCandidates(),
  ].filter(Boolean);
  return candidates.find(candidate => fs.existsSync(candidate)) || null;
}

module.exports = { resolveBrowserExecutable };
