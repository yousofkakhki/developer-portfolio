# Content fact check

Last reviewed: 2026-08-31

This register records public wording decisions where the live audit or repository contains conflicting variants. The canonical structured values live in [`utils/data/career-facts.js`](../utils/data/career-facts.js). `unconfirmed` and `doNotPublish` facts must not be rendered as public claims.

## Resolved public wording

| Fact | Public wording | Evidence boundary |
| --- | --- | --- |
| Primary title | Senior Backend Engineer & Technical Lead | Systems Architect is a specialization, not a competing market title. |
| Scale | 5,000+ platform-level concurrent users | This does not claim 5,000 publishers, one room, or one SFU. |
| HonarAmoozesh media path | LiveKit/WebRTC for interactive participation; delayed HLS playback later | HLS is not described as a current-session fallback. |
| Resume URL | `/files/yousef-kakhki-resume.pdf` | Stable public URL; dated/legacy files remain compatibility copies until replaced. |
| Relocation | Open to employer-supported relocation in Germany and the Netherlands | This does not claim visa approval or sponsorship availability. |

## Unresolved facts and conflicting source variants

### HonarAmoozesh engagement dates

The repository contains both `Jul 2025 - Nov 2025` and `Sep 2025 - Present`. No authoritative contract or project record in the repository resolves the discrepancy. Public copy therefore uses `2025 · project contract` until the owner confirms exact dates.

### Unsupported performance and cost metrics

The following values appear in historical or résumé material but are not supported by a public evidence source in the repository:

- 78% infrastructure-cost reduction
- 99.9% uptime
- sub-100 ms signaling
- transparent WebRTC/HLS switching
- elimination of buffering events
- under-80 ms hologram path
- sub-100 ms matching-engine latency

They are suppressed from public homepage, Work with me, case-study, metadata, and résumé surfaces. A future publication requires a source, measurement context, and owner confirmation.

### Testimonials

The testimonial images were removed from the current public tree because approval and attribution evidence were not represented. Testimonials remain non-public until the exact issuer, date, wording, and permitted attribution are confirmed. Any future image also requires explicit publication approval and a new public-asset classification.

### Credentials and rankings

“Iran’s #1 ranked university” and “Hyperledger Sawtooth Architecture” as a certification are not published. They require a dated authoritative ranking source or a real issuing body/credential before reuse.

### Public repository

The portfolio must not claim that private client source is public. Repository links render only through the approved project-artifact model. A companion implementation must be labelled as a sanitized reference rather than production source, and global GitHub branding remains disabled until the external profile owner-action gate is complete.
