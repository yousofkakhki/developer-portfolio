# Security boundary

This document summarizes controls implemented in the current repository and the limits of that evidence. Source review and automated tests are not a penetration test and are not a compliance certification. Production security also depends on deployment configuration, secret management, reverse-proxy behavior, patching, monitoring, and external services.

## Implemented application controls

### Bounded public write endpoints

The contact, analytics, and revalidation endpoints apply explicit request-size checks and in-process rate limiting. Rejected requests use bounded JSON responses and rate-limit metadata.

- `app/api/contact/route.js` validates and bounds contact input before transport.
- `app/api/analytics/route.js` accepts only allowlisted non-personal event fields.
- `app/api/revalidate/route.js` validates locale/slug input and compares `REVALIDATE_SECRET` using `timingSafeEqual`.

The rate limiter is process-local. It is appropriate for the current single application process but is not a distributed quota service. A multi-instance deployment would need a shared, owner-approved store and a reviewed trust boundary for client IPs.

### Contact transport

The contact endpoint:

- reads transport configuration only from server-side environment variables;
- supports an authenticated SMTP mode and an explicit Mailcow internal-relay mode;
- permits `SMTP_AUTH_DISABLED=true` only for the constrained `postfix-mailcow` port-25 path;
- requires TLS 1.2 or later when TLS is used;
- sets transport connection, greeting, socket, and send timeouts;
- disables Nodemailer file and URL access;
- escapes user-controlled HTML before composing messages;
- treats Telegram delivery as optional and bounded rather than a requirement for email success;
- returns generic public errors rather than transport credentials or raw internal exceptions.

No credential values belong in this repository. `.env.example` documents names and safe blanks only.

### Input handling

Application validation provides:

- bounded name, email, and message lengths;
- email-shape validation suitable for this contact workflow;
- null/control-character cleanup;
- rejection of known script/event-handler and obvious injection patterns;
- server-side HTML escaping for contact content;
- JSON parse/error handling;
- query-free, allowlisted analytics payloads.

These controls reduce obvious abuse and output injection risk. They are not a claim of complete RFC email validation, a web application firewall, SQL-query protection for a database-backed contact flow, or comprehensive malicious-input detection.

### Security headers

`middleware-security.js` defines the response policy, including:

- Content Security Policy;
- `object-src 'none'`;
- `base-uri 'self'`;
- `form-action 'self'`;
- `frame-ancestors 'none'`;
- HSTS;
- `X-Content-Type-Options`;
- `X-Frame-Options`;
- Referrer Policy;
- Cross-Origin resource/opener policies; and
- Permissions Policy.

The Permissions Policy intentionally uses `microphone=(self)` because the owner-approved, explicit opt-in voice experience requires same-origin microphone access. Camera and geolocation remain disabled. The Content Security Policy includes the documented Next.js hydration/style exception and `wasm-unsafe-eval` for the self-hosted VAD runtime; production JavaScript `unsafe-eval` remains disallowed.

### Progressive voice/avatar boundary

The professional portrait is the complete default experience. Three.js/VRM, Socket.IO, VAD, ONNX/WASM, and microphone behavior are loaded only after the visitor uses the explicit voice-introduction control. Reduced-motion and Save-Data paths retain the static portrait. Permission denial, transport errors, and visual-render failures preserve a non-voice/non-WebGL path.

### Container boundary

The production Compose service is configured to:

- bind on `127.0.0.1:3000`;
- run the application as the non-root `node` user;
- use a read-only root filesystem;
- drop all Linux capabilities;
- set `no-new-privileges`;
- bound processes, memory, CPU, and log rotation;
- mount content read-only; and
- isolate writable analytics/cache paths.

The Compose configuration references an existing Mailcow network and certificate mount. Their availability and permissions are operational prerequisites, not guarantees established by source tests.

## Required environment-variable names

Use `.env.example` as the canonical list. Security-relevant setting names include:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_ENABLE_VRM_AVATAR`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_AUTH_DISABLED`
- `RECEIVING_EMAIL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `REVALIDATE_SECRET`

Never commit real values. Rotate any value that has been exposed outside its intended secret store.

## Validation evidence

The canonical source gates are:

```bash
npm test
npm run lint
npm run content:integrity
npm run resume:check
npm run build
```

Relevant tests cover request bounds, rate limits, secret comparison, contact transport constraints, security headers, non-root/loopback container configuration, profile-link allowlisting, and opt-in heavy runtimes.

Built-origin checks add route, link, metadata, viewport, and accessibility evidence:

```bash
BASE_URL=http://127.0.0.1:3100 npm run links:check
BASE_URL=http://127.0.0.1:3100 npm run seo:health
BASE_URL=http://127.0.0.1:3100 npm run viewport:check
BASE_URL=http://127.0.0.1:3100 npm run a11y:check
```

A passing run applies only to the tested revision and environment.

## Residual risks and operational actions

- Process-local rate limits do not coordinate across replicas or survive process restart.
- Contact delivery depends on the configured SMTP/internal-relay boundary and certificate availability.
- Public voice mode depends on browser permission, microphone hardware, the external realtime service, and autoplay policy.
- CSP exceptions required by Next.js and ONNX/WASM should be reviewed when dependencies change.
- Dependencies and base images require regular patching and vulnerability review.
- Logs and analytics storage need owner-defined retention, backup, and access controls.
- Reverse-proxy/CDN rate limiting, request limits, TLS, and abuse monitoring must be verified separately in production.
- A professional penetration test is still required for penetration-test assurance.
- Legal, privacy, financial, and regulatory compliance require separate qualified review.

## Reporting a vulnerability

Do not include credentials, private client data, exploit payloads against production, or sensitive logs in a public issue. Contact the site owner through the verified contact path on [kakhki.me](https://kakhki.me) with a minimal reproduction, affected route/version, and impact description. Coordinate disclosure before publishing technical details.

## Secret-exposure response

If a credential or private key is committed or otherwise exposed:

1. revoke or rotate it at the provider immediately;
2. identify every system and artifact that received it;
3. remove it from the current tree;
4. decide separately whether a coordinated Git-history sanitation is required;
5. invalidate caches/releases/mirrors where possible; and
6. verify replacement credentials and logs without publishing their values.

Deleting a secret from the latest commit does not remove it from Git history.