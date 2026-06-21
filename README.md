# Cooud UI

The Cooud design system — a themeable, accessible, shadcn-class React component
library that **is** the Cooud design language. Default theme **Aurora** (premium
sky/cyan), with **Neutral** as a first-class preset and arbitrary brand override.

> Status: **v0.1 — Wave 0** (foundation + theming engine + showcase). Built from a
> 2026-06-21 audit of all 17 Cooud production frontends. Plan/SDD:
> `../../harness/specs/SDD-cooud-ui-design-system-2026-06-21.md`.

## Monorepo layout

```
packages/
  tokens/   @cooud/tokens   — source-of-truth tokens (TS) + CSS-var bridge + Tailwind v4 @theme
  theme/    @cooud/theme    — <CooudUIProvider> + useTheme (runtime theming, CSS-var only, no re-render)
  ui/       @cooud/ui       — components (Radix + CVA + cn)
apps/
  www/      @cooud/www      — HeroUI-style showcase + ThemeBuilder (Next.js 16)
```

## Quickstart

```sh
bun install
bun run build       # turbo: tokens → theme → ui → www (next build, typechecked)
bun run www         # dev the showcase at http://localhost:4747
bun run lint        # biome
```

## Using it in a Cooud app

```tsx
// globals.css
@import "tailwindcss";
@import "@cooud/tokens/styles.css";

// layout.tsx
import { CooudUIProvider } from "@cooud/theme";
<CooudUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">{children}</CooudUIProvider>

// anywhere
import { Button, Card, Badge } from "@cooud/ui";
<Button variant="gradient">Ship it</Button>
```

### Customize everything (runtime)
```tsx
const { setTheme, setMode, setOverrides } = useTheme();
setOverrides({ radius: "20px", primary: "#7c3aed", border: "..." }); // re-themes the whole subtree, no re-render
```

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
motion presets. The premium Aurora layer (glass, gradients, springs, scroll reveals).

## Conventions
See `CONTRACT.md` — semantic tokens only, CVA variants, `forwardRef`, `data-slot`,
`focus-visible` rings, no raw colors. This is what keeps the library re-themeable.

## Roadmap
~~Wave 1 (forms)~~ ✅ → ~~Wave 2 (overlays/nav)~~ ✅ → ~~Wave 3 (data)~~ ✅ → ~~Wave 4 (premium/brand)~~ ✅ →
`cooud-ui` CLI registry (`npx cooud-ui add`) → publish to GitHub Packages → migrate
`dashboard` first. Full plan in the SDD.
