# Public engineering artifacts plan

Status: target specifications only. No repository URL, public repository, or production-source claim is created by this document.

Every repository described below must use this visible boundary statement:

> Sanitized reference implementation — not client production source.

The examples must be built from new, synthetic fixtures. They must not copy private client source, deployment configuration, credentials, logs, customer data, event payloads, company names, infrastructure addresses, screenshots, or undocumented metrics.

## Repository A — WebRTC role-transition control plane

### Scope

A small Go or Node.js service demonstrating participant-role transitions for a real-time classroom control plane. It should model promotion and demotion between bounded roles, publish application events through NATS JetStream, survive reconnects, and make repeated commands idempotent. A local fake media-provider adapter may expose the contract needed to update permissions without connecting to a real LiveKit deployment.

### Exclusions

- No HonarAmoozesh or other client name, branding, topology, configuration, payload, or source code.
- No LiveKit credentials, room tokens, API secrets, real participant identifiers, recorded media, or production endpoints.
- No capacity, latency, uptime, cost, or deployment claims.
- No HLS path presented as a live-session fallback.
- No claim that the reference implementation is the production system.

### Architecture

- HTTP or message command boundary for requested role changes.
- Persisted participant-role aggregate with explicit transition rules.
- Idempotency key and command-result store.
- NATS JetStream publisher and consumer with durable event identifiers.
- Media-permission adapter interface plus deterministic local fake.
- Reconnect/replay handler that converges on the persisted role.
- Structured audit events with synthetic identifiers only.
- Architecture diagram showing command, state, event, adapter, and recovery boundaries.

### Test plan

- Unit tests for every permitted and rejected transition.
- Duplicate promotion/demotion tests proving one durable result.
- Event redelivery and out-of-order delivery tests.
- Reconnect tests that restore persisted role before applying media permissions.
- Failure-injection tests for persistence, NATS publication, consumer replay, and adapter failure.
- Contract tests against the fake media adapter.
- Race tests for competing role commands.

### Security considerations

- Validate role and command identifiers at the boundary.
- Keep credentials server-side and out of fixtures, logs, examples, and CI.
- Use synthetic participant IDs and redact command payloads from public traces.
- Document authorization as an interface requirement; do not ship a permissive production auth stub.
- Pin dependency versions and run dependency/security scanning in CI.
- Threat-model replay, unauthorized promotion, event forgery, and information leakage.

### License recommendation

Apache-2.0 after the owner confirms all code is independently authored and no client material was copied. Include the license text and copyright notice at repository creation time; do not backfill a license after publication without review.

### README structure

1. Reference-only disclaimer.
2. Problem boundary and non-goals.
3. State machine and event contract.
4. Local architecture diagram.
5. Synthetic quick start.
6. Failure and recovery semantics.
7. Test matrix.
8. Security and privacy notes.
9. Relationship to the portfolio case study.
10. License and contribution rules.

### CI checks

- Format and lint.
- Unit, integration, race, and failure-injection tests.
- NATS-backed test environment with deterministic teardown.
- Secret scan and dependency audit.
- Container build and non-root runtime check.
- README/link validation and architecture-diagram source validation.

### Portfolio relationship

Supports the `real-time-learning-platform` case study by demonstrating a sanitized role-transition control-plane pattern. It is supporting reference evidence, not the HonarAmoozesh production source.

### Owner approvals required before publishing

- Confirm the implementation contains no client source or confidential protocol detail.
- Review all names, fixtures, diagrams, and logs for client identity leakage.
- Approve the disclaimer and portfolio relationship.
- Approve the license and copyright statement.
- Review security assumptions and CI results.
- Externally verify the final public URL before adding it to the project artifact manifest.

## Repository B — Idempotent payment workflow

### Scope

A Go or Node.js API with PostgreSQL that demonstrates durable payment intents, idempotency keys, provider adapters, retry classification, timeout recovery, and a reconciliation worker. The development environment may use Docker Compose and a deterministic synthetic provider simulator.

### Exclusions

- No client source, provider credentials, merchant identifiers, wallet addresses, banking data, transaction history, production schema, or real payment payloads.
- No cryptocurrency, fiat, throughput, volume, latency, uptime, cost-saving, or settlement claims.
- No claim of PCI, financial, legal, or regulatory compliance.
- No live-money provider integration.
- No suggestion that the repository is production-ready.

### Architecture

- HTTP command boundary with an explicit idempotency key.
- PostgreSQL payment-intent and command-result records.
- Transactional state changes for accepted, duplicate, retryable, terminal, and reconciliation-required outcomes.
- Provider adapter interface plus deterministic simulator.
- Outbox or equivalent durable dispatch boundary.
- Reconciliation worker for timeout/unknown outcomes.
- Immutable audit trail containing synthetic values only.
- Small state-transition table aligned with the portfolio case study.

### Test plan

- First-command persistence and duplicate-key result-reuse tests.
- Concurrent duplicate-request tests.
- Provider success, retryable failure, terminal failure, timeout, and unknown-result tests.
- Worker restart and replay tests.
- Reconciliation convergence tests.
- Transaction rollback and outbox recovery tests.
- Migration tests against a clean PostgreSQL instance.
- Deterministic end-to-end tests through Docker Compose.

### Security considerations

- Accept only synthetic tokens and identifiers; never log request secrets.
- Validate amount/currency examples without presenting them as financial advice or production rules.
- Use parameterized database operations and least-privilege local credentials.
- Keep provider adapters isolated behind an allowlisted interface.
- Threat-model duplicate execution, replay, forged callbacks, state rollback, and sensitive logging.
- Run secret, dependency, and container scans in CI.

### License recommendation

Apache-2.0 after independent-authorship and third-party-license review. Include an explicit non-production and no-compliance disclaimer in README and source headers where appropriate.

### README structure

1. Reference-only and non-production disclaimer.
2. Idempotency and reconciliation problem statement.
3. State model and failure classes.
4. Architecture and PostgreSQL boundaries.
5. Synthetic provider simulator.
6. Local Docker Compose setup.
7. Deterministic test scenarios.
8. Security and compliance limitations.
9. Portfolio relationship.
10. License and contribution rules.

### CI checks

- Format, lint, type/static checks, and unit tests.
- PostgreSQL migration and integration tests.
- Concurrency and duplicate-command tests.
- Reconciliation/failure-injection suite.
- Secret scan and dependency audit.
- Docker Compose configuration validation and non-root container check.
- README/link validation.

### Portfolio relationship

Supports the `crypto-fiat-payment-gateway` case study as a sanitized reference for workflow semantics. It is not the client production source and must not be marked `production-source`.

### Owner approvals required before publishing

- Confirm no client schema, source, provider detail, or transaction data was copied.
- Approve the non-production and no-compliance disclaimer.
- Review state names, diagrams, fixtures, and logs for confidential similarity.
- Approve license and third-party dependencies.
- Review CI, threat model, and external-link destination.
- Externally verify the final public URL before manifest approval.

## Repository C — Atomic A/B OTA reference

### Scope

A reproducible simulator for signed artifact verification, writes to an inactive partition, simulated boot-slot switching, health checks, commit, and rollback. The repository should demonstrate failure boundaries without requiring a proprietary device, firmware image, bootloader, or signing service.

### Exclusions

- No client firmware, hardware identifiers, device screenshots, serial numbers, update servers, private keys, production certificates, bootloader configuration, or fleet telemetry.
- No claims about update duration, latency, fleet size, uptime, field success rate, or safety certification.
- No real partition writes outside an isolated disposable test image.
- No claim that the simulator is a production update agent.

### Architecture

- Synthetic artifact builder and detached-signature verifier.
- Disposable disk-image model with active and inactive slots.
- Update coordinator that writes only to the inactive slot.
- Simulated boot selector and boot-attempt counter.
- Health-check interface with deterministic success/failure fixtures.
- Commit and rollback state machine.
- Failure-injection hooks for signature, write, reboot, health, and commit failures.
- Reproducible local runner with no privileged host access.

### Test plan

- Valid and invalid signature tests.
- Active-slot write rejection.
- Partial-write and corrupted-artifact tests.
- Boot-switch and boot-attempt exhaustion tests.
- Health-check success, timeout, and failure tests.
- Atomic commit and rollback tests.
- Power-loss simulation at each state boundary.
- Reproducibility test from a clean checkout.

### Security considerations

- Use generated disposable test keys only; prohibit production keys and certificates.
- Never require privileged mounts or writes to host block devices.
- Keep test disk images inside a disposable workspace.
- Validate artifact hashes and signature metadata before state change.
- Threat-model key leakage, rollback bypass, downgrade, partial writes, and untrusted artifact paths.
- Scan dependencies, containers, and committed fixtures for secrets.

### License recommendation

Apache-2.0 after confirming all implementation and diagrams are independently authored. Clearly state that safety, hardware compatibility, secure boot, and production signing require target-specific engineering and review.

### README structure

1. Reference-only disclaimer.
2. Atomic A/B update boundary.
3. Simulator architecture.
4. Disposable artifact/key generation.
5. Local run instructions.
6. State transitions and failure scenarios.
7. Test and reproducibility matrix.
8. Security and hardware limitations.
9. Portfolio relationship.
10. License and contribution rules.

### CI checks

- Format, lint, static checks, and unit tests.
- Full simulator state-machine suite.
- Failure-injection and power-loss matrix.
- Reproducible clean-run check.
- Secret scan and dependency audit.
- Container build/non-root check when containers are used.
- README/link and diagram-source validation.

### Portfolio relationship

Supports the `embedded-linux-ota` project snapshot as a sanitized reference for atomic update and rollback semantics. It does not establish that client source or a production OTA implementation is public.

### Owner approvals required before publishing

- Confirm no client firmware, hardware details, source, keys, or screenshots were copied.
- Approve synthetic fixtures and failure scenarios.
- Review hardware/safety disclaimers and threat model.
- Approve license and dependency rights.
- Confirm CI and reproducibility checks pass.
- Externally verify the final public URL before adding any artifact link.

## Site-wide publication gate

Do not render “Selected public engineering artifacts” / “نمونه‌های عمومی مهندسی” site-wide until at least two repositories:

- exist and contain substantive code;
- pass CI from a clean checkout;
- have clear licenses;
- are owner-approved;
- are externally verified at their final URLs; and
- are recorded as approved sanitized-reference artifacts in the canonical project artifact model.

One repository, an empty repository, a placeholder URL, or a “coming soon” card is not enough. GitHub must also remain excluded from global branding until the separate external-profile owner-action gate is complete.