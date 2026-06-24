/**
 * Server-safe map of component slug → its example *family* key.
 *
 * The live examples (preview JSX + recharts/forms/overlays code) live in the
 * heavy `lib/examples/<family>.tsx` modules. This registry lets the catalog and
 * detail routes know *which* family a slug belongs to WITHOUT importing any of
 * those modules — so nothing here pulls in React previews, recharts or forms.
 *
 * The detail route (`/components/[slug]`) uses this to dynamically import only
 * the one family chunk it needs (see `components/docs/component-examples.tsx`).
 */

export type ExampleFamily =
  | "buttons"
  | "forms"
  | "data-display"
  | "feedback"
  | "overlays"
  | "navigation"
  | "date-time"
  | "charts"
  | "premium";

/** slug → the family module that owns its examples. */
export const EXAMPLE_FAMILY_BY_SLUG: Record<string, ExampleFamily> = {
  // buttons
  button: "buttons",
  "animated-button": "buttons",
  toggle: "buttons",
  "toggle-group": "buttons",
  "copy-button": "buttons",
  // forms
  input: "forms",
  textarea: "forms",
  label: "forms",
  checkbox: "forms",
  "radio-group": "forms",
  switch: "forms",
  select: "forms",
  combobox: "forms",
  "multi-select": "forms",
  slider: "forms",
  field: "forms",
  form: "forms",
  "input-otp": "forms",
  "file-dropzone": "forms",
  "number-input": "forms",
  autocomplete: "forms",
  stepper: "forms",
  "rich-text-editor": "forms",
  "color-picker": "forms",
  rating: "forms",
  // data-display
  avatar: "data-display",
  badge: "data-display",
  card: "data-display",
  table: "data-display",
  "data-table": "data-display",
  metric: "data-display",
  kbd: "data-display",
  empty: "data-display",
  separator: "data-display",
  skeleton: "data-display",
  "scroll-area": "data-display",
  "code-block": "data-display",
  collapsible: "data-display",
  "aspect-ratio": "data-display",
  kanban: "data-display",
  timeline: "data-display",
  "tree-view": "data-display",
  // feedback
  spinner: "feedback",
  progress: "feedback",
  sonner: "feedback",
  alert: "feedback",
  "alert-dialog": "feedback",
  "usage-meter": "feedback",
  // overlays
  dialog: "overlays",
  sheet: "overlays",
  drawer: "overlays",
  popover: "overlays",
  "hover-card": "overlays",
  tooltip: "overlays",
  "dropdown-menu": "overlays",
  "context-menu": "overlays",
  command: "overlays",
  "notification-center": "overlays",
  // navigation
  tabs: "navigation",
  accordion: "navigation",
  breadcrumb: "navigation",
  pagination: "navigation",
  "navigation-menu": "navigation",
  menubar: "navigation",
  sidebar: "navigation",
  "app-shell": "navigation",
  resizable: "navigation",
  // date-time
  calendar: "date-time",
  "date-picker": "date-time",
  "date-range-picker": "date-time",
  scheduler: "date-time",
  // charts
  chart: "charts",
  // premium
  "glass-card": "premium",
  "gradient-border": "premium",
  "gradient-text": "premium",
  "spotlight-card": "premium",
  "aurora-background": "premium",
  "logo-carousel": "premium",
  "morphing-popover": "premium",
  shimmer: "premium",
  reveal: "premium",
  "animated-number": "premium",
  carousel: "premium",
  "segmented-control": "premium",
  "text-effect": "premium",
};

export function getExampleFamily(slug: string): ExampleFamily | undefined {
  return EXAMPLE_FAMILY_BY_SLUG[slug];
}
