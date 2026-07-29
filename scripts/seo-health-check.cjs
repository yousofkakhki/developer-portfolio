#!/usr/bin/env node

const tls = require('node:tls');

const baseUrl = (process.env.SEO_BASE_URL || 'https://kakhki.me').replace(/\/$/, '');
const jsonMode = process.argv.includes('--json');
const userAgent = 'KakhkiSEOHealth/1.0 (+https://kakhki.me)';
const failures = [];
const warnings = [];

const addFailure = (code, subject, detail) => failures.push({ code, subject, detail });
const addWarning = (code, subject, detail) => warnings.push({ code, subject, detail });
const cleanText = value => value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

async function request(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { 'user-agent': userAgent, accept: 'text/html,application/xml;q=0.9,*/*;q=0.8', ...(options.headers || {}) },
        signal: AbortSignal.timeout(20000),
      });
      if ((response.status === 403 || response.status >= 500) && attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, attempt * 750));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => match[0]);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match ? cleanText(match[1]) : '';
}

function metaContent(html, name) {
  const tag = tags(html, 'meta').find(item => attr(item, 'name').toLowerCase() === name.toLowerCase());
  return tag ? attr(tag, 'content') : '';
}

function canonicalHref(html) {
  const tag = tags(html, 'link').find(item => attr(item, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  return tag ? attr(tag, 'href') : '';
}

function structuredDataCount(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  let valid = 0;
  for (const [, attributes, body] of scripts) {
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) continue;
    try {
      JSON.parse(body.trim());
      valid += 1;
    } catch {
      // Reported by the caller when no valid graph remains.
    }
  }
  return valid;
}

async function inspectPage(url) {
  let response;
  try {
    response = await request(url);
  } catch (error) {
    addFailure('fetch_error', url, error.message);
    return;
  }
  if (response.status !== 200) {
    addFailure('http_status', url, String(response.status));
    return;
  }

  const html = await response.text();
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? cleanText(titleMatch[1]) : '';
  const description = metaContent(html, 'description');
  const robots = metaContent(html, 'robots').toLowerCase();
  const canonical = canonicalHref(html);

  if (!title) addFailure('missing_title', url, 'No document title');
  if (!description) addFailure('missing_description', url, 'No meta description');
  if (/\bnoindex\b/.test(robots)) addFailure('noindex', url, robots);
  if (!canonical) addFailure('missing_canonical', url, 'No canonical link');
  else if (canonical !== url) addFailure('canonical_mismatch', url, canonical);
  if (structuredDataCount(html) === 0) addFailure('structured_data', url, 'No valid application/ld+json graph');
}

function certificate(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, hostname, { servername: hostname, rejectUnauthorized: true }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert || !cert.valid_to) return reject(new Error('Certificate expiry unavailable'));
      const expiresAt = new Date(cert.valid_to);
      const daysRemaining = Math.floor((expiresAt.getTime() - Date.now()) / 86400000);
      resolve({ expiresAt: expiresAt.toISOString(), daysRemaining });
    });
    socket.setTimeout(20000, () => socket.destroy(new Error('TLS timeout')));
    socket.on('error', reject);
  });
}

async function inspectRedirect(sourceHost) {
  const probe = `https://${sourceHost}/seo-health-check?probe=1`;
  try {
    const response = await request(probe, { redirect: 'manual' });
    const location = response.headers.get('location') || '';
    const expected = `${baseUrl}/seo-health-check?probe=1`;
    if (response.status !== 301 || location !== expected) {
      addFailure('redirect', probe, `Expected 301 ${expected}; received ${response.status} ${location}`);
    }
  } catch (error) {
    addFailure('redirect_fetch', probe, error.message);
  }
}

async function main() {
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  let sitemapResponse;
  try {
    sitemapResponse = await request(sitemapUrl);
  } catch (error) {
    addFailure('sitemap_fetch', sitemapUrl, error.message);
  }

  let urls = [];
  if (sitemapResponse) {
    if (sitemapResponse.status !== 200) {
      addFailure('sitemap_status', sitemapUrl, String(sitemapResponse.status));
    } else {
      const xml = await sitemapResponse.text();
      urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(match => cleanText(match[1]));
      if (!urls.length) addFailure('sitemap_empty', sitemapUrl, 'No <loc> entries');
      if (new Set(urls).size !== urls.length) addFailure('sitemap_duplicate', sitemapUrl, 'Duplicate canonical URLs');
      if (urls.some(url => !url.startsWith(`${baseUrl}/`))) addFailure('sitemap_host', sitemapUrl, 'Non-canonical host found');
    }
  }

  for (const url of urls) await inspectPage(url);

  try {
    const robotsResponse = await request(`${baseUrl}/robots.txt`);
    const robots = await robotsResponse.text();
    if (robotsResponse.status !== 200) addFailure('robots_status', `${baseUrl}/robots.txt`, String(robotsResponse.status));
    if (!robots.includes(`Sitemap: ${sitemapUrl}`)) addFailure('robots_sitemap', `${baseUrl}/robots.txt`, 'Canonical sitemap declaration missing');
    if (/Disallow:\s*\/_next/i.test(robots)) addFailure('robots_assets', `${baseUrl}/robots.txt`, 'Next.js assets blocked');
  } catch (error) {
    addFailure('robots_fetch', `${baseUrl}/robots.txt`, error.message);
  }

  for (const host of ['www.kakhki.me', 'kakhki.ir', 'www.kakhki.ir']) await inspectRedirect(host);

  let tlsStatus = null;
  try {
    tlsStatus = await certificate(new URL(baseUrl).hostname);
    if (tlsStatus.daysRemaining < 14) addFailure('tls_expiry', baseUrl, `${tlsStatus.daysRemaining} days remaining`);
    else if (tlsStatus.daysRemaining < 30) addWarning('tls_expiry', baseUrl, `${tlsStatus.daysRemaining} days remaining`);
  } catch (error) {
    addFailure('tls', baseUrl, error.message);
  }

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    sitemapUrls: urls.length,
    certificate: tlsStatus,
    failures,
    warnings,
  };

  if (jsonMode || failures.length || warnings.length) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (failures.length) process.exitCode = 1;
}

main().catch(error => {
  process.stdout.write(`${JSON.stringify({ checkedAt: new Date().toISOString(), failures: [{ code: 'uncaught', detail: error.message }] }, null, 2)}\n`);
  process.exitCode = 1;
});
