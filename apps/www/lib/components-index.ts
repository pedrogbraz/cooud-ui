/**
 * Server-safe metadata for every documented component (no JSX).
 * Drives the sidebar, the /components overview grid, and static params.
 * The live examples (preview + code) live in `lib/examples/*` (client).
 */

export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  /** Override the named imports shown in the docs when they differ from `name`. */
  importName?: string;
}

export interface ComponentCategory {
  slug: string;
  name: string;
  items: ComponentMeta[];
}

export const CATEGORIES: ComponentCategory[] = [
  {
    slug: "buttons",
    name: "Buttons",
    items: [
      {
        slug: "button",
        name: "Button",
        description: "Clickable action with variants, sizes and asChild.",
      },
      {
        slug: "animated-button",
        name: "AnimatedButton",
        description: "Motion-powered button with spring feedback.",
      },
      { slug: "toggle", name: "Toggle", description: "A two-state on/off button." },
      {
        slug: "toggle-group",
        name: "ToggleGroup",
        description: "A set of toggles, single or multiple.",
      },
    ],
  },
  {
    slug: "forms",
    name: "Forms",
    items: [
      { slug: "input", name: "Input", description: "Single-line text field with invalid state." },
      { slug: "textarea", name: "Textarea", description: "Multi-line auto-sizing text field." },
      { slug: "label", name: "Label", description: "Accessible label tied to a control." },
      { slug: "checkbox", name: "Checkbox", description: "Binary choice with an indicator." },
      { slug: "radio-group", name: "RadioGroup", description: "Single choice among options." },
      { slug: "switch", name: "Switch", description: "Toggle a setting on or off." },
      { slug: "select", name: "Select", description: "Composable dropdown with groups." },
      { slug: "slider", name: "Slider", description: "Pick a value or a range." },
      { slug: "field", name: "Field", description: "Label + description + error layout." },
      { slug: "form", name: "Form", description: "react-hook-form + zod integration." },
      { slug: "input-otp", name: "InputOTP", description: "One-time-code input with slots." },
      {
        slug: "file-dropzone",
        name: "FileDropzone",
        description: "Drag-and-drop file upload area.",
      },
    ],
  },
  {
    slug: "data-display",
    name: "Data Display",
    items: [
      { slug: "avatar", name: "Avatar", description: "User image with a fallback." },
      { slug: "badge", name: "Badge", description: "Small status / category label." },
      { slug: "card", name: "Card", description: "Surface that groups related content." },
      { slug: "table", name: "Table", description: "Styled semantic table primitives." },
      { slug: "data-table", name: "DataTable", description: "Sortable table powered by TanStack." },
      { slug: "metric", name: "Metric", description: "KPI value with trend delta." },
      { slug: "kbd", name: "Kbd", description: "Keyboard key hint." },
      { slug: "empty", name: "Empty", description: "Empty-state placeholder." },
      { slug: "separator", name: "Separator", description: "Visual divider between content." },
      { slug: "skeleton", name: "Skeleton", description: "Loading placeholder shimmer." },
      { slug: "scroll-area", name: "ScrollArea", description: "Custom-styled scroll container." },
    ],
  },
  {
    slug: "feedback",
    name: "Feedback",
    items: [
      { slug: "spinner", name: "Spinner", description: "Indeterminate loading indicator." },
      { slug: "progress", name: "Progress", description: "Determinate progress bar." },
      {
        slug: "sonner",
        name: "Toast",
        description: "Transient notifications via Sonner.",
        importName: "Toaster, toast",
      },
      { slug: "alert-dialog", name: "AlertDialog", description: "Confirm a destructive action." },
    ],
  },
  {
    slug: "overlays",
    name: "Overlays",
    items: [
      { slug: "dialog", name: "Dialog", description: "Modal dialog with header and footer." },
      { slug: "sheet", name: "Sheet", description: "Side-anchored panel." },
      { slug: "drawer", name: "Drawer", description: "Bottom drawer (vaul)." },
      { slug: "popover", name: "Popover", description: "Floating content anchored to a trigger." },
      { slug: "hover-card", name: "HoverCard", description: "Preview content on hover." },
      { slug: "tooltip", name: "Tooltip", description: "Short hint on hover or focus." },
      { slug: "dropdown-menu", name: "DropdownMenu", description: "Actions menu with submenus." },
      { slug: "command", name: "Command", description: "⌘K command palette (cmdk)." },
    ],
  },
  {
    slug: "navigation",
    name: "Navigation",
    items: [
      { slug: "tabs", name: "Tabs", description: "Switch between panels." },
      { slug: "accordion", name: "Accordion", description: "Collapsible content sections." },
      { slug: "breadcrumb", name: "Breadcrumb", description: "Hierarchical page trail." },
      { slug: "pagination", name: "Pagination", description: "Navigate between pages." },
    ],
  },
  {
    slug: "date-time",
    name: "Date & Time",
    items: [
      { slug: "calendar", name: "Calendar", description: "Date grid (react-day-picker)." },
      { slug: "date-picker", name: "DatePicker", description: "Popover-based date selection." },
    ],
  },
  {
    slug: "charts",
    name: "Charts",
    items: [
      {
        slug: "chart",
        name: "Chart",
        description: "Recharts wrapper with tokens.",
        importName: "ChartContainer, ChartTooltip, ChartTooltipContent",
      },
    ],
  },
  {
    slug: "premium",
    name: "Premium & Brand",
    items: [
      { slug: "glass-card", name: "GlassCard", description: "Frosted-glass surface." },
      { slug: "gradient-border", name: "GradientBorder", description: "Aurora gradient border." },
      { slug: "gradient-text", name: "GradientText", description: "Gradient-clipped text." },
      { slug: "spotlight-card", name: "SpotlightCard", description: "Cursor-following spotlight." },
      {
        slug: "aurora-background",
        name: "AuroraBackground",
        description: "Animated aurora backdrop.",
      },
      { slug: "shimmer", name: "Shimmer", description: "Premium shimmer surface." },
      { slug: "reveal", name: "Reveal", description: "Scroll-into-view reveal wrapper." },
    ],
  },
];

export const ALL_COMPONENTS: (ComponentMeta & { category: string })[] = CATEGORIES.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.name })),
);

export function getComponentMeta(slug: string): (ComponentMeta & { category: string }) | undefined {
  return ALL_COMPONENTS.find((c) => c.slug === slug);
}

export const COMPONENT_SLUGS = ALL_COMPONENTS.map((c) => c.slug);

export const COMPONENT_COUNT = ALL_COMPONENTS.length;
