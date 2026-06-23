# @cooud/tokens

The Cooud design tokens — the single source of truth for color, typography,
elevation, and shape across the Cooud UI system.

Tokens are authored once in TypeScript and compiled to two consumable artifacts:
a **CSS variable bridge** for Tailwind v4 and a **preset** for Tailwind v3. Every
`@cooud/ui` component renders against these tokens through semantic utilities
(`bg-primary`, `text-fg-secondary`, `rounded-lg`, `shadow-glow`), so a single
token change re-themes the whole library — at build time or at runtime.

You need this package if you use `@cooud/ui` or `@cooud/theme`, or if you want the
Cooud color/typography/elevation scale in your own components.

## Install

> Cooud UI is distributed today through a private registry (GitHub Packages) and
> the `cooud-ui` CLI; it is not yet on the public npm registry. Configure your
> `@cooud` scope to point at the registry, then:

```sh
# npm
npm install @cooud/tokens
# pnpm
pnpm add @cooud/tokens
# bun
bun add @cooud/tokens
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
@import "@cooud/tokens/styles.css";
```

### Tailwind v3 (config preset)

Import the preset in your config. It maps the same semantic utilities onto the
`--cooud-*` variables.

```js
// tailwind.config.js
import cooudPreset from "@cooud/tokens/preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [cooudPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

> On v3, do **not** import `@cooud/tokens/styles.css` — it uses Tailwind v4-only
> syntax. The `--cooud-*` variables are instead injected at runtime by
> `<CooudUIProvider>` from `@cooud/theme`; the preset connects the utilities to
> those variables.

### Programmatic access (TypeScript)

The TS export is the canonical token data, used by tooling and by `@cooud/theme`
to apply runtime overrides. Components never read these objects directly.

```ts
import { themes, tokensToCssVars, serializeOverrides } from "@cooud/tokens";
import type { ThemeName, Mode, ThemeTokens, ThemeOverrides } from "@cooud/tokens";

themes.aurora.dark.primary; // "oklch(0.685 0.169 237.3)"

// Turn a (partial) token set into a { "--cooud-*": value } style object:
const style = tokensToCssVars({ radius: "20px", primary: "#7c3aed" });

// Or render overrides as a copy-pasteable CSS block:
serializeOverrides({ radius: "20px" }, ":root");
```

Exports: `themes`, `themeNames`, `modes`, `defaultTheme`, `defaultMode`,
`cssVarMap`, `tokensToCssVars`, `serializeOverrides`, and the types `ThemeName`,
`Mode`, `ThemeTokens`, `ThemeOverrides`. The raw token map is also published as
`@cooud/tokens/tokens.json`.

## The token system

- **Color** is authored in [OKLCH](https://oklch.com/) for perceptually even
  ramps and predictable contrast — brand (`primary`, `accent`), surfaces
  (`surface-base` → `surface-floating`), foreground (`fg` → `fg-muted`), lines
  (`border`, `ring`), semantic (`success`, `warning`, `error`, `info`), and a
  five-color chart palette.
- **Typography**, **shape** (`radius`), and **elevation** (`shadow-xs` →
  `shadow-glow`) are tokens too, so they move with the theme.
- Two built-in themes — **Aurora** (the default; premium sky/cyan) and
  **Neutral** — each with `light` and `dark` modes.

The generated `styles/tokens.css` and `preset/` are checked in. After editing
`src/tokens.ts`, regenerate them with `tokens:generate`; CI verifies they are in
sync with `tokens:check`.

## Related packages

- [`@cooud/theme`](../theme) — `<CooudUIProvider>` + `useTheme`; applies these
  tokens at runtime and powers per-scope overrides.
- [`@cooud/ui`](../ui) — the component library that renders against these tokens.
- See the [docs site](../../apps/www) for the live theme builder and previews.

## License

MIT
