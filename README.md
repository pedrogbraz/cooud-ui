# Cooud UI

[![@cooud-ui/ui on npm](https://img.shields.io/npm/v/@cooud-ui/ui?label=%40cooud-ui%2Fui&color=0ea5e9)](https://www.npmjs.com/package/@cooud-ui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@cooud-ui/ui?color=0ea5e9)](https://www.npmjs.com/package/@cooud-ui/ui)
[![cooud-ui CLI](https://img.shields.io/npm/v/cooud-ui?label=cooud-ui&color=0ea5e9)](https://www.npmjs.com/package/cooud-ui)
[![license](https://img.shields.io/npm/l/@cooud-ui/ui?color=0ea5e9)](LICENSE)

The Cooud design system — a themeable, accessible, shadcn-class React component
library that **is** the Cooud design language. Default theme **Aurora** (premium
sky/cyan), with **Neutral** as a first-class preset and arbitrary brand override.

> **v0.1.0** — published on npm under the `@cooud-ui` scope. Install the packages,
> or copy components in with `npx cooud-ui add`.

## Monorepo layout

```
packages/
  tokens/   @cooud-ui/tokens   — source-of-truth tokens (TS) + CSS-var bridge + Tailwind v4 @theme
  theme/    @cooud-ui/theme    — <CooudUIProvider> + useTheme (runtime theming, CSS-var only, no re-render)
  ui/       @cooud-ui/ui       — components (Radix + CVA + cn)
apps/
  www/      @cooud-ui/www      — HeroUI-style showcase + ThemeBuilder (Next.js 16)
```

### Which package do I need?

| You want…                                          | Install                                | Docs                                    |
| -------------------------------------------------- | -------------------------------------- | --------------------------------------- |
| Ready-made Cooud components                        | `@cooud-ui/ui` (+ `tokens` + `theme`)     | [packages/ui](packages/ui/README.md)    |
| Runtime theming — switch theme/mode, override tokens | `@cooud-ui/theme` (+ `tokens`)          | [packages/theme](packages/theme/README.md) |
| Just the design tokens / Tailwind preset           | `@cooud-ui/tokens`                        | [packages/tokens](packages/tokens/README.md) |
| To own the component source (copy-in, shadcn-style) | `npx cooud-ui add <component>`        | [packages/cli](packages/cli/README.md)  |

Most apps install all three library packages — `@cooud-ui/ui` renders against the
`@cooud-ui/tokens` bridge and the `@cooud-ui/theme` provider.

## Quickstart

```sh
bun install
bun run build       # turbo: tokens → theme → ui → www (next build, typechecked)
bun run www         # dev the showcase at http://localhost:4747
bun run lint        # biome
```

## Install (external consumer)

Install the three library packages from public npm (published under the `@cooud`
scope once `v0.1.0` is released — see [RELEASE.md](RELEASE.md)):

```sh
npm i @cooud-ui/ui @cooud-ui/tokens @cooud-ui/theme
# peers (provide what you don't already have):
npm i react react-dom
```

Then wire up styling. **Tailwind v4 and v3 are configured differently** — pick the
one your app uses.

### Tailwind v4 (CSS-first)

In your global stylesheet (e.g. `app/globals.css` / `src/index.css`):

```css
@import "tailwindcss";
@import "@cooud-ui/tokens/styles.css";

/* REQUIRED. Tailwind v4 does not scan node_modules by default, so the utility
   classes baked into the shipped components (dist/**/*.js) would never be
   emitted and your components would render unstyled. This @source opts the
   published package back into content detection. Adjust the relative path so it
   resolves to your node_modules from this CSS file. */
@source "../node_modules/@cooud-ui/ui/dist/**/*.js";
```

That's it — no PostCSS config beyond the standard `@tailwindcss/postcss` (or the
Vite plugin). The `@import "@cooud-ui/tokens/styles.css"` line brings in the Aurora
theme tokens and the `@theme inline` bridge that maps `bg-primary`, `rounded-lg`,
`text-fg-secondary`, `shadow-glow`, etc. onto the runtime `--cooud-*` variables.

### Tailwind v3 (config JS)

Consume the `@cooud-ui/tokens/preset` (it maps `bg-primary`, `rounded-lg`, `shadow-glow`,
… onto the `--cooud-*` variables) and add the package `dist` to `content[]` so the
component classes survive purging:

```js
// tailwind.config.js
import cooudPreset from "@cooud-ui/tokens/preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [cooudPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    // REQUIRED: keep the utilities used inside the shipped components.
    "./node_modules/@cooud-ui/ui/dist/**/*.js",
  ],
};
```

```css
/* your global stylesheet */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> **v3 does not import `@cooud-ui/tokens/styles.css`.** That file is Tailwind v4-only
> (it uses `@theme inline` / `@utility`, which the v3 PostCSS engine can't parse).
> On v3 the `--cooud-*` runtime variables are injected for you by
> `<CooudUIProvider>` from `@cooud-ui/theme` (see below) — the preset is what connects
> the utility classes to those variables.

> Why the extra `@source` (v4) / `content` (v3) entry on both paths? The components
> ship as pre-compiled JS with their Tailwind class strings inline (e.g.
> `class="inline-flex … bg-primary rounded-lg …"`). Tailwind only emits CSS for
> classes it finds while scanning content, and it skips `node_modules` unless you
> opt in. Without this line the markup is correct but **no styles are generated**.

## Using it in your app

```tsx
// layout.tsx (or your root)
import { CooudUIProvider } from "@cooud-ui/theme";
<CooudUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">{children}</CooudUIProvider>

// anywhere
import { Button, Card, Badge } from "@cooud-ui/ui";
<Button variant="gradient">Ship it</Button>
```

### Customize everything (runtime)
```tsx
const { setTheme, setMode, setOverrides } = useTheme();
setOverrides({ radius: "20px", primary: "#7c3aed", border: "..." }); // re-themes the whole subtree, no re-render
```

Two end-to-end consumer fixtures live under [`examples/`](examples/): a Next.js App
Router app (`examples/smoke-next`) and a Vite + React app (`examples/smoke-vite`).
`scripts/package-smoke.mjs` packs the real tarballs, installs them into those
fixtures, builds them, and asserts the component utility classes show up in the
compiled CSS — proof that an external install renders *styled*.

## Or copy-paste, shadcn-style (you own the code)

```sh
npx cooud-ui init                     # writes cooud-ui.json + the cn() helper
npx cooud-ui add button card dialog   # resolves deps, rewrites imports to your aliases
npx cooud-ui list                     # list registry items (alias: ls)
npx cooud-ui diff                     # show which installed components drifted
```

The registry under `registry/` is generated from the real component sources by
`packages/cli` — see [packages/cli/README.md](packages/cli/README.md). Both
distribution modes (npm package + CLI registry) share one source of truth.

## Publishing

The three library packages (`@cooud-ui/tokens`, `@cooud-ui/theme`, `@cooud-ui/ui`) are
publish-ready for public npm under the `@cooud` scope (with `access: public`) — see
[RELEASE.md](RELEASE.md). Nothing is published yet; tag `vX.Y.Z` to cut the release
via `bun run release --publish`. (Note: a real publish needs the `@cooud` org on
npmjs and the publisher logged in to it with `npm login`.)

## Components

**Wave 0 — foundation:** Button · Input · Label · Badge · Card (+ Header/Title/
Description/Action/Content/Footer) · Separator · Skeleton · Spinner.

**Wave 1 — forms:** Textarea · Checkbox · Switch · RadioGroup · Select (composable)
· Slider · Toggle · ToggleGroup · Field · Form (react-hook-form + zod) · InputOTP ·
FileDropzone.

**Wave 2 — overlays & navigation:** Dialog · Sheet · AlertDialog · DropdownMenu ·
Popover · HoverCard · Tooltip · Tabs · Accordion · Drawer (vaul) · Toast (sonner) ·
Command palette (cmdk, ⌘K).

**Wave 3 — data & display:** Table · DataTable (TanStack) · Pagination · Avatar ·
Progress · ScrollArea · Calendar · DatePicker · Chart (Recharts) · Empty · Metric ·
Kbd · Breadcrumb.

**Wave 4 — premium & brand:** GlassCard · GradientBorder · GradientText ·
SpotlightCard · AuroraBackground · Shimmer · AnimatedButton (motion) · Reveal ·
LogoCarousel · motion presets. The premium Aurora layer (glass, gradients,
springs, scroll reveals, rotating brand surfaces).

## Conventions
See `CONTRACT.md` — semantic tokens only, CVA variants, `forwardRef`, `data-slot`,
`focus-visible` rings, no raw colors. This is what keeps the library re-themeable.

## Roadmap
~~Wave 1 (forms)~~ ✅ → ~~Wave 2 (overlays/nav)~~ ✅ → ~~Wave 3 (data)~~ ✅ → ~~Wave 4 (premium/brand)~~ ✅ →
`cooud-ui` CLI registry (`npx cooud-ui add`) → publish to public npm under `@cooud`
→ migrate `dashboard` first. Full plan in the SDD.
