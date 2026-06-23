# Releasing cooud-ui

This monorepo publishes **four** packages. They are versioned in lockstep at
`0.x` and released **locally** (GitHub Actions was removed — see
[Future / not active](#future--not-active-ci-was-removed) below).

| Package           | Name            | Registry                          | `publishConfig`     | Notes                                   |
| ----------------- | --------------- | --------------------------------- | ------------------- | --------------------------------------- |
| `packages/tokens` | `@cooud-ui/tokens` | `https://registry.npmjs.org`      | `access: public`    | Design tokens + CSS bridge + TW preset  |
| `packages/theme`  | `@cooud-ui/theme`  | `https://registry.npmjs.org`      | `access: public`    | Runtime theming engine (depends tokens) |
| `packages/ui`     | `@cooud-ui/ui`     | `https://registry.npmjs.org`      | `access: public`    | React components (depends theme/tokens) |
| `packages/cli`    | `cooud-ui`      | `https://registry.npmjs.org`      | `access: public`    | shadcn-style component installer (CLI)  |

`apps/www` (showcase) is **not** published.

The release tooling is **channel-agnostic**: it never hard-codes a registry. Each
package publishes according to its own `publishConfig` — all four use
`access: public` and default to npmjs (`https://registry.npmjs.org`), so the
registry question is decided in the `package.json` files, not in the release
script. (Point a package elsewhere by adding a `publishConfig.registry`; none do
today.)

## The release pipeline — `bun run release` (primary path)

Everything runs from your machine via [`scripts/release.mjs`](scripts/release.mjs),
wrapped by the root `release` script. It is **dry-run by default** and requires an
explicit `--publish` flag to actually publish and tag.

```sh
bun run release            # DRY-RUN (default): prints exactly what it would publish + tag
bun run release --publish  # really publish the tarballs and push the tag
```

In order, the script:

1. **Preflight** — asserts the git working tree is **clean** and that all four
   publishable packages share the **same `version`**, and that the `v<version>`
   tag does not already exist.
2. **Gate** — runs, in this order:
   `typecheck` · `lint` · `test` · `registry:check` · `tokens:check` ·
   `props:check` · `build`. Any failure aborts the release.
3. **Smoke** — runs `package:smoke` (packs each package with `npm pack --dry-run`,
   validates the tarball structure, and dynamically `import()`s every built main
   entry offline to prove it loads).
4. **Publish** — for each package in dependency order
   **tokens → theme → ui → cli**:
   - packs it with `bun pm pack` (this rewrites `workspace:*` ranges to the
     concrete version **and** carries each package's `publishConfig`),
   - runs `npm publish <tarball>`, which honors the tarball's embedded
     `publishConfig` — so all four packages go to public npm (the scoped libs as
     `access: public`) with no per-package flags.

   In a dry-run this step runs `npm publish --dry-run` (validates the tarball and
   prints the target registry) and leaves the packed tarballs in
   `.release-tarballs/` for inspection. With `--publish` it publishes for real.
5. **Tag** — creates an annotated git tag `v<version>` at `HEAD` and pushes it to
   `origin` (only with `--publish`; a dry-run just prints the tag it would cut).

> **Why `bun pm pack` and not a plain `npm publish` from each package dir?** In
> this Bun workspace `npm pack`/`npm publish` ship `workspace:*` dependency
> ranges **literally**, which is unresolvable for consumers. `bun pm pack`
> rewrites them to the concrete version. `npm publish <tarball>` is then used so
> the exact, correct bytes are what gets published — while still honoring each
> package's `publishConfig` (the `access: public` on the scoped libs).

### Authentication

All four packages publish to **public npm**, so one credential covers the whole
release. Be logged in to npmjs as a member of the `@cooud` org with publish
rights (`npm login`), or have an `NPM_TOKEN` with publish rights in your user
`~/.npmrc`. No repo-level `.npmrc` and no GitHub Packages token are needed —
publishing the scoped `@cooud-ui/*` libs requires only that you belong to the
`@cooud` org on npmjs.

`--publish` fails loudly at the first package the registry rejects; earlier
packages in the order may already be published, so fix the auth and re-run (a
re-publish of an already-published version will error — bump the version if
needed).

## Exact release procedure

1. **Bump the version** in all four publishable `package.json` files to the new
   `0.x` (they must match). Also bump `CLI_VERSION` in
   [`packages/cli/src/config.ts`](packages/cli/src/config.ts) to the same value —
   the CLI's default registry is pinned to its own tag
   (`https://raw.githubusercontent.com/pedrogbraz/cooud-ui/vX.Y.Z/registry`) and
   the CLI unit tests fail if `CLI_VERSION` drifts from `package.json`.
2. **Build:** `bun run build`.
3. **Gate + smoke (dry-run preflight):** `bun run release` — this runs the full
   gate, `package:smoke`, and a publish/tag dry-run. Confirm the printed plan
   lists `vX.Y.Z` and the four packages in the order tokens → theme → ui → cli
   with the expected registries.
4. **Publish + tag:** `bun run release --publish`. This publishes
   tokens → theme → ui → cli and tags + pushes `vX.Y.Z`.

   > For the very first release this tags `v0.1.0` and publishes
   > `@cooud-ui/tokens@0.1.0`, `@cooud-ui/theme@0.1.0`, `@cooud-ui/ui@0.1.0`, and
   > `cooud-ui@0.1.0`.

5. **Make the GitHub repo public.** After publishing, make
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

# all four go to public npm — be logged in to the @cooud org on npmjs:
npm login

cd packages/tokens && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/theme  && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/ui     && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
cd packages/cli    && bun pm pack && npm publish ./*.tgz && rm ./*.tgz && cd -
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
publishable version against the tag; validate `NPM_TOKEN` for the CLI; run the
release gates; build in dependency order; run the **full** package smoke
(`SMOKE_FULL=1`, which installs the packed tarballs into the Next/Vite fixtures,
builds them, and asserts styled CSS was emitted); pack each package with
`bun pm pack`; generate a **CycloneDX SBOM**; emit a **build-provenance
attestation** (`actions/attest-build-provenance`, SLSA-style, OIDC-signed) over
every tarball; and `npm publish` in the order tokens → theme → ui → cli.

> Tarball naming footgun (still relevant to manual packs): `@cooud-ui/ui` and
> `cooud-ui` both pack to `cooud-ui-<version>.tgz`. The local pipeline packs into
> a temporary `.release-tarballs/` one package at a time, so a stale tarball
> can't be selected by mistake.

The token scopes, branch/tag protection, the `release` environment with required
reviewers, CODEOWNERS, and the SHA-pinned, attested CI/CD are documented in
**[`docs/RELEASE_GOVERNANCE.md`](docs/RELEASE_GOVERNANCE.md)**. That doc reflects
the (now inactive) hosted-CI model; the **active** path is `bun run release`
above.
