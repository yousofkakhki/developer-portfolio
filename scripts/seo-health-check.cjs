#!/usr/bin/env node

const tls = require('node:tls');
const { historicalArticleRedirects, HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS } = require('../utils/data/legacy-route-manifest.cjs');
const { PROJECT_PUBLICATION_TYPES, projectPublicationManifest } = require('../utils/data/project-publication-manifest.cjs');

const baseUrl = (process.env.SEO_BASE_URL || 'https://kakhki.me').replace(/\/$/, '');
const fetchOrigin = (process.env.SEO_FETCH_ORIGIN || baseUrl).replace(/\/$/, '');
const jsonMode = process.argv.includes('--json');
const maxTitleLength = Number(process.env.SEO_MAX_TITLE_LENGTH || 80);
const userAgent = 'KakhkiSEOHealth/2.0 (+https://kakhki.me)';
const baseOrigin = new URL(baseUrl).origin;
const fetchBaseOrigin = new URL(fetchOrigin).origin;
const usesSeparateFetchOrigin = baseOrigin !== fetchBaseOrigin;
const failures = [];
const warnings = [];
const pageRecords = [];
const responseCache = new Map();
let alternateTargetsChecked = 0;
let structuredDataGraphs = 0;

const addFailure = (code, subject, detail) => failures.push({ code, subject, detail });
const addWarning = (code, subject, detail) => warnings.push({ code, subject, detail });
const cleanText = value => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#(?:39|x27);/gi, "'")
  .replace(/\s+/g, ' ')
  .trim();

function fetchUrlFor(publicUrl) {
  const target = new URL(publicUrl, baseUrl);
  if (target.origin !== baseOrigin) return target.href;
  const mapped = new URL(fetchOrigin);
  mapped.pathname = target.pathname;
  mapped.search = target.search;
  mapped.hash = '';
  return mapped.href;
}

function publicLocation(location, sourceUrl) {
  const resolved = new URL(location, sourceUrl);
  if (resolved.origin === fetchBaseOrigin) {
    const canonical = new URL(baseUrl);
    canonical.pathname = resolved.pathname;
    canonical.search = resolved.search;
    canonical.hash = resolved.hash;
    return canonical.href;
  }
  return resolved.href;
}

async function request(url, options = {}) {
  const cacheKey = `${options.redirect || 'follow'}:${url}`;
  if (!options.noCache && responseCache.has(cacheKey)) return responseCache.get(cacheKey).clone();

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(fetchUrlFor(url), {
        ...options,
        headers: {
          'user-agent': userAgent,
          accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
          ...(options.headers || {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if ((response.status === 403 || response.status >= 500) && attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, attempt * 750));
        continue;
      }
      if (!options.noCache) responseCache.set(cacheKey, response.clone());
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

function metaContent(html, key, attribute = 'name') {
  const tag = tags(html, 'meta').find(item => attr(item, attribute).toLowerCase() === key.toLowerCase());
  return tag ? attr(tag, 'content') : '';
}

function canonicalHref(html) {
  const tag = tags(html, 'link').find(item => attr(item, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  return tag ? attr(tag, 'href') : '';
}

function alternateLinks(html) {
  return tags(html, 'link')
    .filter(item => attr(item, 'rel').toLowerCase().split(/\s+/).includes('alternate') && attr(item, 'hreflang'))
    .map(item => ({ language: attr(item, 'hreflang'), href: attr(item, 'href') }));
}

function structuredData(html, url) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const documents = [];
  for (const [, attributes, body] of scripts) {
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) continue;
    try {
      documents.push(JSON.parse(body.trim()));
    } catch (error) {
      addFailure('structured_data_syntax', url, error.message);
    }
  }
  structuredDataGraphs += documents.length;
  return documents;
}

function flattenStructuredData(documents) {
  return documents.flatMap(document => {
    if (Array.isArray(document)) return document;
    if (Array.isArray(document?.['@graph'])) return document['@graph'];
    return document ? [document] : [];
  });
}

function languageMatches(value, locale) {
  const values = Array.isArray(value) ? value : [value];
  return values.some(candidate => typeof candidate === 'string' && candidate.toLowerCase().startsWith(locale));
}

function checkTitle(title, url) {
  if (!title) {
    addFailure('missing_title', url, 'No document title');
    return;
  }
  if (title.length > maxTitleLength) addFailure('title_length', url, `${title.length} characters: ${title}`);
  if (/System Architect & Technical Lead/i.test(title)) addFailure('stale_title', url, title);

  const englishOwnerCount = (title.match(/Yousef Kakhki/g) || []).length;
  const persianOwnerCount = (title.match(/یوسف کاخکی/g) || []).length;
  if (englishOwnerCount > 1 || persianOwnerCount > 1) addFailure('duplicate_title_brand', url, title);
  if (englishOwnerCount && persianOwnerCount) addFailure('mixed_title_brand', url, title);

  const pathname = new URL(url).pathname;
  const locale = pathname.split('/')[1];
  const isLocaleHome = pathname === `/${locale}`;
  if (!isLocaleHome) {
    const suffix = locale === 'fa' ? ' | یوسف کاخکی' : ' | Yousef Kakhki';
    if (!title.endsWith(suffix)) addFailure('title_suffix', url, `Expected suffix ${suffix}: ${title}`);
  }
}

async function inspectPage(url) {
  let response;
  try {
    response = await request(url, { redirect: 'manual' });
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
  const alternates = alternateLinks(html);
  const documents = structuredData(html, url);
  const pathname = new URL(url).pathname;
  const locale = pathname.split('/')[1];
  const ogLocale = metaContent(html, 'og:locale', 'property');

  checkTitle(title, url);
  if (!description) addFailure('missing_description', url, 'No meta description');
  if (/\bnoindex\b/.test(robots)) addFailure('noindex', url, robots);
  if (!canonical) addFailure('missing_canonical', url, 'No canonical link');
  else if (canonical !== url) addFailure('canonical_mismatch', url, canonical);
  if (!documents.length) addFailure('structured_data', url, 'No valid application/ld+json graph');
  if (!flattenStructuredData(documents).some(node => languageMatches(node?.inLanguage, locale))) {
    addFailure('structured_data_language', url, `No ${locale} inLanguage value`);
  }
  if (ogLocale !== (locale === 'fa' ? 'fa_IR' : 'en_US')) {
    addFailure('open_graph_locale', url, ogLocale || 'missing');
  }

  const byLanguage = new Map(alternates.map(link => [link.language, link.href]));
  if (!byLanguage.has(locale)) addFailure('hreflang_self', url, `Missing ${locale} alternate`);
  if (!byLanguage.has('x-default')) addFailure('hreflang_default', url, 'Missing x-default alternate');
  for (const { language, href } of alternates) {
    if (!href.startsWith(`${baseUrl}/`)) addFailure('hreflang_host', url, `${language}: ${href}`);
    let target;
    try {
      target = await request(href, { redirect: 'manual' });
    } catch (error) {
      addFailure('hreflang_fetch', url, `${language}: ${error.message}`);
      continue;
    }
    alternateTargetsChecked += 1;
    if (target.status !== 200) addFailure('hreflang_status', url, `${language}: ${target.status} ${href}`);
  }

  pageRecords.push({ url, title });
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

async function inspectHostRedirect(sourceHost) {
  const probe = `https://${sourceHost}/seo-health-check?probe=1`;
  try {
    const response = await fetch(probe, { redirect: 'manual', headers: { 'user-agent': userAgent }, signal: AbortSignal.timeout(20000) });
    const location = response.headers.get('location') || '';
    const expected = `${baseUrl}/seo-health-check?probe=1`;
    if (response.status !== 301 || location !== expected) {
      addFailure('redirect', probe, `Expected 301 ${expected}; received ${response.status} ${location}`);
    }
  } catch (error) {
    addFailure('redirect_fetch', probe, error.message);
  }
}

async function inspectHistoricalRedirect({ source, destination }) {
  const sourceUrl = `${baseUrl}${source}`;
  const expected = `${baseUrl}${destination}`;
  try {
    const response = await request(sourceUrl, { redirect: 'manual', noCache: true });
    const location = response.headers.get('location') || '';
    const normalizedLocation = location ? publicLocation(location, sourceUrl) : '';
    if (![301, 308].includes(response.status) || normalizedLocation !== expected) {
      addFailure('historical_redirect', sourceUrl, `Expected 301/308 ${expected}; received ${response.status} ${normalizedLocation}`);
    }
  } catch (error) {
    addFailure('historical_redirect_fetch', sourceUrl, error.message);
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
      const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map(match => match[1]);
      urls = entries.map(entry => cleanText((entry.match(/<loc>([^<]+)<\/loc>/i) || [])[1] || ''));
      if (!urls.length) addFailure('sitemap_empty', sitemapUrl, 'No <loc> entries');
      if (new Set(urls).size !== urls.length) addFailure('sitemap_duplicate', sitemapUrl, 'Duplicate canonical URLs');
      if (urls.some(url => !url.startsWith(`${baseUrl}/`))) addFailure('sitemap_host', sitemapUrl, 'Non-canonical host found');
      for (const entry of entries) {
        const url = cleanText((entry.match(/<loc>([^<]+)<\/loc>/i) || [])[1] || sitemapUrl);
        const lastModified = cleanText((entry.match(/<lastmod>([^<]+)<\/lastmod>/i) || [])[1] || '');
        const timestamp = Date.parse(lastModified);
        if (!lastModified || Number.isNaN(timestamp)) addFailure('sitemap_lastmod', url, lastModified || 'missing');
        else if (timestamp > Date.now() + 86400000) addFailure('sitemap_lastmod_future', url, lastModified);
      }
      for (const slug of HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS) {
        if (urls.some(url => url.includes(slug))) addFailure('sitemap_historical_url', sitemapUrl, slug);
      }
      const snapshotSlugs = projectPublicationManifest
        .filter(project => project.publicationType === PROJECT_PUBLICATION_TYPES.projectSnapshot)
        .map(project => project.slug);
      for (const slug of snapshotSlugs) {
        if (urls.some(url => url.includes(`/projects/${slug}`))) addFailure('sitemap_snapshot_url', sitemapUrl, slug);
      }
    }
  }

  for (const url of urls) await inspectPage(url);

  const titles = new Map();
  for (const record of pageRecords) {
    const routes = titles.get(record.title) || [];
    routes.push(record.url);
    titles.set(record.title, routes);
  }
  for (const [title, routes] of titles) {
    if (title && routes.length > 1) addFailure('duplicate_titles', title, routes.join(', '));
  }

  for (const redirect of historicalArticleRedirects) await inspectHistoricalRedirect(redirect);

  try {
    const robotsResponse = await request(`${baseUrl}/robots.txt`);
    const robots = await robotsResponse.text();
    if (robotsResponse.status !== 200) addFailure('robots_status', `${baseUrl}/robots.txt`, String(robotsResponse.status));
    if (!robots.includes(`Sitemap: ${sitemapUrl}`)) addFailure('robots_sitemap', `${baseUrl}/robots.txt`, 'Canonical sitemap declaration missing');
    if (/Disallow:\s*\/_next/i.test(robots)) addFailure('robots_assets', `${baseUrl}/robots.txt`, 'Next.js assets blocked');
  } catch (error) {
    addFailure('robots_fetch', `${baseUrl}/robots.txt`, error.message);
  }

  let tlsStatus = null;
  if (!usesSeparateFetchOrigin) {
    for (const host of ['www.kakhki.me', 'kakhki.ir', 'www.kakhki.ir']) await inspectHostRedirect(host);
    try {
      tlsStatus = await certificate(new URL(baseUrl).hostname);
      if (tlsStatus.daysRemaining < 14) addFailure('tls_expiry', baseUrl, `${tlsStatus.daysRemaining} days remaining`);
      else if (tlsStatus.daysRemaining < 30) addWarning('tls_expiry', baseUrl, `${tlsStatus.daysRemaining} days remaining`);
    } catch (error) {
      addFailure('tls', baseUrl, error.message);
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    fetchOrigin,
    sitemapUrls: urls.length,
    pagesChecked: pageRecords.length,
    uniqueTitles: titles.size,
    alternateTargetsChecked,
    structuredDataGraphs,
    historicalRedirectsChecked: historicalArticleRedirects.length,
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
