---
name: theme
description: Preview or switch the Cooud UI theme in __APP_NAME__. Use when the user wants to change the look, try a preset, toggle dark/light, or tweak brand color or radius — set the theme via config or at runtime, and never by inlining raw colors.
argument-hint: "[preset]"
allowed-tools: Read, Edit, Bash
---

# Preview or switch the app theme

Cooud UI is themed entirely through CSS custom properties driven by the active preset,
mode, and any token overrides. Changing them re-skins the whole app instantly — no
per-component edits, no raw colors.

Request: `$ARGUMENTS`

## Presets and modes

- Presets: **`aurora`** (default), **`neutral`**, **`midnight`**, **`sunset`**,
  **`emerald`**.
- Modes: **`light`**, **`dark`** (default `dark`).

## Set the app default (server-rendered)

Edit `app/layout.tsx`. The `defaultThemeName` / `defaultModeName` on **`<CooudThemeScript>`**
and **`<CooudUIProvider>`** must match, and both must use the same `storageKey`:

```tsx
<CooudThemeScript storageKey="theme" defaultThemeName="midnight" defaultModeName="dark" />
...
<CooudUIProvider asRoot storageKey="theme" defaultThemeName="midnight" defaultModeName="dark">
```

Also update the `theme` block in `cooud-ui.json` so newly added components scaffold with
the same default. Keep `suppressHydrationWarning` on `<html>` and keep `<CooudThemeScript>`
in `<head>` — it applies the persisted theme before first paint (anti-flash).

## Change the theme at runtime

Inside a client component under the provider, use `useTheme()`:

```tsx
const { theme, mode, setTheme, setMode, toggleMode } = useTheme();
setTheme("emerald");   // switch preset
toggleMode();          // flip dark/light
```

Runtime changes persist to `localStorage[storageKey]` and are re-applied on next load by
`<CooudThemeScript>`.

## Override individual tokens (brand color, radius, border)

Do this through the token system, never with hardcoded values:

- Runtime, whole app: `useTheme().setOverrides({ primary: "...", radius: "...", border: "..." })`
  — a `Partial<ThemeTokens>`; the entire subtree updates via CSS variables.
- A themed subtree / live preview: render a nested `<CooudUIProvider asRoot={false} overrides={...}>`.
  `asRoot={false}` themes only that subtree, leaving the rest of the app on the app default.

## Rules

- **Never inline raw colors** (`#hex`, `rgb(...)`, arbitrary Tailwind values). Use
  token-backed classes (`bg-primary`, `text-foreground`, `border-border`) or `setOverrides`.
- Theme changes must not introduce motion; respect `prefers-reduced-motion`.
- When previewing, prefer a subtree provider so you can compare against the current app
  theme without committing a global change.
