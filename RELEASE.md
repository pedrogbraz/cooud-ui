# Releasing cooud-ui

This monorepo publishes **nine** packages. They are versioned in lockstep at
`0.x` and released **locally** (GitHub Actions was removed — see
[Future / not active](#future--not-active-ci-was-removed) below).

| Package                       | Name                  | Registry                     | `publishConfig`  | Notes                                      |
| ----------------------------- | --------------------- | ---------------------------- | ---------------- | ------------------------------------------ |
| `packages/tokens`             | `@cooud-ui/tokens`    | `https://registry.npmjs.org` | `access: public` | Design tokens + CSS bridge + TW preset     |
| `packages/theme`              | `@cooud-ui/theme`     | `https://registry.npmjs.org` | `access: public` | Runtime theming engine (depends tokens)    |
| `packages/ui`                 | `@cooud-ui/ui`        | `https://registry.npmjs.org` | `access: public` | React components                           |
| `packages/stack`              | `@cooud-ui/stack`     | `https://registry.npmjs.org` | `access: public` | Stack Builder catalog/resolver/artifacts   |
| `packages/ai-kit`             | `@cooud-ui/ai-kit`    | `https://registry.npmjs.org` | `access: public` | AI assistant doctrine, skills, and configs |
| `packages/cli`                | `cooud-ui`            | `https://registry.npmjs.org` | `access: public` | shadcn-style component installer (CLI)     |
| `packages/create-cooud-app`   | `create-cooud-app`    | `https://registry.npmjs.org` | `access: public` | App scaffold CLI                           |
| `packages/create-cooud-stack` | `create-cooud-stack`  | `https://registry.npmjs.org` | `access: public` | Stack Builder scaffold CLI                 |
| `packages/mcp`                | `cooud-ui-mcp`        | `https://registry.npmjs.org` | `access: public` | MCP server for registry discovery          |

`apps/www` (showcase) is **not** published.

The release tooling is **channel-agnostic**: it never hard-codes a registry. Each
package publishes according to its own `publishConfig` — all nine use
`access: public` and default to npmjs (`https://registry.npmjs.org`), so the
registry question is decided in the `package.json` files, not in the release
script. (Point a package elsewhere by adding a `publishConfig.registry`; none do
today.)

## The release pipeline — `bun run release` (primary path)

Everything runs from your machine via [`scripts/release.mjs`](scripts/release.mjs),
wrapped by the root `release` script. It is **dry-run by default** and requires an
explicit `--publish` flag to actually push the tag and publish.

```sh
bun run release            # DRY-RUN (default): prints exactly what it would tag + publish
bun run release --publish  # really push the tag and publish the tarballs
```

In order, the script:

1. **Preflight** — asserts the git working tree is **clean** and that all nine
   publishable packages share the **same `version`**, that the `v<version>` tag
   does not already exist, and that none of the package versions already exist
   on npm.
2. **Gate** — runs, in this order:
   `typecheck` · `lint` · `test` · `registry:check` · `tokens:check` ·
   `props:check` · `build`. Any failure aborts the release.
3. **Smoke** — runs `package:smoke` (packs each package with `npm pack --dry-run`,
   validates tarball structure, validates `bun pm pack` internal dependency pins,
   and dynamically `import()`s every built JS entry offline to prove it loads).
4. **Tag** — creates an annotated git tag `v<version>` at `HEAD` and pushes it to
   `origin` before publishing, so the CLI/MCP registries that point at the raw
   GitHub tag are resolvable before any package is public (only with `--publish`;
   a dry-run just prints the tag it would cut).
5. **Publish** — for each package in dependency order
   **`@cooud-ui/tokens` → `@cooud-ui/theme` → `@cooud-ui/ui` →
   `@cooud-ui/stack` → `@cooud-ui/ai-kit` → `cooud-ui` →
   `create-cooud-app` → `create-cooud-stack` → `cooud-ui-mcp`**:
   - packs it with `bun pm pack` (this rewrites `workspace:*` ranges to the
     concrete version **and** carries each package's `publishConfig`),
   - runs `npm publish <tarball>`, which honors the tarball's embedded
     `publishConfig` — so all nine packages go to public npm (the scoped
     packages as `access: public`) with no per-package flags.

   In a dry-run this step runs `npm publish --dry-run` (validates the tarball and
   prints the target registry) and leaves the packed tarballs in
   `.release-tarballs/` for inspection. With `--publish` it publishes for real.

> **Why `bun pm pack` and not a plain `npm publish` from each package dir?** In
> this Bun workspace `npm pack`/`npm publish` ship `workspace:*` dependency
> ranges **literally**, which is unresolvable for consumers. `bun pm pack`
> rewrites them to the concrete version. `npm publish <tarball>` is then used so
> the exact, correct bytes are what gets published — while still honoring each
> package's `publishConfig` (the `access: public` on the scoped libs).

### Authentication

All nine packages publish to **public npm**, so one credential covers the whole
release. Be logged in to npmjs with publish rights for the `@cooud-ui` scope and
the unscoped package names (`cooud-ui`, `create-cooud-app`,
`create-cooud-stack`, `cooud-ui-mcp`), or have an `NPM_TOKEN` with those publish
rights in your user `~/.npmrc`. No repo-level `.npmrc` and no GitHub Packages
token are needed.

`--publish` fails loudly at the first package the registry rejects; earlier
packages in the order may already be published, so fix the auth and re-run (a
re-publish of an already-published version will error — bump the version if
needed).

## Exact release procedure

1. **Bump the version** in all nine publishable `package.json` files to the new
   `0.x` (they must match). Also bump `CLI_VERSION` in
   [`packages/cli/src/config.ts`](packages/cli/src/config.ts) to the same value —
   the CLI's default registry is pinned to its own tag
   (`https://raw.githubusercontent.com/pedrogbraz/cooud-ui/vX.Y.Z/registry`) and
   the CLI unit tests fail if `CLI_VERSION` drifts from `package.json`.
2. **Build:** `bun run build`.
3. **Gate + smoke (dry-run preflight):** `bun run release` — this runs the full
   gate, `package:smoke`, and a publish/tag dry-run. Confirm the printed plan
   lists `vX.Y.Z` and the nine packages in the same order printed by
   `scripts/release.mjs`, with the expected registries.
4. **Push tag + publish:** `bun run release --publish`. This pushes `vX.Y.Z`
   first, then publishes
   `@cooud-ui/tokens` → `@cooud-ui/theme` → `@cooud-ui/ui` →
   `@cooud-ui/stack` → `@cooud-ui/ai-kit` → `cooud-ui` →
   `create-cooud-app` → `create-cooud-stack` → `cooud-ui-mcp`.

   > `v0.1.0` already exists, so the stack-generator release line starts at
   > `v0.2.0`: all nine publishable packages must share `0.2.0`, and the
   > release cuts `v0.2.0` before any future `0.x` bump.

5. **Ensure the GitHub repo is public.** Before publishing, make
   `pedrogbraz/cooud-ui` **public** so the CLI's pinned registry
   (`raw.githubusercontent.com/pedrogbraz/cooud-ui/vX.Y.Z/registry`) is reachable
   and `npx cooud-ui add <component>` resolves component sources from the tagged
   `vX.Y.Z` registry (not mutable `main`). The release script prints this as a
   post-publish reminder — it does **not** do it for you.

> The `release` script prints a final summary plus the post-publish steps it did
> **not** do (make the repo public, cut a GitHub Release, generate SBOM /
> provenance). Keep this doc in sync with what `scripts/release.mjs` actually
> does.

## Publishing a single package by hand (fallback)

If you need to (re)publish one package outside the script, pack it with Bun first
so `workspace:*` is rewritten, then publish the tarball (it carries its own
`publishConfig`):

```sh
bun run build

# all nine go to public npm — be logged in with @cooud-ui scope and unscoped-name rights:
npm login

cd packages/tokens && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/theme  && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/ui     && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/stack  && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/ai-kit && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/cli    && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/create-cooud-app && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/create-cooud-stack && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/mcp    && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
```

Each package also runs `prepublishOnly` (`tsc -p tsconfig.json`) as a safety net,
so `dist` is rebuilt before any manual publish.

## Future / not active (CI was removed)

GitHub Actions was removed from this repo (account billing), so there is **no**
`.github/workflows/release.yml` anymore and **none** of the following runs today.
This section is retained as design intent for if/when hosted CI is restored.

When CI existed, a tagged `v*` push triggered an approval-gated `release.yml`
workflow that, after a required-reviewer approval in a protected `release`
environment, would: install with `bun install --frozen-lockfile`; validate every
publishable version against the tag; validate `NPM_TOKEN`; run the
release gates; build in dependency order; run the **full** package smoke
   (`SMOKE_FULL=1`, which packs all publishables, installs the runtime UI tarballs
   into the Next/Vite fixtures, builds them, asserts styled CSS was emitted, and
   runs the installed CLI/generator/MCP bins);
pack each package with
`bun pm pack`; generate a **CycloneDX SBOM**; emit a **build-provenance
attestation** (`actions/attest-build-provenance`, SLSA-style, OIDC-signed) over
every tarball; and `npm publish` in the same nine-package order used by
`scripts/release.mjs`.

> Tarball naming footgun (still relevant to manual packs): `@cooud-ui/ui` and
> `cooud-ui` both pack to `cooud-ui-<version>.tgz`. The local pipeline packs into
> a temporary `.release-tarballs/` one package at a time, so a stale tarball
> can't be selected by mistake.

The token scopes, branch/tag protection, the `release` environment with required
reviewers, CODEOWNERS, and the SHA-pinned, attested CI/CD are documented in
**[`docs/RELEASE_GOVERNANCE.md`](docs/RELEASE_GOVERNANCE.md)**. That doc reflects
the (now inactive) hosted-CI model; the **active** path is `bun run release`
above.
