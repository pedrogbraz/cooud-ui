# Releasing cooud-ui

This monorepo publishes three library packages:

| Package         | Name             | Notes                                   |
| --------------- | ---------------- | --------------------------------------- |
| `packages/tokens` | `@cooud/tokens` | Design tokens + CSS bridge + TW preset  |
| `packages/theme`  | `@cooud/theme`  | Runtime theming engine (depends tokens) |
| `packages/ui`     | `@cooud/ui`     | React components (depends theme/tokens) |

`apps/www` (showcase) and `packages/cli` are **not** published (`"private": true` / not wired into the release workflow).

Target registry: **GitHub Packages** — `https://npm.pkg.github.com`.

## How a release works

1. Bump the `version` in each publishable `package.json` (they are versioned in lockstep at `0.x`).
2. Tag the commit with `vX.Y.Z` and push the tag:

   ```sh
   git tag v0.1.1
   git push origin v0.1.1
   ```

3. The `.github/workflows/release.yml` workflow triggers on any `v*` tag. It:
   - installs deps (`bun install --frozen-lockfile`),
   - builds in dependency order via turbo (`bun run build` → tokens → theme → ui),
   - runs `npm publish` from each package dir in order: **tokens → theme → ui**.

   Auth uses the workflow's built-in `GITHUB_TOKEN` (`packages: write` permission), wired into `NODE_AUTH_TOKEN`. No extra secret is needed for GitHub Packages.

Each package also runs `prepublishOnly` (`tsc -p tsconfig.json`) as a safety net so `dist` is always rebuilt before a publish, even for manual publishes.

## ⚠️ Known caveat: the `@cooud` scope vs. the repo owner

GitHub Packages requires the **npm scope to match the hosting org/user**. This repo currently lives at `github.com/pedrogbraz/cooud-ui` (a personal account), but the packages are scoped `@cooud`. As-is, a *real* publish to GitHub Packages will be **rejected** because `@cooud` ≠ `pedrogbraz`.

The `@cooud` names are kept intentionally as the intended brand. To actually publish, pick one of:

### Option A — Move the repo under a `cooud` / `cooudmaster` GitHub org (recommended)
Create a GitHub org named `cooud` (or `cooudmaster`), transfer/host this repo there. Then `@cooud/*` packages publish cleanly to `https://npm.pkg.github.com` under that org, using the workflow's `GITHUB_TOKEN`. No package renames required.

### Option B — Publish to the public npm registry under an `@cooud` org
Create an `@cooud` org on [npmjs.com](https://www.npmjs.com), then:
- change each `publishConfig.registry` to `https://registry.npmjs.org` (or drop it),
- add an `NPM_TOKEN` repo secret and pass it as `NODE_AUTH_TOKEN` in the release workflow,
- point `actions/setup-node` `registry-url` at `https://registry.npmjs.org`.

Either way the `@cooud` package names stay the same.

## Publishing manually

Build first, then publish each package from its directory with an auth token in `NODE_AUTH_TOKEN`:

```sh
bun run build

export NODE_AUTH_TOKEN=<your-token>

cd packages/tokens && npm publish && cd -
cd packages/theme  && npm publish && cd -
cd packages/ui     && npm publish && cd -
```

The repo-root `.npmrc` already routes `@cooud` to GitHub Packages and reads the token from `${NODE_AUTH_TOKEN}`.

## Token scopes

- **GitHub Packages**: a Personal Access Token (classic) with the **`write:packages`** scope (and `read:packages`). It must belong to an account/org that owns the `@cooud` scope (see caveat above).
- **npmjs (Option B)**: an automation/publish token for the `@cooud` org.
