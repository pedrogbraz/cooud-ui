# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

`0.1.0` is the initial public surface of Cooud UI. It has not been tagged or
published to a registry yet, so everything below is currently unreleased.

## [0.1.0] — Unreleased

The first public release of **Cooud UI** — a themeable, accessible, shadcn-class
React component library that is the Cooud design language. Distributed two ways:
as installable packages and as copy-paste registry items you own.

### Added

- **`@cooud/ui` component library** — a catalog of themeable, accessible React
  components built on Radix primitives, `class-variance-authority` variants, and
  Tailwind utility classes, each exposed as its own subpath export for granular
  imports. Covers the full surface a product app needs, grouped into:
  - **Buttons & actions** — Button (incl. gradient/animated variants), Toggle,
    ToggleGroup, SegmentedControl.
  - **Forms** — Input, Textarea, Label, Field, Form (react-hook-form + zod),
    Checkbox, Switch, RadioGroup, Select, Combobox, Autocomplete, MultiSelect,
    Slider, NumberInput, InputOTP, FileDropzone.
  - **Data display** — Table, DataTable (TanStack Table) with sorting, filtering,
    pagination and CSV export, Avatar, Badge, Card, Metric, Kbd, Empty,
    CodeBlock, CopyButton.
  - **Feedback** — Progress, Skeleton, Spinner, Shimmer, Toast (Sonner),
    AnimatedNumber.
  - **Overlays** — Dialog, Sheet, Drawer (Vaul), AlertDialog, Popover,
    MorphingPopover, HoverCard, Tooltip, DropdownMenu, Command palette (cmdk).
  - **Navigation & layout** — Tabs, Accordion, Collapsible, Breadcrumb,
    Pagination, NavigationMenu, ScrollArea, Sidebar, AppShell, Carousel.
  - **Date & time** — Calendar, DatePicker, DateRangePicker.
  - **Charts** — Chart primitives built on Recharts.
  - **Premium & brand** — GlassCard, GradientBorder, GradientText, SpotlightCard,
    AuroraBackground, LogoCarousel, Reveal, TextEffect, and motion presets — the
    Aurora layer of glass, gradients, springs, and scroll reveals.
- **`@cooud/tokens` design tokens** — the source-of-truth design tokens in
  TypeScript, an OKLCH-based color system with light/dark modes, and a CSS
  variable bridge that exposes every token as a runtime `--cooud-*` variable.
  Ships a Tailwind v4 `@theme` stylesheet plus a Tailwind v3 preset, so utilities
  like `bg-primary`, `rounded-lg`, `text-fg-secondary`, and `shadow-glow` resolve
  to the live tokens on either Tailwind version.
- **`@cooud/theme` runtime theming** — `<CooudUIProvider>` and the `useTheme`
  hook for runtime theming. Switch themes and light/dark modes, or override
  individual tokens (radius, primary, border, …) and re-theme an entire subtree
  by writing CSS variables — no React re-render.
- **`cooud-ui` CLI with a registry installer** — copy-paste components into your
  own codebase, shadcn-style, and own the source. `npx cooud-ui init` scaffolds
  the config and `cn()` helper; `npx cooud-ui add <component>` resolves
  dependencies and rewrites imports to your path aliases; `list` and `diff` round
  out the workflow. The registry is generated from the real component sources, so
  the package and copy-paste distribution modes share one source of truth.
- **Installable blocks** — 13 ready-made, composed UI sections shipped as
  `registry:block` items and installable the same way via `npx cooud-ui add
  <slug>`: `hero`, `pricing`, `feature-grid`, `cta`, `stats`, `login`,
  `settings`, `team`, `dashboard`, `billing`, `page-header`, `filter-bar`, and
  `empty-state`. The CLI scaffolds a dedicated blocks directory and routes block
  files to it.
- **Documentation & showcase site** — a HeroUI-style showcase (`apps/www`) that
  documents every component and block with live, themeable previews and surfaces
  the matching `cooud-ui add` command on each page.

### Changed

- Aligned the Badge variant lexicon with the shared destructive variant naming
  while preserving the existing `error` alias for backward compatibility.
- Interactive Radix-based components are now explicitly marked as client
  components so they behave correctly in server-rendered (RSC) apps.
- Tokens now emit a per-mode `color-scheme`, ship `@property`-backed color
  cross-fades, and scope the reduced-motion reset to the relevant subtree.

### Fixed

- Form controls expose reactive `aria-invalid` styling and meet placeholder
  contrast requirements.
- Colored button variants use white labels for legible contrast.
- The NavigationMenu panel no longer clips its content, with tightened padding;
  in the showcase the disclosure is contained within the preview frame.
- Accordion and Collapsible animate their height; DropdownMenu, Select, Popover,
  HoverCard, and Tooltip use fluid pop animations.
- DatePicker labels its popover for screen readers.
- AnimatedNumber keeps its live announce region so its value remains accessible.

### Security

- Neutralized CSV formula (spreadsheet) injection in the DataTable export, so
  exported cell values cannot be interpreted as formulas when opened in a
  spreadsheet application.
- The CLI validates registry dependency names and suggests the closest match on
  an unknown `add`, preventing typo-driven resolution of unintended entries.
- Added a published vulnerability disclosure policy (`SECURITY.md`).
- Added Dependabot coverage and made the dependency audit a blocking gate to
  surface vulnerable dependencies early.

### Quality & tooling

- Licensed the project under the MIT License.
- Added a jsdom component-test harness (Vitest + Testing Library) with hundreds
  of tests across the catalog — render, interaction, `aria-invalid`, and
  open-state overlay behavior (focus, escape) — plus automated accessibility
  assertions (axe), an SSR smoke test across components, and a coverage gate.
- Added an end-to-end check that fails on console errors and hydration warnings.
- Added per-entry gzipped bundle budgets for the published `@cooud/ui` so a
  dependency or code-size regression is caught at build time.

[Unreleased]: https://github.com/pedrogbraz/cooud-ui/compare/main...HEAD
[0.1.0]: https://github.com/pedrogbraz/cooud-ui/releases/tag/v0.1.0
