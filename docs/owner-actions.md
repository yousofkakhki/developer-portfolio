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
- Remove `[cite_start]`, `[cite: ...]`, and other generated citation artifacts.
- Rewrite the profile README around distributed systems, backend engineering, WebRTC, Go, Node.js, Kafka/NATS, PostgreSQL, and Linux.
- Pin only current, relevant repositories.
- Archive or de-emphasize irrelevant forks and old demonstration projects.
- Add at least one representative backend or systems repository before restoring a prominent global link.
- Confirm the corrected profile with the site owner before setting `approvedForGlobalBranding` to `true` or restoring it to homepage `Person.sameAs` data.

## Content confirmations

See [`docs/content-fact-check.md`](./content-fact-check.md) for unresolved dates, testimonial provenance, and historical metrics that remain suppressed from public copy.
