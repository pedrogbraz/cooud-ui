# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] — 2026-07-13

### Added

- **App-generator: installable block variants + `--variant`.** Every block
  variant (`login--split`, `checkout--one-page`, …) is now a real registry item
  (51 of them). A manifest `{block,variant}` ref or a repeatable
  `--variant <slug>=<v>` flag composes the same app with a different look;
  unknown / ineffective / chrome-slot overrides fail loud.
- **App-generator: the SaaS template.** A new `app-shell` chrome block (sidebar +
  header) drives an `(app)` route group; `create-cooud-app --template saas` opens
  straight on a composed dashboard behind the shell (analytics, team, billing,
  settings, split-variant login).
- **App-generator: `add-page`.** `cooud-ui add-page` grows a composed app by one
  page (installs new blocks incl. a new chrome group's chrome, updates nav,
  refreshes the base snapshot, provenance-checked manifest reload, `--dry-run`).
- **App-generator: shared demo-data libs.** Blocks can depend on a `registry:lib`
  (`demo-store` / `demo-saas`, exported via the `@cooud-ui/ui` subpath) — pure-TS
  single sources of truth with tested dataset invariants. `cooud-ui add`/compose
  installs the lib transitively; 8 coherent blocks (cart, order-history, reviews,
  product-grid, billing, …) now read their data from it. An anti-inline-mock
  gate (deriving the forbidden set from the lib) keeps migrated blocks honest.
- **`rsc:smoke` gate** proving every block item (incl. all 51 variants + the
  shell) compiles as a React Server Component page.

### Note

- The bundled app manifests stay bundled (not migrated to `registry:app`); a
  full catalog-data reconciliation (unifying the remaining blocks' divergent
  mock data) is a follow-up. The visible app brand flows through the brandTokens
  chrome path.

## [0.4.0] — 2026-07-13

### Added

- **Cooud Compose — the app generator (Phase 1).** `cooud-ui compose <template>`
  and `npx create-cooud-app --template store|landing` build a full multi-page
  Next.js app by composing validated registry blocks. The generator is data,
  not codegen: every generated page is only imports of installed blocks plus a
  `<main>` that stacks them (the golden rule), so many similar apps generate
  without drift. It reuses the validated CLI core (`Registry.resolve`,
  `writeItemFiles`, the install manifest) verbatim and adds a pure, deterministic
  planner/renderer. Ships `store` (9-page storefront) and `landing` bundled
  manifests, `--dry-run` sitemap preview, and a `.cooud-ui/` base snapshot for
  future 3-way page upgrades. **No new package.**
- **`registry/meta.json` sidecar.** A deterministic (timestamp-free, key-sorted)
  metadata index generated alongside the registry: per block the
  title/description/category plus the extracted `exportName`, `kind`, data-slots
  and brand tokens; per component the title/category/`rsc`; and an `apps` section
  for the bundled templates. `registry:check` gains fail-loud gates for meta
  sync, unique block export names, required data-slot/brand markers, and
  app-template block references.
- **MCP tools enriched with metadata.** `search_registry`, `list_blocks`,
  `list_components` and `get_component` now surface each item's
  description/category from `meta.json` (with graceful fallback for registries
  that ship none), and search matches description + category.
- **`rsc:smoke` gate.** Proves the whole block catalog is safe to compose into
  React Server Component pages — installs every block and `next build`s one bare
  RSC page per block. All 73 blocks pass; the five interactive blocks already
  carry `use client`.

## [0.3.0] — 2026-07-13

### Breaking

- **`@cooud-ui/ui`: heavy leaf-only libraries are now optional peer dependencies.**
  `recharts` (`Chart`), `@tiptap/react` / `@tiptap/pm` / `@tiptap/starter-kit`
  (`RichTextEditor`), `@dnd-kit/core` / `@dnd-kit/sortable` / `@dnd-kit/utilities`
  (`Kanban`), `@tanstack/react-table` (`DataTable`), `react-day-picker`
  (`Calendar`, `DatePicker`, `DateRangePicker`), and `date-fns` (`DatePicker`,
  `DateRangePicker`, `Scheduler`) moved from `dependencies` to optional
  `peerDependencies`, so they are no longer installed automatically with the
  package. **npm-package consumers** importing those components must now install
  the matching peer(s) themselves (see "Optional peer dependencies" in the
  `@cooud-ui/ui` README for the component → package table). All other components
  are unaffected. **CLI/registry users are unaffected** — `npx cooud-ui add <slug>`
  derives each item's npm dependencies from its real imports and installs them.

### Added

- **4 new block families — 17 new blocks (56 → 73), every one CLI-installable
  with a paste-exact code literal:**
  - **Store**: `product-detail` (standard / gallery / minimal),
    `cart` (page / drawer), `order-tracking` (in-transit / delivered / delayed),
    `order-history` (table / cards), `reviews` (summary / compact).
  - **Account**: `account-security` (two-factor / password & danger zone),
    `sessions` (device list / selectable table), `api-keys` (list / create),
    `notification-preferences` (channel matrix / simple toggles).
  - **Admin**: `user-management` (table / cards), `analytics`
    (traffic overview / engagement cohorts), `kanban-board`
    (sprint / compact WIP), `audit-log` (timeline / table).
  - **Content**: `blog` (featured grid / editorial list), `blog-post`
    (article / with sidebar), `logo-cloud` (trust grid / dual marquee),
    `about` (story / values).
- **29 new variants on existing key blocks** — `login` (+3: split panel,
  social-first, minimal), `signup` (+2: split with proof, with plan summary),
  `cta` (+2), `navbar` (+2), `footer` (+2), `checkout` (+2: one-page,
  multi-step), `product-grid` (+2: with filters, editorial showcase), and
  `invoice` (+1: receipt).
- **5 new components** (each CLI-installable and exported with its own entry
  point): `Chip` (interactive filter/selection chip with accessible dismissal),
  `StatusDot` (presence indicator with live-region announcements),
  `ImageZoom` (cursor-panning hover/press zoom with controlled state),
  `VideoPlayer` (token-styled native video controls with focus hand-off), and
  `DescriptionList` (semantic `dl`/`dt`/`dd` in three layouts).
- Docs examples for all five new components, including a captions-track video
  demo and a striped description-list example.

### Fixed

- `Slider` no longer forwards `aria-label`/`aria-labelledby` onto its role-less
  root, which tripped axe `aria-prohibited-attr` (serious, WCAG 2 A) on every
  labeled slider; thumbs keep their accessible names.
- The `pricing` toggle/usage variants and the `feature-grid` bento variant now
  ship code literals that fully reproduce their previews (they previously
  rendered placeholder comments with unused imports), and the `testimonials`
  literal compiles under `strict` TypeScript.
- Classic `login`/`signup`/`otp`/`magic-link` link text moved to the AA-safe
  `text-primary-strong` token.

## [0.2.0] — 2026-07-07

### Added

- **9 new components** — `Marquee`, `AvatarGroup`, `Banner`, `TagsInput`, `Sparkline`,
  `InputGroup`, `PasswordInput`, `ButtonGroup`, and `Masonry` (each CLI-installable
  via `npx cooud-ui add <slug>`).
- **10 new premium components** — three payments-grade inputs `CurrencyInput`
  (currency selector + live minor-unit formatting), `PhoneInput` (country selector,
  emits E.164) and `CreditCardInput` (brand detection + Luhn, display-only/PCI-safe);
  `TimePicker` (12h/24h popover), `FloatingLabelInput`; and premium motion showpieces
  `BorderBeam` (animated perimeter light), `FlipCard` (3D front/back), `TiltCard`
  (pointer-driven 3D tilt), `SplitButton`, and `ConfirmationDialog`. All tokenized,
  reduced-motion-safe, axe-tested, and CLI-installable via `npx cooud-ui add <slug>`.
- **Chart breadth** — donut, radar, and radial-bar-gauge examples on the `Chart`
  page (recharts composed inside `ChartContainer`, tokenized, code-split).
- **Blocks: 8 new families / many new blocks.** A dedicated **Auth** family
  (Login, Sign Up, Forgot Password, Two-Factor Code, Magic Link); **Onboarding**
  (Welcome, Setup Wizard, Setup Checklist); **AI & Chat** (Chat Thread, Prompt
  Box, AI Response); **Notifications** (Notification Panel, Activity Feed, Toast
  Stack); **Email** (Welcome, Receipt, Verify); **States** (Not Found, Error,
  Success, Maintenance); **Feedback** (NPS Survey, Feedback Form, Contact Form);
  plus new **Marketing** (Testimonials, FAQ, Footer, Navbar) and **Billing**
  (Manage Subscription, Payment Method, Usage Dashboard, Cancel Flow) blocks.
  The blocks catalog grew from ~17 to ~48 blocks across 13 families.

### Changed

- **Redesigned the `/blocks` and `/components` catalogs** — a stat header, a
  sticky toolbar with live text search + category filter chips (with counts), a
  fuller card grid, and a live result count. The `/components` default view keeps
  its anchor-linkable category sections.
- Fixed the `Marquee` `motionPreference` semantics (`"always"` now always scrolls;
  default is `"respect"`) and its loop travel (one copy + gap → correct px/sec
  speed and a seamless seam).

### Fixed

- **Accessibility** — labelled the toast dismiss buttons (`button-name`), named
  the setup-checklist progress bar (`aria-progressbar-name`), and gave the
  donut/radar/radial chart demos a proper image role + text alternative
  (`svg-img-alt` / `aria-hidden-focus`). The a11y test suite now also scans the
  batch-5 components and a representative block from each new family.

## [0.1.0] — 2026-06-23

The first public release of **Cooud UI** — a themeable, accessible, shadcn-class
React component library that is the Cooud design language. Distributed two ways:
as installable packages and as copy-paste registry items you own.

### Added

- **`@cooud-ui/ui` component library** — a catalog of themeable, accessible React
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
- **`@cooud-ui/tokens` design tokens** — the source-of-truth design tokens in
  TypeScript, an OKLCH-based color system with light/dark modes, and a CSS
  variable bridge that exposes every token as a runtime `--cooud-*` variable.
  Ships a Tailwind v4 `@theme` stylesheet plus a Tailwind v3 preset, so utilities
  like `bg-primary`, `rounded-lg`, `text-fg-secondary`, and `shadow-glow` resolve
  to the live tokens on either Tailwind version.
- **`@cooud-ui/theme` runtime theming** — `<CooudUIProvider>` and the `useTheme`
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
- Added a published vulnerability disclosure policy (`.github/SECURITY.md`).
- Added Dependabot coverage and documented dependency audit as a release
  governance follow-up to surface vulnerable dependencies early.

### Quality & tooling

- Licensed the project under the MIT License.
- Added a jsdom component-test harness (Vitest + Testing Library) with hundreds
  of tests across the catalog — render, interaction, `aria-invalid`, and
  open-state overlay behavior (focus, escape) — plus automated accessibility
  assertions (axe), an SSR smoke test across components, and a coverage gate.
- Added an end-to-end check that fails on console errors and hydration warnings.
- Added per-entry gzipped bundle budgets for the published `@cooud-ui/ui` so a
  dependency or code-size regression is caught at build time.

[Unreleased]: https://github.com/pedrogbraz/cooud-ui/compare/v0.5.0...main
[0.5.0]: https://github.com/pedrogbraz/cooud-ui/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/pedrogbraz/cooud-ui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/pedrogbraz/cooud-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/pedrogbraz/cooud-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/pedrogbraz/cooud-ui/releases/tag/v0.1.0
