# Search Growth Baseline — 2026-07-28

## Scope and evidence boundary

This document is the starting point for search-growth decisions on `https://kakhki.me`. It separates directly verified site facts from metrics that require authenticated external services.

The public sitemap contains **13 canonical URLs**. A public crawl verified successful responses, self-canonicals, indexable metadata, and connected structured data. Google Search Console verification is present in production. No authenticated Search Console performance export, Bing Webmaster Tools account, rank tracker, backlink index, or field Core Web Vitals dataset was available during this audit.

**Unavailable, not zero:** search impressions, clicks, CTR, average position, Google indexed-page count, Bing indexed-page count, referring domains, backlinks, and field Core Web Vitals. Sitemap URL count must not be reported as indexed-page count.

The first-party conversion analytics baseline is genuinely zero events after deployment-verification records were removed. Collection started on 2026-07-28.

## Verified technical baseline

| Measure | Verified baseline |
|---|---|
| Canonical sitemap URLs | 13 |
| Published English articles | 4 |
| Genuine Persian article translations | 1 |
| Active English pillars | 2 |
| Google verification tag | Present |
| Search Console performance access | Unavailable |
| Bing verification tag | Not configured |
| First-party conversion events | 0 at clean start |
| Field Core Web Vitals | Unavailable |
| Lab Lighthouse | Separate lab evidence; never field data |

## Page-to-intent map

Target queries below are hypotheses for measurement, not ranking claims or guarantees.

| Canonical route | Search intent | Query family to test | Evidence / conversion role |
|---|---|---|---|
| `/en` | Professional evaluation | senior backend engineer WebRTC; LiveKit engineer; backend tech lead | Person/profile evidence; résumé and contact |
| `/fa` | Persian professional evaluation | یوسف کاخکی؛ مهندس ارشد بک‌اند؛ مهندس WebRTC | Persian profile; résumé and contact |
| `/en/work-with-me` | Recruiter / hiring transaction | senior backend engineer Germany relocation; real-time media engineer Europe | Best-fit roles and verified experience; contact |
| `/fa/work-with-me` | Persian hiring evaluation | استخدام مهندس ارشد بک‌اند اروپا؛ مهندس رسانه بلادرنگ | Localized role fit; contact |
| `/en/blog` | Technical discovery hub | WebRTC backend architecture blog; LiveKit engineering articles | Routes readers into English pillars and case study |
| `/fa/blog` | Persian technical discovery hub | Next.js چندزبانه؛ پشتیبانی RTL در Next.js | Routes readers to the genuine Persian article |
| `/en/blog/pillar/real-time-media` | Topic exploration | WebRTC architecture; LiveKit scaling; SFU architecture; delayed HLS playback | Cluster hub for three architecture articles plus case study |
| `/en/blog/pillar/pwa-product` | Topic exploration | bilingual Next.js architecture; RTL Next.js | Cluster hub backed by the bilingual portfolio article |
| `/en/blog/honar-amoozesh-5000-concurrent-webrtc-case-study` | Evidence-led architecture research | WebRTC HLS hybrid architecture; LiveKit 5000 concurrent users; WebRTC case study | Verified experience; article-to-contact CTA |
| `/en/blog/ai-enhanced-sfu-for-low-latency-streaming` | Conceptual technical research | AI SFU control plane; WebRTC QoE automation; LiveKit observability | Cited conceptual analysis; article-to-pillar/CTA |
| `/en/blog/eu-scale-livekit-sfu-clustering-in-frankfurt` | Reference architecture research | LiveKit SFU cluster architecture; regional WebRTC architecture | Clearly framed reference design, not production claim |
| `/en/blog/building-bilingual-portfolio-nextjs` | Implementation research | Next.js 15 bilingual website; Next.js RTL i18n | Demonstrable implementation; bilingual counterpart |
| `/fa/blog/building-bilingual-portfolio-nextjs` | Persian implementation research | ساخت سایت دوزبانه Next.js؛ پشتیبانی RTL | Genuine localized implementation article |

## Measurement definitions

Review these through authenticated Search Console exports when access exists:

- Impressions, clicks, CTR, and average position by query and landing page.
- Indexed and excluded canonical URLs from page indexing reports.
- Search appearance and structured-data enhancement status.
- Device and country segments only when sample sizes are useful; do not collect user-level identity.
- Conversion events by landing path and CTA source from the first-party aggregate log.
- Referring domains and backlinks from a named external index, with the provider and export date recorded.
- Field CWV only from Search Console/CrUX; Lighthouse remains lab evidence.

## First review questions

1. Which landing pages receive non-branded impressions?
2. Which pages have impressions but weak CTR and need title/description testing?
3. Which query families reach positions 8–30 and merit deeper supporting content?
4. Does the WebRTC case study produce recruiter-page visits, résumé downloads, or contact submissions?
5. Is there measurable Persian demand beyond the single translated implementation article?
6. Are any sitemap URLs excluded, duplicated, or canonicalized differently by Google/Bing?

## Immediate actions completed

- Corrected English and Persian blog-index descriptions to match published inventory.
- Added environment-controlled Bing verification readiness without inventing a token.
- Added a daily technical watchdog for sitemap health, status, canonical, noindex, structured data, redirects, and certificate expiry.
- Kept unsafe/unpublished articles out of routes and this intent map.

## External access required for the next quantitative update

- Google Search Console owner/user access or dated Performance and Page Indexing exports.
- Bing Webmaster Tools verification token and, after verification, dated performance/indexing exports.
- Optional backlink/referring-domain export from a named provider.

Until those sources are connected, this document remains a technical and content baseline—not a traffic or ranking report.
