# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-08-25
- Primary product surfaces: English and Persian homepages, Work with me, project/case-study pages, blog index and articles, résumé download, contact flow
- Evidence reviewed: `app/[locale]`, `app/components`, `app/css/globals.scss`, `tailwind.config.js`, `docs/brand/Brand_Guidelines.md`, `docs/brand/Brand_Tokens.json`, `messages/en.json`, `messages/fa.json`, `content/blogs`, `public/brand`
- Factual authority: `utils/data/career-facts.js` and `docs/content-fact-check.md`

## Brand

- Personality: precise, calm, technically mature, candid about evidence, hands-on
- Trust signals: one primary market title, bounded system claims, architecture diagrams, explicit ownership, failure modes, evidence boundaries, stable résumé and proof links
- Avoid: generic developer-portfolio language, competing executive titles, unsupported precision, neon/glow-heavy cards, fabricated client or immigration claims, and hypothetical systems presented as production systems

## Product goals

- Goals:
  - Help EU recruiters identify role fit, seniority, relocation intent, and résumé within two interactions.
  - Help engineering leaders understand Yousef's architecture and implementation ownership through two or three substantive case studies.
  - Offer bounded consulting paths with concrete deliverables rather than an unstructured skill list.
  - Preserve a useful English primary experience while making Persian availability and locale boundaries explicit.
- Non-goals:
  - Expanding the portfolio with unverified metrics, client names, or additional thin content.
  - Replacing the App Router, locale routing, or server-rendered content with a client-only application.
  - Making the personal site look like a SaaS dashboard or a generic glassmorphism template.
- Success signals:
  - Clear title and proof in the first viewport.
  - Case studies explain context, constraints, decisions, failure modes, and evidence limits.
  - No broken internal asset/proof links, false locale alternates, or unsupported public claims.

## Personas and jobs

- Primary personas: EU recruiters and engineering leaders hiring senior backend/platform/real-time media engineers; technical buyers evaluating a bounded architecture review.
- User jobs:
  - Decide whether the candidate matches a senior hands-on backend or technical-lead role.
  - Verify the difference between measured outcomes, design goals, and confidential details.
  - Find a stable résumé, LinkedIn/GitHub/email, relocation context, or a suitable consulting deliverable.
- Key contexts of use: mobile recruiter scan, desktop technical review, bilingual reading in LTR and RTL, slow network and keyboard-only navigation.

## Information architecture

- Primary navigation: Work, Experience, Writing, About, Contact
- Utility actions: Résumé, language switcher, explicit LinkedIn/GitHub/email links
- Core routes/screens:
  - `/{locale}` homepage and conversion funnel
  - `/{locale}/projects` crawlable public case-study index
  - `/{locale}/projects/{slug}` evidence-led case study
  - `/{locale}/work-with-me` hiring/relocation and consulting paths
  - `/{locale}/blog`, `/{locale}/blog/{slug}`, and only active topic pages
- Content hierarchy: primary title → specializations → verified proof → audience path → selected work → experience → writing → contact

## Design principles

- Evidence before decoration: every prominent number, diagram, and attribution has a source or an explicit boundary.
- Architecture-document clarity: use labels, legends, timelines, ownership boundaries, and captions to make systems legible.
- One identity, multiple depths: lead with “Senior Backend Engineer & Technical Lead”; use Systems Architect, Real-Time Media, Distributed Systems, and Platform Engineering as specializations.
- Solid surfaces for reading and proof: reserve translucency for navigation, one hero proof panel, and small callouts.
- Progressive enhancement: public project links, locale boundaries, forms, and reading content remain useful without client-only interaction.
- Tradeoffs: visual polish is secondary to factual coherence, readability, accessibility, and maintainable bilingual content.

## Visual language

- Color:
  - Page background: `#08111F`
  - Primary surface: `#0D1A2B`
  - Elevated surface: `#13243A`
  - Primary text: `#F3F7FB`
  - Secondary text: `#A7B4C5`
  - Primary interactive cyan: `#22D3EE`
  - Secondary/status mint: `#16F2B3`
  - Diagram/warning amber: `#F59E0B`
  - Error: `#FB7185`
  - Border: `rgba(148, 163, 184, 0.18)`
- Typography: Manrope for Latin headings, Inter for Latin body/UI, Vazirmatn for Persian, IBM Plex Mono for short technical labels and code only.
- Spacing/layout rhythm: 4/8 px scale; 96/64/48 px section spacing for desktop/tablet/mobile; 1200–1240 px wide content; 760–800 px article reading width; logical `start`/`end`/`block` properties for RTL.
- Shape/radius/elevation: 16 px card radius, 1 px borders, restrained shadows, 2 px maximum hover translation.
- Motion: short transitions only; visible focus rings; decorative motion disabled or reduced under `prefers-reduced-motion`.
- Imagery/iconography: architecture diagrams and sanitized product views lead project cards; documentary/team photos are captioned as delivery evidence; consistent aspect ratio, border, radius, and caption treatment.

## Components

- Existing components to reuse: `Navbar`, `LanguageSwitcher`, `ConversionLink`, `ProjectVisual`, homepage section wrappers, article renderer, structured-data component.
- New/changed components: canonical career facts, case-study template/index, evidence-bound metric display, bilingual translation notice, proof-link/status checker, and bounded consulting service cards as needed.
- Variants and states:
  - Buttons: primary, secondary, text; minimum 44 px target and visible focus.
  - Cards: solid default, interactive only when linked, evidence/status callout.
  - Forms: idle, validation error, submitting, success, failure, disabled.
  - Locale content: translated, English-only with explicit notice, unpublished.
- Token/component ownership: global tokens live in `app/css/globals.scss` and Tailwind theme extensions; component styles consume tokens instead of adding arbitrary one-off colors.

## Accessibility

- Target standard: WCAG 2.2 AA intent, with no known text-contrast failures on audited surfaces.
- Keyboard/focus behavior: skip link, logical tab order, 44 px controls, visible cyan focus ring, keyboard-operable mobile menu and locale switcher.
- Contrast/readability: body text on solid surfaces; article body approximately 18 px and 62–72 character line length; no low-contrast text over decorative imagery.
- Screen-reader semantics: one H1 per page, semantic nav/main/article/section/list/figure elements, labelled controls, meaningful diagram alt text or adjacent descriptions, decorative icons hidden.
- Reduced motion and sensory considerations: disable card lifts, avatar transitions, staggered reveals, and nonessential animation when requested.

## Responsive behavior

- Supported breakpoints/devices: 320, 390, 768, 1024, and 1440 px representative widths.
- Layout adaptations: 12-column desktop, 8-column tablet, 4-column mobile; hero proof data wraps without overflow; article/code/diagram overflow is contained locally.
- Touch/hover differences: touch targets remain large; hover is enhancement only; no critical information appears only on hover.

## Interaction states

- Loading: preserve image dimensions and show a quiet architecture placeholder where appropriate.
- Empty: explain when a translation or public artifact is not available; never silently cross locales.
- Error: inline, actionable form/link/asset error; do not expose raw server details.
- Success: announce contact submission and keep the user’s context clear.
- Disabled: preserve readable contrast and explain pending state.
- Offline/slow network: server-render content, lazy-load optional avatar/animation work, and avoid layout shifts.

## Content voice

- Tone: direct, specific, modest, technically literate, and evidence-aware.
- Terminology: “Senior Backend Engineer & Technical Lead” is the primary title; “delayed HLS playback” is not “live HLS fallback” for the actual HonarAmoozesh system; distinguish “platform-level concurrency” from room/participant counts.
- Microcopy rules: use concrete CTAs (“View systems case studies”, “Discuss a role or project”), absolute localized article dates, explicit signed-company evidence labels, and no generic filler such as “If you have any questions or concerns”.

## Implementation constraints

- Framework/styling system: Next.js 15 App Router, React 19, next-intl locale routing, Tailwind CSS plus existing SCSS.
- Design-token constraints: preserve the existing component vocabulary where possible; centralize new navy/cyan/amber tokens; use logical CSS utilities for RTL.
- Performance constraints: server-render content-heavy routes, prioritize only the true LCP asset, contain backdrop blur, lazy-load optional 3D/audio features, reserve image dimensions.
- Compatibility constraints: preserve `/en` and `/fa`, full RTL, stable résumé download, and permanent redirects for legacy routes.
- Test/screenshot expectations: build, lint, node tests, content/metadata/link checks, résumé extraction, and representative viewport/accessibility checks when browser tooling is available.

## Open questions

- [ ] Confirm authoritative HonarAmoozesh engagement date text and whether “2025 · project contract” should remain public; owner: Yousef; impact: career facts, résumé, metadata.
- [ ] Confirm provenance, exact issuer, date, and permitted attribution for both testimonial assets; owner: Yousef; impact: testimonial display and proof CTAs.
- [ ] Confirm which résumé source is authoritative and whether a public repository link is still intended; owner: Yousef; impact: résumé generation and open-source copy.
- [ ] Confirm evidence sources for any metric beyond the verified platform-concurrency wording; owner: Yousef; impact: public claims and case-study outcomes.
