## SaaS preset

Enable this preset when __APP_NAME__ serves multiple customers from one shared
deployment: a multi-tenant web app, an API product, or any system where one
account's data, billing, and limits must never bleed into another's. It appends to
and specializes the base rules.

Central rule: **the tenant boundary is a security boundary, and billing state is a
promise.** Leaking one tenant's data into another's view is a P0 breach, not a bug.
Charging, entitling, or cutting off a customer incorrectly is a P0/P1 that costs
money and trust. Neither is ever a styling ticket.

### 1. Tenant isolation is not optional

Every query, cache entry, background job, file path, and object key must be scoped
to a tenant. There is no "just this once" global read.

- Derive the tenant from the authenticated principal, **never** from a client-supplied
  id, header, or body field that the request could forge.
- Namespace every cache key, queue message, storage prefix, and search index by
  tenant id; a shared key that omits the tenant is a cross-tenant leak waiting to fire.
- A missing or ambiguous tenant scope is a hard stop — fail closed, do not fall back
  to "all rows."
- Cross-tenant work (admin tools, aggregate reports) is a separate, explicitly-audited
  path with its own authorization — never a side effect of a normal handler.

### 2. Authorize every handler — deny by default

Authentication answers *who*; authorization answers *what they may touch*. Both run
on every entry point.

- Default to deny. A new route, RPC, job, or webhook is unauthorized until you add
  the check — never authorized because you forgot one.
- Enforce **object-level** access: confirm this principal may act on *this specific*
  resource, not merely that they hold the role in general.
- Check on the server, on every request. Client-side gating is UX, not security.
- Least privilege for machine principals too: scope API keys, service tokens, and
  internal callers to exactly what they need.

### 3. Billing and entitlements must be correct

Subscription state drives what a customer can do and what they pay. Get it exactly
right.

- Entitlements (plan, seats, feature flags, quotas) are enforced server-side from the
  current subscription — never trusted from the client or a stale cache.
- Make billing operations **idempotent**: no double-charge on a retry, a webhook
  replay, or a double-click. Key money-moving actions by a stable idempotency token.
- Handle the full lifecycle honestly: proration on plan change, trials, downgrades,
  cancellations, failed payments, dunning, and grace periods. Treat the billing
  provider's webhook as the source of truth and reconcile against it.
- A wrong invoice, a missed cancellation, or an over-provisioned plan is P0/P1.

### 4. Treat PII and data lifecycle as a contract

Customer data carries legal and reputational weight.

- Collect the minimum, encrypt in transit and at rest, and never log raw PII,
  credentials, tokens, or full payloads.
- Honor retention and deletion commitments: know where every copy of a tenant's data
  lives (DB, cache, backups, search, logs, exports) so export and hard-delete are
  actually complete. Secrets and per-tenant keys stay managed, rotatable, and uncommitted.

### 5. Rate-limit per principal, not just globally

Apply quotas and rate limits per tenant / per API key / per user, so one noisy account
cannot starve the rest. Bound the cost of expensive operations (exports, reports,
fan-out); push back with a clear `429`, never silent failure or unbounded work.

### 6. Migrations stay safe and reversible

Shared tables are shared risk; a bad migration can take down every tenant at once.

- Prefer additive, backward-compatible changes; use expand/contract for column and
  type changes so old and new code run together during rollout.
- Every migration ships with a tested rollback and, for large tables, a plan that does
  not lock out live tenants. No destructive change without an explicit, approved window.

### Observability without leaking

Instrument logs, metrics, and traces so incidents are debuggable — and so they never
become the leak.

- Tag telemetry with tenant id (or a stable pseudonym) to isolate one customer's
  problem, but **redact secrets and PII** from every log line, span, and error report.
- Error messages returned to a client must not disclose another tenant's existence,
  ids, or data. Log the detail server-side; return the minimum.
- A log or trace that exposes a token, password, or personal data is itself a P0.
