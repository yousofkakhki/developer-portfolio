# kakhki.me

The source for [kakhki.me](https://kakhki.me), the bilingual English/Persian portfolio of Yousef Kakhki, Senior Backend Engineer & Technical Lead.

This repository is an evidence-grounded portfolio application, not a generic résumé template. It presents public career facts, selected writing, three full systems case studies, and six concise project snapshots while keeping unsupported metrics, private client source, and unapproved external profiles out of public surfaces.

## Current architecture

- Next.js 15 App Router with React 19.
- `/en` and `/fa` route trees using `next-intl`, including RTL document direction for Persian.
- Server-rendered homepage, writing, project index, case-study, and recruiter routes.
- Canonical evidence model in `utils/data/career-facts.js`.
- Explicit case-study versus project-snapshot publication model in `utils/data/project-publication-manifest.cjs`.
- Validated bilingual project media and artifact models in `utils/data/project-media-manifest.cjs` and `utils/data/project-artifact-manifest.cjs`.
- Route-specific, locale-aware Open Graph image generation at 1200×630.
- Static local article routes backed by the eligible records under `content/blogs/`.
- Opt-in voice/avatar enhancement; the static professional portrait is the complete default experience.

The exact installed package versions are recorded in `package.json` and `package-lock.json`. At the time of this README update, the declared core versions are Next.js `^15.5.22`, React `^19.2.1`, React DOM `^19.2.1`, and next-intl `^4.13.4`.

## Evidence and publication rules

Public claims are fail-closed:

- Repeated career facts and evidence status belong in `career-facts.js`.
- Full project detail routes are generated only for published case studies.
- Project snapshots remain on the project index and do not receive invented detail pages.
- Client source is private unless a real repository is explicitly approved and attached to the project artifact model.
- A generic GitHub profile is never treated as project source.
- Proposed architectures and design hypotheses are labelled as such.
- HonarAmoozesh uses LiveKit/WebRTC for live participation and delayed post-session HLS for later playback; the site does not present HLS as a live fallback.
- Public images require a manifest classification, dimensions, route references, provenance, and approval evidence when recognizable people appear.

See:

- `docs/content-fact-check.md`
- `docs/owner-actions.md`
- `docs/public-engineering-artifacts-plan.md`
- `DESIGN.md`

## Public-asset policy

`public/` contains only runtime files and publication-approved assets. The image inventory is fail-closed in `utils/data/public-asset-manifest.cjs` and audited by:

```bash
node scripts/audit-public-assets.cjs
node scripts/audit-public-assets.cjs --write
```

The generated machine-readable report is written to `artifacts/public-asset-audit.json`. Unreferenced visuals, abandoned social cards, unsupported claim-bearing artwork, draft-only media, and photographs without represented approval do not belong in `public/`.

The approved portrait source used to generate the public derivative is kept outside the web root under `assets/source/`.

## Local development

Prerequisites:

- Node.js 20 or a compatible runtime supported by the installed Next.js release.
- npm.
- Optional: Docker and Docker Compose for container builds.

Install and run:

```bash
npm install
npm run dev
```

The development server listens on `http://localhost:3000`.

Use `.env.example` as the list of supported setting names. Do not commit `.env`, credentials, tokens, private certificates, analytics data, or production secrets.

## Validation

Run the source and build gates from the repository root:

```bash
npm test
npm run lint
npm run content:integrity
npm run resume:check
npm run build
```

Built-origin checks require a running production build, normally on port 3100 for isolation:

```bash
BASE_URL=http://127.0.0.1:3100 npm run links:check
BASE_URL=http://127.0.0.1:3100 npm run seo:health
BASE_URL=http://127.0.0.1:3100 npm run viewport:check
BASE_URL=http://127.0.0.1:3100 npm run a11y:check
```

These commands are validation tools, not standing claims about a particular Lighthouse score, field Core Web Vitals, or universal accessibility conformance. Report the output of the actual run and its environment.

## Deployment

The current production approach is Docker Compose on the owned VPS, behind an existing reverse proxy. The `prod` service:

- builds with `Dockerfile.prod`;
- binds the application to `127.0.0.1:3000` rather than a public host interface;
- runs with a read-only root filesystem, dropped Linux capabilities, `no-new-privileges`, and bounded CPU/memory/process settings;
- mounts public content read-only and analytics storage separately;
- joins the existing Mailcow network for the explicitly configured internal relay path.

Build-only candidate validation is separate from promotion:

```bash
docker compose build prod
```

Do not use `docker compose up`, restart services, or promote a candidate without explicit deployment authorization and a production-invariant check.

## Repository structure

```text
app/                         Next.js routes, metadata, API endpoints, and components
content/blogs/               eligible evidence-bounded article records
messages/                    English and Persian UI messages
public/                      approved public assets and runtime model files
docs/                        evidence register, owner actions, and artifact plans
scripts/                     integrity, résumé, link, SEO, viewport, and axe checks
tests/                       Node test contracts
utils/data/                  canonical facts, publication, media, artifact, and route models
```

## Security and privacy boundary

`SECURITY.md` documents implemented controls and assurance limits. This repository does not publish credentials or private client source. Environment-variable examples contain names and safe blanks only. The contact, analytics, and revalidation write endpoints are bounded and tested, but repository tests are not a penetration test or compliance certification.

## Public engineering artifacts

No project source URL is invented here. Proposed companion repositories are specifications only until the owner creates, licenses, reviews, and externally verifies substantive implementations. See `docs/public-engineering-artifacts-plan.md`.

A site-wide public-artifact section should remain absent until at least two substantive repositories exist, pass CI, have clear licenses, are owner-approved, and are externally verified.

## Attribution and license status

This portfolio originated from the `said7388/developer-portfolio` template and has since been substantially reworked for the current bilingual evidence architecture. That reference is attribution only; it is not a claim that current project content, professional facts, media, or infrastructure belong to the template author.

There is currently no top-level `LICENSE` file in this repository. Do not claim a public reuse or redistribution grant unless the owner adds an explicit license after reviewing upstream attribution and asset rights. The absence of a license does not itself establish permission to reuse the code or assets.

## History and publication decision

Deleting unsupported files from the current tree does not erase them from Git history. Before presenting this repository itself as a public engineering artifact, the owner must choose one of two paths:

1. keep the repository private; or
2. perform a separately authorized history sanitation and legal/attribution review.

This candidate does not rewrite shared Git history.

## Contact

- Website: [kakhki.me](https://kakhki.me)
- LinkedIn: [Yousef Kakhki](https://www.linkedin.com/in/yousefkakhki/)

GitHub remains excluded from global portfolio branding until the external profile and representative repositories satisfy the owner-action gate documented in `docs/owner-actions.md`.
