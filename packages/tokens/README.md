# @cooud-ui/tokens

The Cooud design tokens — the single source of truth for color, typography,
elevation, and shape across the Cooud UI system.

Tokens are authored once in TypeScript and compiled to consumable artifacts: a
**CSS variable bridge** for Tailwind v4, a **preset** for Tailwind v3, and
machine-readable token JSON — including [design-tool formats](#design-tool-handoff)
(W3C DTCG + Figma Variables). Every
`@cooud-ui/ui` component renders against these tokens through semantic utilities
(`bg-primary`, `text-fg-secondary`, `rounded-lg`, `shadow-glow`), so a single
token change re-themes the whole library — at build time or at runtime.

You need this package if you use `@cooud-ui/ui` or `@cooud-ui/theme`, or if you want the
Cooud color/typography/elevation scale in your own components.

## Install

> Published on npm under the `@cooud-ui` scope.

```sh
# npm
npm i @cooud-ui/tokens
# pnpm
pnpm add @cooud-ui/tokens
# bun
bun add @cooud-ui/tokens
```

No peer dependencies — the package is framework-agnostic.

## Usage

The token system has two layers: a **runtime layer** of `--cooud-*` CSS custom
properties (one block per theme/mode), and a **bridge** that maps Tailwind
utilities onto those variables. Wire it up the way your Tailwind version expects.

### Tailwind v4 (CSS-first)

Import the stylesheet after Tailwind in your global CSS. This brings in the
default **Aurora** theme tokens and the `@theme inline` bridge.

```css
@import "tailwindcss";
@import "@cooud-ui/tokens/styles.css";
```

### Tailwind v3 (config preset)

Import the preset in your config. It maps the same semantic utilities onto the
`--cooud-*` variables.

```js
// tailwind.config.js
import cooudPreset from "@cooud-ui/tokens/preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [cooudPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

> On v3, do **not** import `@cooud-ui/tokens/styles.css` — it uses Tailwind v4-only
> syntax. The `--cooud-*` variables are instead injected at runtime by
> `<CooudUIProvider>` from `@cooud-ui/theme`; the preset connects the utilities to
> those variables.

### Programmatic access (TypeScript)

The TS export is the canonical token data, used by tooling and by `@cooud-ui/theme`
to apply runtime overrides. Components never read these objects directly.

```ts
import { themes, tokensToCssVars, serializeOverrides } from "@cooud-ui/tokens";
import type { ThemeName, Mode, ThemeTokens, ThemeOverrides } from "@cooud-ui/tokens";

themes.aurora.dark.primary; // "oklch(0.685 0.169 237.3)"

// Turn a (partial) token set into a { "--cooud-*": value } style object:
const style = tokensToCssVars({ radius: "20px", primary: "#7c3aed" });

// Or render overrides as a copy-pasteable CSS block:
serializeOverrides({ radius: "20px" }, ":root");
```

Exports: `themes`, `themeNames`, `modes`, `defaultTheme`, `defaultMode`,
`cssVarMap`, `tokensToCssVars`, `serializeOverrides`, and the types `ThemeName`,
`Mode`, `ThemeTokens`, `ThemeOverrides`. The raw token map is also published as
`@cooud-ui/tokens/tokens.json`, alongside the two design-tool artifacts
described below.

## The token system

- **Color** is authored in [OKLCH](https://oklch.com/) for perceptually even
  ramps and predictable contrast — brand (`primary`, `accent`), surfaces
  (`surface-base` → `surface-floating`), foreground (`fg` → `fg-muted`), lines
  (`border`, `ring`), semantic (`success`, `warning`, `error`, `info`), and a
  five-color chart palette.
- **Typography**, **shape** (`radius`), and **elevation** (`shadow-xs` →
  `shadow-glow`) are tokens too, so they move with the theme.
- Five built-in themes — **Aurora** (the default; premium sky/cyan),
  **Neutral**, and the brand presets **Midnight**, **Sunset**, and **Emerald** —
  each with `light` and `dark` modes.

The generated artifacts (`styles/tokens.json`, `styles/tokens.dtcg.json`,
`styles/figma-variables.json`, `preset/`) are checked in, and the hand-authored
`styles/tokens.css` is drift-checked against the TS source. After editing
`src/tokens.ts`, regenerate with `tokens:generate`; verify everything is in
sync with `tokens:check`.

## Design tool handoff

Two generated artifacts bridge the tokens into design tools. Both are emitted
by `tokens:generate` next to `tokens.json`, drift-checked by `tokens:check`,
and shipped with the package:

- **`@cooud-ui/tokens/tokens.dtcg.json`** — the tokens in the
  [W3C Design Tokens (DTCG) format](https://design-tokens.github.io/community-group/format/),
  for token pipelines such as Style Dictionary or Tokens Studio. Tokens are
  grouped `cooud.{theme}.{mode}.{token}` (e.g. `cooud.aurora.dark.primary`).
  Color `$value`s are the source-of-truth CSS color strings (mostly `oklch()`,
  some with an alpha channel) kept verbatim rather than converted, so nothing
  is lost — convert downstream if a tool needs hex. Shadows are structured
  DTCG shadow objects, font stacks are family arrays, radius is a dimension.
- **`@cooud-ui/tokens/figma-variables.json`** — a pragmatic import shape for
  Figma Variables plugins and the Figma Variables REST API: one collection
  (`Cooud UI`) with ten modes (`{theme}-{mode}`, e.g. `aurora-dark`) and one
  variable per token, grouped by slash-prefix (`color/primary`, `font/sans`,
  `shadow/glow`, `radius`). Colors are converted from `oklch()` to sRGB hex
  (`#rrggbb`, or `#rrggbbaa` when the token carries alpha) and clamped to the
  sRGB gamut; radius is a px number (`FLOAT`); font stacks and box-shadows are
  raw CSS strings (`STRING`), since Figma variables have no font-stack or
  shadow type. The oklch → sRGB conversion is self-checked against known color
  pairs on every build.

Gradients are intentionally absent from both files: the `bg-gradient-*`
utilities in `styles.css` are derived from `primary`/`accent` at runtime, so
they re-theme automatically and are not tokens.

## Related packages

- [`@cooud-ui/theme`](../theme) — `<CooudUIProvider>` + `useTheme`; applies these
  tokens at runtime and powers per-scope overrides.
- [`@cooud-ui/ui`](../ui) — the component library that renders against these tokens.
- See the [docs site](../../apps/www) for the live theme builder and previews.

## License

MIT
