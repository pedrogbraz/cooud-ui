## Open-source preset

Enable this preset when __APP_NAME__ is published for others to depend on and
contribute to: a library, SDK, CLI, or public API released under an open-source
license. It appends to and specializes the base rules.

Central rule: **the public surface is a contract with strangers you will never meet.**
People build on what you export, on a schedule you do not control. Breaking them
silently, or shipping a secret to a public repo, is a P0 — not a follow-up.

### 1. Guard the public surface, version it honestly

Anything exported — functions, types, CLI flags, config keys, HTTP routes, event
shapes — is API the moment it ships. Treat the boundary between public and internal
as deliberate.

- Keep the public surface small and intentional; mark internals clearly and do not
  let them leak into the published entry points.
- Follow **semver** literally: a breaking change to public behavior is a **major**
  bump, new backward-compatible capability is minor, fixes are patch.
- **Deprecate before you remove.** Ship the deprecation with a warning, a migration
  note, and a replacement, keep it working for at least one minor cycle, then remove
  only on a major. Never delete public API in a patch.
- When a change would break consumers, stop and say so plainly — do not disguise a
  breaking change as a "fix."

### 2. Never commit a secret

A public repository has no private corners, and git history is forever.

- No tokens, keys, passwords, private endpoints, or customer data in source, tests,
  fixtures, examples, or commit history.
- Use placeholders and documented env vars; keep real secrets out of the tree with
  ignore rules and pre-commit hygiene.
- If a secret is ever committed, treat it as compromised: rotate it, do not merely
  delete the line.

### 3. Make contribution and review easy and consistent

Contributors are guests; lower the cost of a good PR and keep the bar visible.

- Keep contributor docs current: how to set up, build, test, and lint, plus the
  commit and branching conventions this project uses.
- PR hygiene: one focused change per PR, a clear title and description, linked issue,
  green CI, and tests for new behavior and fixed bugs.
- Review with the same adversarial posture whether the author is a maintainer or a
  first-time contributor; be direct and kind, and explain the *why* behind a request.

### 4. Keep docs, README, and CHANGELOG true

Out-of-date docs are a bug reported by every new user.

- Update the README, examples, and API docs **in the same change** as the code they
  describe. A feature without docs is not done.
- Maintain a human-readable CHANGELOG with every release: what changed, what broke,
  and how to migrate. Users decide whether to upgrade from it.
- Examples must actually run against the released version.

### 5. Respect license and attribution

The license is a legal promise; honor it and keep it consistent.

- Where the project uses per-file license headers, add them to new files; match the
  existing style and year convention.
- Keep the LICENSE, third-party notices, and dependency licenses accurate; do not
  introduce a dependency whose license conflicts with the project's.
- Preserve existing copyright and attribution; never strip it.

### Security disclosure

Vulnerabilities in a public project put every downstream user at risk.

- Provide and follow a responsible-disclosure path (a `SECURITY.md` / private
  contact); **never** discuss an unpatched vulnerability in a public issue or PR.
- Fix privately, prepare the patched release and advisory, then disclose with credit
  and an upgrade path. Coordinate the release so users can update before details are
  public.
- A security fix is P0: it jumps the queue and ships with a clear advisory and version.
