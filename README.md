# Cooud UI

[![@cooud-ui/ui on npm](https://img.shields.io/npm/v/@cooud-ui/ui?label=%40cooud-ui%2Fui&color=0ea5e9)](https://www.npmjs.com/package/@cooud-ui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@cooud-ui/ui?color=0ea5e9)](https://www.npmjs.com/package/@cooud-ui/ui)
[![cooud-ui CLI](https://img.shields.io/npm/v/cooud-ui?label=cooud-ui&color=0ea5e9)](https://www.npmjs.com/package/cooud-ui)
[![license](https://img.shields.io/npm/l/@cooud-ui/ui?color=0ea5e9)](LICENSE)

The Cooud design system — a themeable, accessible, shadcn-class React component
library that **is** the Cooud design language. Default theme **Aurora** (premium
sky/cyan), with **Neutral** as a first-class preset and arbitrary brand override.

> **v0.4.0 working release** — the app-generator line: `cooud-ui compose` and
> `create-cooud-app --template store|landing` build a full multi-page app from
> validated blocks, plus a generated `registry/meta.json` and metadata-aware MCP tools.

## Monorepo layout

```
packages/
  tokens/   @cooud-ui/tokens   — source-of-truth tokens (TS) + CSS-var bridge + Tailwind v4 @theme
  theme/    @cooud-ui/theme    — <CooudUIProvider> + useTheme (runtime theming, CSS-var only, no re-render)
  ui/       @cooud-ui/ui       — components (Radix + CVA + cn)
  stack/    @cooud-ui/stack    — Stack Builder catalog, resolver, schema, KICKOFF artifacts
  ai-kit/   @cooud-ui/ai-kit   — assistant doctrine, skills, and config templates
  cli/      cooud-ui           — shadcn-style component installer
  create-cooud-app/ create-cooud-app      — Next.js + Cooud UI app scaffold
  create-cooud-stack/ create-cooud-stack  — Stack Builder scaffold generator
  mcp/      cooud-ui-mcp       — MCP server for registry discovery
apps/
  www/      @cooud-ui/www      — HeroUI-style showcase + ThemeBuilder (Next.js 16)
```

### Which package do I need?

| You want…                                          | Install                                | Docs                                    |
| -------------------------------------------------- | -------------------------------------- | --------------------------------------- |
| Ready-made Cooud components                        | `@cooud-ui/ui` (+ `tokens` + `theme`)     | [packages/ui](packages/ui/README.md)    |
| Runtime theming — switch theme/mode, override tokens | `@cooud-ui/theme` (+ `tokens`)          | [packages/theme](packages/theme/README.md) |
| Just the design tokens / Tailwind preset           | `@cooud-ui/tokens`                        | [packages/tokens](packages/tokens/README.md) |
| Stack Builder core artifacts                       | `@cooud-ui/stack`                         | [packages/stack](packages/stack/README.md) |
| AI assistant doctrine, skills, and rules           | `@cooud-ui/ai-kit`                        | [packages/ai-kit](packages/ai-kit/README.md) |
| To own the component source (copy-in, shadcn-style) | `npx cooud-ui add <component>`        | [packages/cli](packages/cli/README.md)  |
| To scaffold a new app                              | `npx create-cooud-app my-app`             | [packages/create-cooud-app](packages/create-cooud-app/README.md) |
| To scaffold a runnable default stack + KICKOFF     | `bun create cooud-stack@latest my-app`    | [packages/create-cooud-stack](packages/create-cooud-stack/README.md) |
| To expose the registry through MCP                 | `npx cooud-ui-mcp`                        | [packages/mcp](packages/mcp/README.md) |

Most apps install all three library packages — `@cooud-ui/ui` renders against the
`@cooud-ui/tokens` bridge and the `@cooud-ui/theme` provider.

## Quickstart

```sh
bun install
bun run build       # turbo: builds all packages and the docs app
bun run www         # dev the showcase at http://localhost:4747
bun run lint        # biome
```

## Install (external consumer)

Install the three runtime library packages from public npm (published under the
`@cooud-ui` scope — see [RELEASE.md](RELEASE.md)):

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
`bun run package:smoke` validates package shape, built imports, and the real
release packer's internal dependency pins. `SMOKE_FULL=1 bun run package:smoke`
also packs tarballs, installs the runtime UI packages into those fixtures, builds
them, and asserts the component utility classes show up in the compiled CSS —
proof that an external install renders *styled*.

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

Nine packages publish to public npm in lockstep from `v0.2.0` onward:
`@cooud-ui/tokens`,
`@cooud-ui/theme`, `@cooud-ui/ui`, `@cooud-ui/stack`, `@cooud-ui/ai-kit`,
`cooud-ui`, `create-cooud-app`, `create-cooud-stack`, and `cooud-ui-mcp` (all
with `access: public`) — see [RELEASE.md](RELEASE.md). Run `bun run release` for
the default dry-run, and only run `bun run release --publish` when you intend to
publish and tag. A real publish needs npm rights for the `@cooud-ui` scope and
the unscoped package names.

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
`cooud-ui` CLI registry (`npx cooud-ui add`) + `create-cooud-stack` generator → publish the scoped and unscoped packages to public npm
→ migrate `dashboard` first. Full plan in the SDD.
