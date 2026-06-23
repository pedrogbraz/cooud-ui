# smoke-next

A minimal **external-consumer** fixture: a Next.js (App Router) app that imports
`@cooud-ui/ui` + `@cooud-ui/tokens` + `@cooud-ui/theme` exactly as a real consumer would,
and proves the published components render **styled** on Tailwind v4.

This is not a workspace package — `@cooud-ui/*` are intentionally **absent** from
`dependencies`. The smoke runner injects them as locally-packed tarballs so the
test exercises the *published* artifact, never the workspace source.

## What it demonstrates

- `app/globals.css` wires Tailwind v4 the way an external app must:
  ```css
  @import "tailwindcss";
  @import "@cooud-ui/tokens/styles.css";
  @source "../node_modules/@cooud-ui/ui/dist/**/*.js"; /* REQUIRED */
  ```
  The `@source` line is what makes Tailwind scan the shipped components (it skips
  `node_modules` by default), so their utility classes are emitted.
- `app/layout.tsx` mounts `<CooudUIProvider>` (Aurora / dark).
- `app/page.tsx` renders `<Button>` + `<Card>` from `@cooud-ui/ui`.

## Run it via the smoke runner (recommended)

From the repo root:

```sh
SMOKE_FULL=1 node scripts/package-smoke.mjs
```

That packs the tarballs, installs them here, runs `next build`, and asserts the
compiled CSS contains the component utility classes.

## Run it manually

```sh
# from the repo root, after `bun run build`:
npm pack ./packages/ui ./packages/tokens ./packages/theme --pack-destination /tmp/cooud
cd examples/smoke-next
npm install /tmp/cooud/cooud-ui-*.tgz /tmp/cooud/cooud-tokens-*.tgz /tmp/cooud/cooud-theme-*.tgz
npm run build   # or: npm run dev
```
