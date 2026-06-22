# Release & Supply-Chain Governance

This document is the source of truth for the **repository settings** the CI/CD
workflows assume. The workflows enforce what they can in YAML; the rest
(branch protection, tag protection, required reviewers) must be configured in
**GitHub repo settings** by an admin. Until those settings exist, the policies
below are advisory.

Related files:

- `.github/workflows/ci.yml` — quality gates on every PR/push to `main`.
- `.github/workflows/release.yml` — approval-gated publish on `v*` tags.
- `.github/CODEOWNERS` — required reviewers per area.
- `RELEASE.md` — what gets published, where, and how to publish manually.

---

## 1. Supply-chain hardening (already enforced in YAML)

### Pinned, reproducible toolchain

- **Bun is pinned** to `1.3.14` in both workflows — the same version as
  `packageManager` in the root `package.json`. CI must never use `bun-version:
  latest` (non-reproducible).
- **Every GitHub Action is pinned by full commit SHA**, not by a mutable tag.
  A mutable tag (e.g. `@v4`) can be silently re-pointed at malicious code; a
  SHA cannot. Each pin carries a trailing `# vX.Y.Z` comment for readability.

Current action pins:

| Action                                | SHA                                        | Tag      |
| ------------------------------------- | ------------------------------------------ | -------- |
| `actions/checkout`                    | `11bd71901bbe5b1630ceea73d27597364c9af683` | v4.2.2   |
| `oven-sh/setup-bun`                   | `735343b667d3e6f658f44d0eca948eb6282f2b76` | v2.0.2   |
| `actions/setup-node`                  | `39370e3970a6d050c480ffad4ff0ed4d3fdee5af` | v4.1.0   |
| `anchore/sbom-action`                 | `e22c389904149dbc22b58101806040fa8d37a610` | v0.24.0  |
| `actions/attest-build-provenance`     | `ef244123eb79f2f7a7e75d99086184180e6d0018` | v1.4.4   |
| `actions/upload-artifact`             | `ea165f8d65b6e75b540449e92b4886f43607fa02` | v4.6.2   |

> **Updating a pin:** bump the SHA *and* the comment together. Resolve a tag to
> its SHA with `gh api repos/<owner>/<repo>/git/refs/tags/<tag> --jq '.object.sha'`
> (deref annotated tags via `git/tags/<sha>`). Prefer Dependabot's
> `package-ecosystem: github-actions` to keep pins current with PRs.

### Least-privilege permissions

- Both workflows declare `permissions: contents: read` at the **workflow top
  level**, dropping the default broad token scope.
- The `release.yml` `publish` job widens to exactly what it needs:
  `packages: write` (publish), `id-token: write` (OIDC for attestation),
  `attestations: write` (store the attestation). Nothing more.

### Provenance & SBOM

The release job **packs first, then attests, then publishes the same bytes**:

1. `npm pack` each scoped package into `dist-artifacts/*.tgz`.
2. `anchore/sbom-action` writes a CycloneDX SBOM (`sbom.cyclonedx.json`).
3. `actions/attest-build-provenance` signs a SLSA-style provenance attestation
   over each tarball via OIDC (no long-lived signing key).
4. `npm publish <tarball>` ships the attested bytes.

Consumers can verify provenance with:

```sh
gh attestation verify <tarball-or-oci-ref> --owner cooud
```

---

## 2. CI quality gates (`ci.yml`)

On every PR and every push to `main`, the `build` job runs these steps **in
order**; any failure (except `audit`) blocks the merge:

1. `typecheck`
2. `lint`
3. `test`
4. `registry:check` — the CLI registry is in sync with source.
5. `tokens:check` — generated tokens match their source of truth.
6. `package:smoke` — consumer fixtures (`examples/smoke-next/`,
   `examples/smoke-vite/`) resolve the published subpath exports.
7. `build`
8. `audit` — dependency vulnerability scan. **Currently non-blocking**
   (`continue-on-error: true`). The runtime PostCSS advisory is resolved
   (`overrides: { postcss: ">=8.5.10" }`); the only remaining advisories are
   dev-server bugs in `vite`/`esbuild` pulled transitively by `vitest` —
   never reached by `vitest run` in CI and never shipped to consumers.

> **Make `audit` a hard gate** once the dev-only `vite`/`esbuild` advisories
> clear upstream: remove `continue-on-error: true` from the Audit step in
> `ci.yml`. Track the advisories here and flip the gate in the same PR that
> clears them.

All gate steps invoke **root `package.json` scripts** by name (`bun run <name>`),
so the gate definition lives with the code, not hard-coded in YAML.

---

## 3. Branch protection — `main`

Configure in **Settings → Branches → Branch protection rules** for `main`:

- **Require a pull request before merging.**
  - Require approvals: **at least 1**.
  - **Require review from Code Owners** (activates `.github/CODEOWNERS`).
  - Dismiss stale approvals when new commits are pushed.
- **Require status checks to pass before merging**, and **require branches to be
  up to date**. Required check: the CI **`build`** job
  (typecheck → lint → test → registry:check → tokens:check → package:smoke →
  build). `audit` is intentionally **not** required until the dev-only
  `vite`/`esbuild` advisories clear.
- **Require linear history** (no merge commits → clean, bisectable `main`).
- **Require signed commits** (recommended).
- **Do not allow force pushes**; **do not allow deletions**.
- **Include administrators** (no bypass) — recommended once the org is stable.

> CODEOWNERS only becomes a *merge gate* when "Require review from Code Owners"
> is enabled here. Without it, owners are merely auto-requested.

---

## 4. Tag protection — `v*`

Tags are the **only** trigger for `release.yml`, so they are a privileged,
publish-causing surface and must be locked down.

Configure in **Settings → Tags → Tag protection rules**:

- Add a protection rule for the pattern **`v*`**. Only repo admins (or a
  designated release team) may create/push/delete `v*` tags. This prevents an
  arbitrary contributor from triggering a publish by pushing a tag.

Combined with the `release` environment (below), this gives **two independent
gates** before any package is published: who can create the tag, and who must
approve the deployment.

---

## 5. The `release` environment (manual approval gate)

The `publish` job runs in `environment: name: release`. Configure in
**Settings → Environments → `release`**:

- **Required reviewers:** add the release approver(s) / team. The publish job
  **pauses** after the tag triggers it and runs **nothing** until a required
  reviewer approves the deployment. This is the hard "no publish without
  approval" gate the workflow relies on.
- **Deployment branches and tags:** restrict to **`v*` tags only**
  (Selected branches and tags → add tag rule `v*`). The release job must never
  run from an arbitrary branch.
- **Environment secrets:** store publish secrets here so they are only exposed
  to the approved `release` deployment, never to PR/CI runs:
  - `NPM_TOKEN` — for the public-npm CLI (`cooud-ui`) and, under
    `RELEASE.md` "Prerequisite B", the scoped libs on npmjs.
  - (GitHub Packages uses the built-in `GITHUB_TOKEN`; no secret needed.)
- **Wait timer (optional):** a short delay gives a window to cancel a bad release.

---

## 6. Operational prerequisites for the owner (one-time)

These are **not** code changes — they are account/settings actions that must
exist for releases to be reproducible **and** approved:

1. **Create a GitHub org `cooud`** and host/transfer this repo there so the
   `@cooud` scope matches the owner; otherwise GitHub Packages publishes are
   rejected. (See `RELEASE.md` → "Prerequisite A".)
2. **Own the unscoped npm name `cooud-ui`** on npmjs for the CLI, and add an
   `NPM_TOKEN` as a `release`-environment secret.
3. **Enable** the branch protection (§3), tag protection (§4), and `release`
   environment with required reviewers (§5) described above.
4. **Replace the placeholder owners** in `.github/CODEOWNERS` (`@pedrogbraz`)
   with the real `cooud` org teams/handles once the org exists.
5. **Clear the remaining dev-only `vite`/`esbuild` advisories** (bump `vitest`
   when upstream ships a fix), then make `audit` a blocking gate in `ci.yml` (§2).

Until §1–§3 are done, the workflows are correct but a real publish will not
succeed end-to-end; this is an ops gap, not a workflow bug.
