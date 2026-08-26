#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { resolveBrowserExecutable } = require('./browser-executable.cjs');

const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:3100').replace(/\/$/, '');
const artifactDir = process.env.A11Y_ARTIFACT_DIR || '/tmp/kakhki-a11y-check';
const axePath = require.resolve('axe-core/axe.min.js');
const routes = [
  '/en',
  '/fa',
  '/en/work-with-me',
  '/fa/work-with-me',
  '/en/projects',
  '/fa/projects',
  '/en/projects/ai-hologram-realtime-backend',
  '/en/blog/honar-amoozesh-5000-concurrent-webrtc-case-study',
];
const widths = [320, 390, 768, 1024, 1440];
const axeWidths = new Set([390, 1440]);

async function inspectRenderedPage(page) {
  return page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const languageSwitchers = [...document.querySelectorAll('[data-language-switcher]')];
    const languageLinks = languageSwitchers.flatMap(switcher => [...switcher.querySelectorAll('a[href]')]);
    const bodyText = document.body.innerText.replace(/\s+/g, ' ');
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const viewportWidth = window.innerWidth;

    return {
      h1Count: document.querySelectorAll('h1').length,
      duplicateIds,
      languageSwitcherCount: languageSwitchers.length,
      languageLinkCount: languageLinks.length,
      languageSwitcherLabel: languageSwitchers[0]?.getAttribute('aria-label') || '',
      languageSwitcherVisible: Boolean(languageSwitchers[0]?.getClientRects().length),
      concatenatedText: /C\+\+Java|Role:Technical/.test(bodyText),
      initialConnectingText: /\bconnecting\b/i.test(bodyText),
      overflow: scrollWidth > viewportWidth + 1,
      scrollWidth,
      viewportWidth,
      formLabels: [...document.querySelectorAll('form input, form textarea')].every(control => Boolean(
        control.labels?.length || control.getAttribute('aria-label') || control.getAttribute('aria-labelledby'),
      )),
    };
  });
}

async function inspectFocus(page) {
  await page.evaluate(() => {
    document.activeElement?.blur?.();
    document.body.focus();
  });
  await page.keyboard.press('Tab');
  return page.evaluate(() => {
    const active = document.activeElement;
    const style = active ? getComputedStyle(active) : null;
    const outlineVisible = style
      ? style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth || '0') > 0
      : false;
    const boxShadowVisible = style ? style.boxShadow !== 'none' : false;
    const borderVisible = style
      ? Number.parseFloat(style.borderWidth || '0') > 0 && style.borderColor !== 'rgba(0, 0, 0, 0)'
      : false;
    return {
      tag: active?.tagName || '',
      id: active?.id || '',
      text: active?.textContent?.trim() || '',
      visible: Boolean(active?.getClientRects().length),
      indicatorVisible: outlineVisible || boxShadowVisible || borderVisible,
    };
  });
}

async function inspectReducedMotion(page) {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const result = await page.evaluate(() => {
    const parseTimes = value => value.split(',').map(part => {
      const normalized = part.trim();
      return normalized.endsWith('ms') ? Number.parseFloat(normalized) : Number.parseFloat(normalized) * 1000;
    }).filter(Number.isFinite);
    let maxAnimationMs = 0;
    let maxTransitionMs = 0;
    for (const element of document.querySelectorAll('*')) {
      const style = getComputedStyle(element);
      maxAnimationMs = Math.max(maxAnimationMs, ...parseTimes(style.animationDuration), 0);
      maxTransitionMs = Math.max(maxTransitionMs, ...parseTimes(style.transitionDuration), 0);
    }
    return { maxAnimationMs, maxTransitionMs };
  });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  return result;
}

async function inspectEmptyContactForm(page) {
  const submit = await page.$('form button[type="submit"]');
  if (!submit) return null;
  await submit.click();
  return page.evaluate(() => ({
    alertCount: document.querySelectorAll('form [role="alert"]').length,
    invalidCount: document.querySelectorAll('form [aria-invalid="true"]').length,
    disabledCount: document.querySelectorAll('form button:disabled').length,
  }));
}

async function run() {
  fs.mkdirSync(artifactDir, { recursive: true });
  const executablePath = resolveBrowserExecutable();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...(executablePath && { executablePath }),
  });
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');

  const consoleErrors = [];
  const pageErrors = [];
  const webSockets = [];
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
  cdp.on('Network.webSocketCreated', event => webSockets.push(event.url));

  const results = [];
  const axeViolations = [];
  let axeChecks = 0;
  for (const route of routes) {
    for (const width of widths) {
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await new Promise(resolve => setTimeout(resolve, 250));

      const rendered = await inspectRenderedPage(page);
      const focus = await inspectFocus(page);
      const reducedMotion = (route === '/en' && (width === 390 || width === 1440))
        ? await inspectReducedMotion(page)
        : null;
      const contact = route === '/en' && width === 390 ? await inspectEmptyContactForm(page) : null;

      if (axeWidths.has(width)) {
        await page.addScriptTag({ path: axePath });
        const axeResult = await page.evaluate(async () => window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        }));
        axeChecks += 1;
        for (const violation of axeResult.violations.filter(item => ['serious', 'critical'].includes(item.impact))) {
          axeViolations.push({
            route,
            width,
            id: violation.id,
            impact: violation.impact,
            description: violation.description,
            nodes: violation.nodes.map(node => node.target.join(' ')),
          });
        }
      }

      results.push({ route, width, status: response?.status(), ...rendered, focus, reducedMotion, contact });
    }
  }

  await browser.close();
  const failures = results.flatMap(result => {
    const reasons = [];
    if (result.status !== 200) reasons.push(`status ${result.status}`);
    if (result.h1Count !== 1) reasons.push(`${result.h1Count} h1 elements`);
    if (result.duplicateIds.length) reasons.push(`duplicate IDs: ${result.duplicateIds.join(', ')}`);
    if (result.languageSwitcherCount !== 1) reasons.push(`${result.languageSwitcherCount} language switchers`);
    if (result.languageLinkCount !== 2 || !result.languageSwitcherLabel || !result.languageSwitcherVisible) reasons.push('language switch is not usable');
    if (result.concatenatedText) reasons.push('concatenated semantic text');
    if (result.initialConnectingText) reasons.push('initial connecting text');
    if (result.overflow) reasons.push(`horizontal overflow ${result.scrollWidth}/${result.viewportWidth}`);
    if (!result.formLabels) reasons.push('unlabelled form control');
    if (!result.focus.visible || !result.focus.indicatorVisible) reasons.push('first keyboard focus is not visibly indicated');
    if (result.reducedMotion && (result.reducedMotion.maxAnimationMs > 20 || result.reducedMotion.maxTransitionMs > 20)) reasons.push('reduced-motion duration exceeds 20ms');
    if (result.contact && (result.contact.alertCount < 1 || result.contact.invalidCount < 3)) reasons.push('contact validation states are incomplete');
    return reasons.length ? [{ route: result.route, width: result.width, reasons }] : [];
  });

  const report = {
    checked: results.length,
    axeChecks,
    failures,
    axeViolations,
    webSockets: [...new Set(webSockets)],
    internalResourceErrors: [...new Map(internalResourceErrors.map(error => [`${error.status}:${error.url}`, error])).values()],
    consoleErrors: [...new Set(consoleErrors)],
    pageErrors: [...new Set(pageErrors)],
    artifactDir,
  };
  fs.writeFileSync(path.join(artifactDir, 'accessibility-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  return failures.length || axeViolations.length || webSockets.length || internalResourceErrors.length || consoleErrors.length || pageErrors.length ? 1 : 0;
}

if (require.main === module) {
  run().then(code => { process.exitCode = code; }).catch(error => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = { run };
