# Owner actions outside this repository

These actions require access to external accounts. They are not completed by a code change or a successful deployment.

## Search indexing after production deployment

- Submit the updated `https://kakhki.me/sitemap.xml` in Google Search Console.
- Inspect each historical five-nines crypto/fiat article URL and confirm that Google sees its permanent localized redirect.
- Request a recrawl of the historical URL after the redirect is live.
- Request reindexing for the corrected English and Persian homepages and project indexes.
- Repeat the sitemap submission, URL inspection, and recrawl process in Bing Webmaster Tools.
- Recheck indexed titles, snippets, canonicals, and locale alternates after crawlers revisit the site. Search snippets are not expected to change immediately after deployment.

## GitHub profile before restoring global links

The configured GitHub URL remains available for repository-specific links, but `approvedForGlobalBranding` must stay `false` until the profile has been reviewed and corrected.

- Standardize the display name as `Yousef Kakhki`.
- Replace the old primary title with `Senior Backend Engineer & Technical Lead`.
- Remove the `Studying` status unless it is currently intentional.
- Update the old domain and email address.
- Remove generated citation artifacts, including `[cite_start]` and `[cite: ...]` markers.
- Rewrite the profile README around distributed systems, backend engineering, WebRTC, Go, Node.js, Kafka/NATS, PostgreSQL, and Linux.
- Pin only current, relevant repositories.
- Archive or de-emphasize irrelevant forks and old demonstration projects.
- Publish at least two approved companion repositories from [`docs/public-engineering-artifacts-plan.md`](./public-engineering-artifacts-plan.md). Each must contain substantive code, pass CI, have a clear license, be owner-approved, and be externally verified.
- Review the profile image and bio for current professional positioning and publication permission.
- Confirm the corrected profile with the site owner before setting `approvedForGlobalBranding` to `true` or restoring it to homepage `Person.sameAs` data.

## Repository publication and Git history

Deleting files from the current tree does not remove them from Git history. Unsupported drafts, old social cards, client screenshots, template identities, and previous documentation may remain recoverable from earlier commits.

Before presenting this repository itself as a public engineering artifact, the owner must choose and document one path:

1. **Keep the repository private.** Share only the deployed portfolio and separately reviewed companion repositories.
2. **Sanitize Git history.** Perform a separately authorized history rewrite, then review all rewritten commits/tags, force-push implications, forks, mirrors, caches, release artifacts, licenses, and collaborators before treating the result as public.

Do not rewrite shared Git history as part of an ordinary portfolio release. A history-sanitization operation requires explicit authorization, a backup, stakeholder coordination, secret scanning, and post-rewrite verification.

## Content confirmations

See [`docs/content-fact-check.md`](./content-fact-check.md) for unresolved dates, testimonial provenance, and historical metrics that remain suppressed from public copy.
