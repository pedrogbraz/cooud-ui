# Contributing to Cooud UI

Thanks for helping build Cooud UI. This guide covers the dev setup, the quality
gates every change must pass, and what we expect from PRs.

## Prerequisites

- [Bun](https://bun.sh) `1.3.14` (the repo's package manager — see `packageManager` in `package.json`)
- Node.js `>= 20`

## Setup

```sh
git clone https://github.com/pedrogbraz/cooud-ui.git
cd cooud-ui
bun install
bun run build        # turbo builds every package + the showcase app
bun run www          # showcase dev server → http://localhost:4747
```

The monorepo layout: publishable packages live in `packages/*`
(`ui`, `tokens`, `theme`, `stack`, `cli`, `mcp`, `ai-kit`, `create-cooud-app`,
`create-cooud-stack`), the showcase/docs app is `apps/www`, and the CLI's
component registry is generated into `registry/`.

## Quality gates

CI (`.github/workflows/ci.yml`) runs the full battery on every PR — the same
scripts you can run locally. A PR must be green on all of them:

```sh
bun run build                       # turbo build of all packages + www
bun run lint                        # biome check .
bun run typecheck                   # tsc across the workspaces
bun run test                        # vitest unit tests
bun run registry:check              # CLI registry in sync with packages/ui
bun run tokens:check                # generated token CSS in sync with tokens.ts
bun run props:check                 # docs Props tables in sync with the source
bun run check:example-sections      # docs example sections in sync
BUNDLE_CHECK_STRICT=1 bun run bundle:check   # www bundle-size budgets
```

Browser gates (run against the **built** app, so `bun run build` first):

```sh
bunx playwright install chromium    # once
bun run test:a11y                   # axe-core scans of the core routes
bun run test:e2e                    # behavioral flows
```

## Writing or changing a component

Read [`CONTRACT.md`](./CONTRACT.md) first — it is the authoring contract and
CI enforces most of it. The short version:

- **Semantic tokens only.** Never raw Tailwind colors or hex values; use the
  `--cooud-*`-backed utilities (`bg-surface-raised`, `text-fg-secondary`, ...).
- Variants via **CVA**, exported alongside the component.
- **`forwardRef`** on interactive elements, `data-slot="<name>"` on the root.
- Accessibility is non-negotiable: real semantics, the shared focus-ring
  pattern, `aria-*` where relevant.
- Export `XProps` types; no `"use client"` on server-safe leaf components.

A new component also needs:

1. An entry in `apps/www/lib/components-index.ts` (drives the sidebar, the
   overview grid, and static params).
2. Live examples in `apps/www/lib/examples/`.
3. Regenerated artifacts (see below).

## Regenerating artifacts

Generated files are committed; the `*:check` gates fail if they drift.

```sh
bun run -F cooud-ui registry            # rebuild the CLI registry from packages/ui
bun run -F @cooud-ui/tokens tokens:generate   # rebuild token CSS from tokens.ts
bun run -F @cooud-ui/www props          # rebuild the docs Props tables
```

## Commit style

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(ui): add SplitButton
fix(www): correct Combobox example section
docs: clarify theming overrides
chore(ci): bump playwright
```

Common scopes: `ui`, `tokens`, `theme`, `stack`, `cli`, `mcp`, `www`, `ci`.

## Pull requests

- Keep PRs small and focused — one concern per PR.
- Explain **what** changed and **why** in the description.
- Visual changes (components, blocks, showcase pages) need before/after
  screenshots.
- All CI gates above must be green; run the battery locally before pushing.
- New behavior needs tests (vitest for logic, Playwright for flows/a11y where
  it applies).

For bugs and feature ideas, use the issue templates. For security issues,
follow [`.github/SECURITY.md`](./.github/SECURITY.md) — do not open a public
issue.

## License

By contributing you agree that your contributions are licensed under the
repository's [MIT License](./LICENSE).
