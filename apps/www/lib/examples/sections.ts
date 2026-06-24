/**
 * Lightweight TOC metadata for component examples: slug → [{ id, title }].
 *
 * GENERATED from the `id`/`title` of every example in `lib/examples/<family>.tsx`.
 * It exists so the catalog can build the on-this-page table of contents WITHOUT
 * importing those heavy modules (recharts / forms / overlays previews).
 *
 * Regenerate + verify with `bun run check:example-sections` (it fails on drift).
 */

export interface ExampleSectionMeta {
  id: string;
  title: string;
}

export const EXAMPLE_SECTIONS: Record<string, ExampleSectionMeta[]> = {
  button: [
    { id: "variants", title: "Variants" },
    { id: "sizes", title: "Sizes" },
    { id: "with-icons", title: "With icons" },
    { id: "as-link", title: "As link" },
  ],
  "animated-button": [{ id: "spring-feedback", title: "Spring feedback" }],
  toggle: [
    { id: "default", title: "Default" },
    { id: "outline", title: "Outline variant" },
    { id: "sizes", title: "Sizes" },
  ],
  "toggle-group": [
    { id: "single", title: "Single" },
    { id: "multiple", title: "Multiple" },
  ],
  "copy-button": [
    { id: "default", title: "Default" },
    { id: "inline", title: "Inline with a value" },
  ],
  input: [
    { id: "default", title: "Default" },
    { id: "invalid-state", title: "Invalid state" },
    { id: "disabled", title: "Disabled" },
  ],
  textarea: [
    { id: "default", title: "Default" },
    { id: "invalid", title: "Invalid" },
  ],
  label: [{ id: "with-input", title: "With input" }],
  checkbox: [
    { id: "default", title: "Default" },
    { id: "disabled", title: "Disabled" },
  ],
  "radio-group": [{ id: "options", title: "Options" }],
  switch: [{ id: "default", title: "Default" }],
  select: [{ id: "grouped", title: "Grouped" }],
  combobox: [{ id: "single-select", title: "Single select" }],
  "multi-select": [
    { id: "default", title: "Default" },
    { id: "max-display", title: "Max display" },
  ],
  slider: [
    { id: "single-thumb", title: "Single thumb" },
    { id: "range", title: "Range" },
  ],
  field: [
    { id: "composition", title: "Composition" },
    { id: "with-error", title: "With error" },
  ],
  form: [{ id: "validated-form", title: "Validated form" }],
  "input-otp": [{ id: "six-digit", title: "6-digit" }],
  "file-dropzone": [{ id: "upload", title: "Upload" }],
  "number-input": [
    { id: "default", title: "Default" },
    { id: "precision-format", title: "Precision & formatting" },
  ],
  autocomplete: [
    { id: "default", title: "Default" },
    { id: "async", title: "Async suggestions" },
  ],
  stepper: [{ id: "wizard", title: "Wizard" }],
  avatar: [
    { id: "image-fallback", title: "Image & fallback" },
    { id: "group", title: "Group" },
  ],
  badge: [
    { id: "variants", title: "Variants" },
    { id: "with-icon", title: "With icon" },
  ],
  card: [{ id: "anatomy", title: "Anatomy" }],
  table: [{ id: "basic", title: "Basic" }],
  "data-table": [
    { id: "basic", title: "Basic" },
    { id: "sortable", title: "Sortable" },
    { id: "search-filter", title: "Search & filter" },
    { id: "pagination", title: "Pagination" },
    { id: "selection-bulk", title: "Selection & bulk actions" },
    { id: "column-visibility", title: "Column visibility" },
    { id: "density", title: "Density" },
    { id: "loading", title: "Loading" },
    { id: "empty", title: "Empty" },
    { id: "error", title: "Error" },
  ],
  metric: [{ id: "stat-tiles", title: "Stat tiles" }],
  kbd: [{ id: "keys", title: "Keys" }],
  empty: [{ id: "empty-state", title: "Empty state" }],
  separator: [{ id: "horizontal-vertical", title: "Horizontal & vertical" }],
  skeleton: [{ id: "loading-card", title: "Loading card" }],
  "scroll-area": [{ id: "scrollable-list", title: "Scrollable list" }],
  "code-block": [
    { id: "default", title: "Default" },
    { id: "line-numbers", title: "Line numbers" },
  ],
  collapsible: [{ id: "default", title: "Default" }],
  "aspect-ratio": [
    { id: "default", title: "Default" },
    { id: "square", title: "Square" },
  ],
  "tree-view": [{ id: "file-tree", title: "File tree" }],
  alert: [
    { id: "default", title: "Default" },
    { id: "variants", title: "Variants" },
    { id: "title-only", title: "Title only" },
  ],
  spinner: [{ id: "sizes", title: "Sizes" }],
  progress: [{ id: "determinate", title: "Determinate" }],
  sonner: [{ id: "toasts", title: "Toasts" }],
  "alert-dialog": [{ id: "confirm", title: "Confirm" }],
  dialog: [{ id: "basic", title: "Basic" }],
  sheet: [{ id: "sides", title: "Sides" }],
  drawer: [{ id: "bottom-drawer", title: "Bottom drawer" }],
  popover: [{ id: "with-content", title: "With content" }],
  "notification-center": [{ id: "inbox", title: "Inbox" }],
  "hover-card": [{ id: "profile-preview", title: "Profile preview" }],
  tooltip: [{ id: "on-a-button", title: "On a button" }],
  "dropdown-menu": [{ id: "actions", title: "Actions" }],
  "context-menu": [{ id: "on-a-surface", title: "On a surface" }],
  command: [{ id: "command-palette", title: "Command palette" }],
  tabs: [{ id: "three-tabs", title: "Three tabs" }],
  accordion: [{ id: "faq", title: "FAQ" }],
  breadcrumb: [{ id: "trail", title: "Trail" }],
  pagination: [{ id: "pager", title: "Pager" }],
  "navigation-menu": [{ id: "menu-bar", title: "Menu bar" }],
  menubar: [{ id: "menus", title: "Menus" }],
  sidebar: [{ id: "collapsible-nav", title: "Collapsible navigation" }],
  "app-shell": [{ id: "shell-layout", title: "Shell layout" }],
  resizable: [{ id: "split-panes", title: "Split panes" }],
  calendar: [{ id: "single-date", title: "Single date" }],
  "date-picker": [{ id: "pick-a-date", title: "Pick a date" }],
  "date-range-picker": [
    { id: "range", title: "Date range" },
    { id: "presets", title: "With presets" },
  ],
  scheduler: [{ id: "month-view", title: "Month view" }],
  chart: [{ id: "bar-chart", title: "Bar chart" }],
  "glass-card": [{ id: "frosted-surface", title: "Frosted surface" }],
  "gradient-border": [
    { id: "with-glow", title: "With glow" },
    { id: "flat", title: "Flat" },
  ],
  "gradient-text": [{ id: "headline", title: "Headline" }],
  "spotlight-card": [{ id: "hover-spotlight", title: "Hover spotlight" }],
  "aurora-background": [{ id: "animated-backdrop", title: "Animated backdrop" }],
  "logo-carousel": [{ id: "hero-lockup", title: "Hero lockup" }],
  "morphing-popover": [
    { id: "feedback", title: "Feedback" },
    { id: "quick-actions", title: "Quick actions" },
  ],
  shimmer: [{ id: "loading-sheen", title: "Loading sheen" }],
  reveal: [{ id: "scroll-reveal", title: "Scroll reveal" }],
  "animated-number": [{ id: "count-up", title: "Count up" }],
  carousel: [{ id: "slides", title: "Slides" }],
  "segmented-control": [{ id: "single-select", title: "Single select" }],
  "text-effect": [{ id: "headline", title: "Headline" }],
};

export function getExampleSections(slug: string): ExampleSectionMeta[] {
  return EXAMPLE_SECTIONS[slug] ?? [];
}
