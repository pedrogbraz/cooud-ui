# @cooud/theme

The Cooud UI runtime theming engine — a React provider and hook that apply
[`@cooud/tokens`](../tokens) to your app and let you re-theme any subtree live.

Theming happens entirely through CSS custom properties: switching theme, toggling
light/dark, or overriding a token (radius, primary, border, …) updates the whole
subtree instantly **without re-rendering the components below it**. This is what
makes brand portals, per-tenant styling, and visual preview builders cheap.

You need this package if you render `@cooud/ui` components and want runtime theme
control, mode switching, or token overrides. (It is also the only supported way to
inject the `--cooud-*` variables when running on Tailwind v3.)

## Install

> Cooud UI is distributed today through a private registry (GitHub Packages) and
> the `cooud-ui` CLI; it is not yet on the public npm registry. Configure your
> `@cooud` scope to point at the registry, then:

```sh
# npm
npm install @cooud/theme @cooud/tokens
# pnpm
pnpm add @cooud/theme @cooud/tokens
# bun
bun add @cooud/theme @cooud/tokens
```

### Prerequisites

- **React 19** (also works with React 18.3+) — `react` and `react-dom` are peer
  dependencies.
- [`@cooud/tokens`](../tokens) — the token data this provider applies (installed
  alongside above; on Tailwind v4 also import `@cooud/tokens/styles.css` once).

## Usage

Wrap your app at the framework root. Use `asRoot` so the theme/mode attributes
are written to `<html>` and the whole document is themed.

```tsx
// app/layout.tsx (Next.js App Router) — or your root component
import "@cooud/tokens/styles.css";
import { CooudUIProvider } from "@cooud/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CooudUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}
```

### `useTheme`

Read and control the active theme from anywhere inside the provider.

```tsx
"use client";
import { useTheme } from "@cooud/theme";

export function ThemeControls() {
  const { theme, mode, setTheme, setMode, toggleMode, setOverrides } = useTheme();

  return (
    <div>
      <button onClick={toggleMode}>Mode: {mode}</button>
      <button onClick={() => setTheme(theme === "aurora" ? "neutral" : "aurora")}>
        Theme: {theme}
      </button>
      {/* Re-theme the whole subtree at runtime — no component re-render: */}
      <button
        onClick={() =>
          setOverrides({
            radius: "16px",
            primary: "oklch(0.685 0.169 237.3)",
            fontDisplay: "Inter, sans-serif",
          })
        }
      >
        Apply brand theme
      </button>
    </div>
  );
}
```

Calling `useTheme()` outside a `<CooudUIProvider>` throws.

## API

### `<CooudUIProvider>`

| Prop               | Type             | Default    | Description                                                                 |
| ------------------ | ---------------- | ---------- | --------------------------------------------------------------------------- |
| `defaultThemeName` | `ThemeName`      | `"aurora"` | Initial theme (`"aurora"` \| `"neutral"`).                                  |
| `defaultModeName`  | `Mode`           | `"dark"`   | Initial mode (`"light"` \| `"dark"`).                                       |
| `overrides`        | `ThemeOverrides` | —          | Seed per-scope token overrides (initial value only; later use `setOverrides`). |
| `asRoot`           | `boolean`        | `false`    | Write attributes to `<html>` (whole document) instead of a wrapper `<div>`. |
| `storageKey`       | `string`         | —          | Persist the theme/mode choice to `localStorage` under this key.             |
| `className`        | `string`         | —          | Extra classes for the wrapper `<div>` (ignored when `asRoot`).              |

When `asRoot` is `false`, the provider renders a `<div>` that themes only its
subtree — useful for previews and isolated brand sections.

### `useTheme(): ThemeContextValue`

Returns `{ theme, mode, overrides, setTheme, setMode, toggleMode, setOverrides }`.
`ThemeName`, `Mode`, and `ThemeOverrides` come from [`@cooud/tokens`](../tokens).

## How it works

`overrides` are converted to a `{ "--cooud-*": value }` style object
(via `@cooud/tokens`) and set on the themed element; the `@cooud/tokens` Tailwind
bridge maps utilities like `bg-primary` and `rounded-lg` onto those variables.
Because everything resolves through CSS variables, overriding a token restyles the
subtree with no React re-render of the components it contains.

## Related packages

- [`@cooud/tokens`](../tokens) — the token source this provider applies.
- [`@cooud/ui`](../ui) — the components that render against the applied tokens.
- See the [docs site](../../apps/www) for the live theme builder.

## License

MIT
