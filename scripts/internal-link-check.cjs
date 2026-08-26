#!/usr/bin/env node

const canonicalBase = (process.env.LINK_BASE_URL || 'https://kakhki.me').replace(/\/$/, '');
const fetchOrigin = (process.env.LINK_FETCH_ORIGIN || canonicalBase).replace(/\/$/, '');
const canonicalOrigin = new URL(canonicalBase).origin;
const fetchBaseOrigin = new URL(fetchOrigin).origin;
const stableResumePath = '/files/yousef-kakhki-resume.pdf';
const jsonMode = process.argv.includes('--json');
const responseCache = new Map();
const failures = [];
const pages = new Map();
const targets = new Map();
let redirectsFollowed = 0;
let ogImagesChecked = 0;

function clean(value) {
  return String(value)
    .replace(/&amp;/gi, '&')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&quot;/gi, '"')
    .trim();
}

function mappedFetchUrl(publicUrl) {
  const url = new URL(publicUrl, canonicalBase);
  if (url.origin !== canonicalOrigin) return url.href;
  const mapped = new URL(fetchOrigin);
  mapped.pathname = url.pathname;
  mapped.search = url.search;
  mapped.hash = '';
  return mapped.href;
}

function publicUrl(value, sourceUrl = canonicalBase) {
  const resolved = new URL(value, sourceUrl);
  if (resolved.origin === fetchBaseOrigin) {
    const canonical = new URL(canonicalBase);
    canonical.pathname = resolved.pathname;
    canonical.search = resolved.search;
    canonical.hash = resolved.hash;
    return canonical.href;
  }
  return resolved.href;
}

async function request(url) {
  const key = publicUrl(url).split('#')[0];
  if (responseCache.has(key)) return responseCache.get(key).clone();
  const response = await fetch(mappedFetchUrl(key), {
    redirect: 'manual',
    headers: { 'user-agent': 'KakhkiInternalLinkCheck/1.0' },
    signal: AbortSignal.timeout(20000),
  });
  responseCache.set(key, response.clone());
  return response;
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match ? clean(match[1]) : '';
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => match[0]);
}

function addTarget(value, sourceUrl, kind) {
  if (!value || /^(?:mailto:|tel:|data:|javascript:)/i.test(value)) return;
  let resolved;
  try {
    resolved = publicUrl(value, sourceUrl);
  } catch {
    failures.push({ code: 'invalid_url', source: sourceUrl, target: value });
    return;
  }
  const url = new URL(resolved);
  if (url.origin !== canonicalOrigin) return;
  const key = url.href.split('#')[0];
  const record = targets.get(key) || { url: key, kinds: new Set(), sources: new Set() };
  record.kinds.add(kind);
  record.sources.add(sourceUrl);
  targets.set(key, record);

  if (/resume[^/]*[.]pdf$/i.test(url.pathname) && url.pathname !== stableResumePath) {
    failures.push({ code: 'stale_resume_link', source: sourceUrl, target: url.pathname });
  }
  if (url.pathname.endsWith('/recommendation.pdf')) {
    failures.push({ code: 'retired_recommendation_link', source: sourceUrl, target: url.pathname });
  }
}

function collectTargets(html, sourceUrl) {
  for (const tag of tags(html, 'a')) addTarget(attribute(tag, 'href'), sourceUrl, 'link');
  for (const tag of tags(html, 'script')) addTarget(attribute(tag, 'src'), sourceUrl, 'script');
  for (const tag of tags(html, 'img')) {
    addTarget(attribute(tag, 'src'), sourceUrl, 'image');
    for (const candidate of attribute(tag, 'srcset').split(',')) addTarget(candidate.trim().split(/\s+/)[0], sourceUrl, 'image');
  }
  for (const tag of tags(html, 'source')) {
    addTarget(attribute(tag, 'src'), sourceUrl, 'asset');
    for (const candidate of attribute(tag, 'srcset').split(',')) addTarget(candidate.trim().split(/\s+/)[0], sourceUrl, 'asset');
  }
  for (const tag of tags(html, 'link')) addTarget(attribute(tag, 'href'), sourceUrl, 'asset');
  for (const tag of tags(html, 'meta')) {
    if (attribute(tag, 'property').toLowerCase() === 'og:image') {
      addTarget(attribute(tag, 'content'), sourceUrl, 'og-image');
    }
  }
}

async function inspectPage(url) {
  let response;
  try {
    response = await request(url);
  } catch (error) {
    failures.push({ code: 'page_fetch', source: url, detail: error.message });
    return;
  }
  if (response.status !== 200) {
    failures.push({ code: 'page_status', source: url, detail: String(response.status) });
    return;
  }
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    failures.push({ code: 'page_content_type', source: url, detail: contentType });
    return;
  }
  const html = await response.text();
  pages.set(url, html);
  collectTargets(html, url);
}

async function inspectTarget(record) {
  let current = record.url;
  for (let hop = 0; hop < 6; hop += 1) {
    let response;
    try {
      response = await request(current);
    } catch (error) {
      failures.push({ code: 'target_fetch', source: [...record.sources][0], target: current, detail: error.message });
      return;
    }
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        failures.push({ code: 'redirect_without_location', target: current, detail: String(response.status) });
        return;
      }
      redirectsFollowed += 1;
      current = publicUrl(location, current).split('#')[0];
      continue;
    }
    if (response.status >= 400) {
      failures.push({ code: 'target_status', source: [...record.sources][0], target: current, detail: String(response.status) });
      return;
    }
    if (record.kinds.has('og-image')) {
      ogImagesChecked += 1;
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().startsWith('image/')) {
        failures.push({ code: 'og_image_content_type', target: current, detail: contentType || 'missing' });
      }
    }
    return;
  }
  failures.push({ code: 'redirect_loop', target: record.url });
}

async function main() {
  const sitemapUrl = `${canonicalBase}/sitemap.xml`;
  let sitemapResponse;
  try {
    sitemapResponse = await request(sitemapUrl);
  } catch (error) {
    failures.push({ code: 'sitemap_fetch', source: sitemapUrl, detail: error.message });
  }

  const pageUrls = new Set([`${canonicalBase}/en`, `${canonicalBase}/fa`]);
  if (sitemapResponse?.status === 200) {
    const sitemap = await sitemapResponse.text();
    for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)) pageUrls.add(clean(match[1]));
  } else if (sitemapResponse) {
    failures.push({ code: 'sitemap_status', source: sitemapUrl, detail: String(sitemapResponse.status) });
  }

  for (const url of pageUrls) await inspectPage(url);
  for (const record of targets.values()) await inspectTarget(record);

  const report = {
    checkedAt: new Date().toISOString(),
    canonicalBase,
    fetchOrigin,
    pagesChecked: pages.size,
    uniqueInternalTargets: targets.size,
    redirectsFollowed,
    ogImagesChecked,
    failures,
  };
  if (jsonMode || failures.length) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else process.stdout.write(`internal links: passed (${pages.size} pages, ${targets.size} targets, ${ogImagesChecked} Open Graph images)\n`);
  if (failures.length) process.exitCode = 1;
}

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
