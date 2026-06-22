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
  "data-table": [{ id: "sortable", title: "Sortable" }],
  metric: [{ id: "stat-tiles", title: "Stat tiles" }],
  kbd: [{ id: "keys", title: "Keys" }],
  empty: [{ id: "empty-state", title: "Empty state" }],
  separator: [{ id: "horizontal-vertical", title: "Horizontal & vertical" }],
  skeleton: [{ id: "loading-card", title: "Loading card" }],
  "scroll-area": [{ id: "scrollable-list", title: "Scrollable list" }],
  spinner: [{ id: "sizes", title: "Sizes" }],
  progress: [{ id: "determinate", title: "Determinate" }],
  sonner: [{ id: "toasts", title: "Toasts" }],
  "alert-dialog": [{ id: "confirm", title: "Confirm" }],
  dialog: [{ id: "basic", title: "Basic" }],
  sheet: [{ id: "sides", title: "Sides" }],
  drawer: [{ id: "bottom-drawer", title: "Bottom drawer" }],
  popover: [{ id: "with-content", title: "With content" }],
  "hover-card": [{ id: "profile-preview", title: "Profile preview" }],
  tooltip: [{ id: "on-a-button", title: "On a button" }],
  "dropdown-menu": [{ id: "actions", title: "Actions" }],
  command: [{ id: "command-palette", title: "Command palette" }],
  tabs: [{ id: "three-tabs", title: "Three tabs" }],
  accordion: [{ id: "faq", title: "FAQ" }],
  breadcrumb: [{ id: "trail", title: "Trail" }],
  pagination: [{ id: "pager", title: "Pager" }],
  calendar: [{ id: "single-date", title: "Single date" }],
  "date-picker": [{ id: "pick-a-date", title: "Pick a date" }],
  chart: [{ id: "bar-chart", title: "Bar chart" }],
  "glass-card": [{ id: "frosted-surface", title: "Frosted surface" }],
  "gradient-border": [
    { id: "with-glow", title: "With glow" },
    { id: "flat", title: "Flat" },
  ],
  "gradient-text": [{ id: "headline", title: "Headline" }],
  "spotlight-card": [{ id: "hover-spotlight", title: "Hover spotlight" }],
  "aurora-background": [{ id: "animated-backdrop", title: "Animated backdrop" }],
  shimmer: [{ id: "loading-sheen", title: "Loading sheen" }],
  reveal: [{ id: "scroll-reveal", title: "Scroll reveal" }],
};

export function getExampleSections(slug: string): ExampleSectionMeta[] {
  return EXAMPLE_SECTIONS[slug] ?? [];
}
