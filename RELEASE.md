# Releasing cooud-ui

This monorepo publishes **four** packages across **two** registries:

| Package           | Name            | Registry             | Notes                                   |
| ----------------- | --------------- | -------------------- | --------------------------------------- |
| `packages/tokens` | `@cooud/tokens` | GitHub Packages      | Design tokens + CSS bridge + TW preset  |
| `packages/theme`  | `@cooud/theme`  | GitHub Packages      | Runtime theming engine (depends tokens) |
| `packages/ui`     | `@cooud/ui`     | GitHub Packages      | React components (depends theme/tokens) |
| `packages/cli`    | `cooud-ui`      | **public npm**       | shadcn-style component installer (CLI)  |

`apps/www` (showcase) is **not** published (not wired into the release workflow).

## Distribution decision (ownership & scope)

This is the agreed, intentional split:

- **Scoped libraries `@cooud/{tokens,theme,ui}` → GitHub Packages**
  (`https://npm.pkg.github.com`). GitHub Packages requires the npm **scope** to
  match the **owning org/user**, so the `@cooud` scope must be owned by a GitHub
  org named `cooud` (see "Operational prerequisites" below).
- **CLI `cooud-ui` (unscoped) → public npm** (`https://registry.npmjs.org`).
  It is deliberately **unscoped** so `npx cooud-ui@latest add button` works for
  anyone, with no auth and no `@cooud` org membership. Publishing an unscoped
  name only requires that the name `cooud-ui` is free/owned on npmjs and an
  `NPM_TOKEN` with publish rights.

> The `release.yml` workflow publishes all four packages after approval: the
> three **scoped** packages to GitHub Packages and the unscoped CLI to public npm.
> A missing `NPM_TOKEN` fails the release before any publish step runs.

## How a release works

1. Bump the `version` in each publishable `package.json` (they are versioned in lockstep at `0.x`).
2. Tag the commit with `vX.Y.Z` and push the tag:

   ```sh
   git tag v0.1.1
   git push origin v0.1.1
   ```

3. The `.github/workflows/release.yml` workflow triggers on any `v*` tag.
   **It does not publish automatically** — the `publish` job runs in the
   protected `release` GitHub Environment and **pauses for a required-reviewer
   approval** before any step executes. After approval it:
   - installs deps (`bun install --frozen-lockfile`),
   - validates that every publishable package version matches the tag,
   - validates that `NPM_TOKEN` is present for the public-npm CLI publish,
   - runs the release gates (`typecheck`, `test`, `registry:check`, `tokens:check`),
   - builds in dependency order via turbo (`bun run build`),
   - runs full package smoke (`SMOKE_FULL=1 bun run package:smoke`), which packs
     local tarballs, installs them into the Next/Vite fixtures, builds the fixtures,
     and verifies styled CSS was emitted,
   - **packs** each package to a tarball with `bun pm pack` (so `workspace:*`
     ranges are rewritten and everything below operates on the exact bytes that
     get published),
   - generates a **CycloneDX SBOM** for the workspace (archived as a build artifact),
   - emits a **build-provenance attestation** (`actions/attest-build-provenance`,
     SLSA-style) over every packed tarball, signed via OIDC,
   - uploads the tarballs + SBOM as a workflow artifact,
   - runs `npm publish <tarball>` in dependency order:
     **tokens → theme → ui → CLI**.

   The scoped packages use the workflow's built-in `GITHUB_TOKEN`
   (`packages: write`), wired into `NODE_AUTH_TOKEN`; no extra secret is needed
   for GitHub Packages. The CLI publish uses the release-environment `NPM_TOKEN`
   against `https://registry.npmjs.org` and publishes with npm provenance. The
   job also holds `id-token: write` + `attestations: write` so it can sign and
   store the provenance attestation.

> Tarball naming footgun: `@cooud/ui` and `cooud-ui` both pack to
> `cooud-ui-<version>.tgz`. The workflow writes scoped-library tarballs under
> `dist-artifacts/github/` and the public CLI tarball under `dist-artifacts/npm/`
> so publish steps cannot select the wrong artifact.

Each package also runs `prepublishOnly` (`tsc -p tsconfig.json`) as a safety net so `dist` is always rebuilt before a publish, even for manual publishes.

## `@cooud` scope vs. repo owner — how to make publishing reproducible & approved

GitHub Packages requires the **npm scope to match the hosting org/user**. The
packages are scoped `@cooud`, so the publish target must be a GitHub **org named
`cooud`** that owns the `@cooud` scope. This is a one-time **operational
prerequisite**, not a code change — once it is satisfied, every tagged release
publishes reproducibly through the approval-gated workflow.

### Prerequisite A — Host the repo under a `cooud` GitHub org (recommended)
Create a GitHub org named `cooud` and host/transfer this repo there. Then
`@cooud/*` publishes cleanly to `https://npm.pkg.github.com` under that org using
the workflow's `GITHUB_TOKEN`. No package renames, no extra secret. This is the
path the current `release.yml` is wired for.

### Prerequisite B — (alternative) Publish `@cooud/*` to public npm
If you prefer public npm instead of GitHub Packages for the scoped libs, create
an `@cooud` org on [npmjs.com](https://www.npmjs.com), then:
- set each `publishConfig.registry` to `https://registry.npmjs.org` (or drop it),
- add an `NPM_TOKEN` repo secret (scoped to the `release` environment) and pass
  it as `NODE_AUTH_TOKEN` in the publish steps,
- point `actions/setup-node` `registry-url` at `https://registry.npmjs.org`.

Either way the `@cooud` package names stay the same.

### Publishing the CLI to npm (`cooud-ui`, unscoped)
The CLI ships to **public npm** independently of the scoped libs:
- own the unscoped name `cooud-ui` on npmjs (it must be free or owned by you),
- add an `NPM_TOKEN` repo secret (scoped to the `release` environment),
- the release workflow packs + publishes the CLI tarball against
  `https://registry.npmjs.org` with that token. Because the name is unscoped and
  on the public registry, no `@cooud` org membership is required to publish or
  to `npx cooud-ui`.

The published CLI's default registry is pinned to its own release tag
(`https://raw.githubusercontent.com/pedrogbraz/cooud-ui/vX.Y.Z/registry`), not
mutable `main`. When cutting a release, bump `packages/cli/package.json` and the
CLI version constant together; the CLI unit tests fail if they drift.

## Publishing manually

Build first, then publish the **scoped libraries** to GitHub Packages with an
auth token in `NODE_AUTH_TOKEN`:

```sh
bun run build

export NODE_AUTH_TOKEN=<github-packages-token>

cd packages/tokens && npm publish && cd -
cd packages/theme  && npm publish && cd -
cd packages/ui     && npm publish && cd -
```

The repo-root `.npmrc` routes `@cooud` to GitHub Packages and reads the token
from `${NODE_AUTH_TOKEN}`.

Publish the **CLI** to public npm separately (different registry + token):

```sh
cd packages/cli
npm publish --registry https://registry.npmjs.org \
  --provenance \
  # --otp=<code> if 2FA is enabled on the npm account
cd -
```

> The CLI is unscoped (`cooud-ui`) and has no `publishConfig.registry`, so it
> defaults to public npm. Make sure you are authenticated to npmjs (e.g.
> `npm login` or an `NPM_TOKEN` in `~/.npmrc`) and **not** to GitHub Packages
> when publishing it.

## Token scopes

- **GitHub Packages** (scoped libs): a Personal Access Token (classic) with the
  **`write:packages`** scope (and `read:packages`). It must belong to an
  account/org that owns the `@cooud` scope (see the prerequisites above). In CI
  the workflow's built-in `GITHUB_TOKEN` covers this.
- **public npm** (CLI, and `@cooud/*` under Prerequisite B): an
  automation/publish token (`NPM_TOKEN`) with publish rights for the target
  name/org, stored as a repo secret scoped to the `release` environment.

## Branch & tag protection / governance

Release and supply-chain governance — branch protection, tag protection, the
`release` environment with required reviewers, CODEOWNERS, and the SHA-pinned,
attested CI/CD — is documented in **[`docs/RELEASE_GOVERNANCE.md`](docs/RELEASE_GOVERNANCE.md)**.
That doc is the source of truth for the repo-settings that the workflows assume.
