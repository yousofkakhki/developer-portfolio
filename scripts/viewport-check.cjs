const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3100';
const screenshotDir = process.env.SCREENSHOT_DIR || '/tmp/kakhki-viewport-check';
const routes = [
  '/en',
  '/fa',
  '/en/projects',
  '/fa/projects',
  '/en/projects/ai-hologram-realtime-backend',
  '/en/blog/ebpf-probes-for-faster-ota-fault-detection',
  '/fa/blog/ebpf-probes-for-faster-ota-fault-detection',
  '/en/work-with-me',
];
const widths = [320, 390, 768, 1024, 1440];

async function run() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const internalResourceErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith(baseUrl)) {
      internalResourceErrors.push({ status: response.status(), url: response.url() });
    }
  });

  const results = [];
  for (const route of routes) {
    for (const width of widths) {
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 300));
      const snapshot = await page.evaluate(() => ({
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        viewportWidth: window.innerWidth,
        h1: document.querySelectorAll('h1').length,
        main: Boolean(document.querySelector('main')),
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      }));
      results.push({
        route,
        width,
        status: response?.status(),
        overflow: snapshot.scrollWidth > snapshot.viewportWidth + 1,
        ...snapshot,
      });
      if (width === 390 && (route === '/en' || route === '/fa')) {
        const locale = route.slice(1);
        await page.screenshot({ path: path.join(screenshotDir, `home-${locale}-390.png`), fullPage: false });
      }
    }
  }

  await browser.close();
  const failures = results.filter(result => result.status !== 200 || result.overflow || result.h1 !== 1 || !result.main || !result.canonical);
  const uniqueConsoleErrors = [...new Set(consoleErrors)];
  const uniquePageErrors = [...new Set(pageErrors)];
  const uniqueInternalResourceErrors = [...new Map(
    internalResourceErrors.map(error => [`${error.status}:${error.url}`, error]),
  ).values()];
  process.stdout.write(`${JSON.stringify({
    checked: results.length,
    failures,
    internalResourceErrors: uniqueInternalResourceErrors,
    consoleErrors: uniqueConsoleErrors,
    pageErrors: uniquePageErrors,
  }, null, 2)}\n`);
  return failures.length || uniqueInternalResourceErrors.length || uniqueConsoleErrors.length || uniquePageErrors.length ? 1 : 0;
}

if (require.main === module) {
  run().then(code => { process.exitCode = code; }).catch(error => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = { run };
