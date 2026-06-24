/**
 * Server-safe metadata for "Blocks" — larger, copy-paste UI sections composed
 * from @cooud-ui/ui primitives. The live preview + source live in `lib/blocks/*`.
 */

export interface BlockMeta {
  slug: string;
  name: string;
  description: string;
  variants?: BlockVariantMeta[];
}

export interface BlockVariantMeta {
  id: string;
  name: string;
  description: string;
}

export interface BlockCategory {
  slug: string;
  name: string;
  items: BlockMeta[];
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    slug: "auth",
    name: "Auth",
    items: [
      {
        slug: "login",
        name: "Login",
        description: "A centered authentication card with email + social login.",
      },
      {
        slug: "signup",
        name: "Sign Up",
        description: "A create-account card with email, password, terms, and social sign-up.",
      },
      {
        slug: "forgot-password",
        name: "Forgot Password",
        description: "A password reset flow with an email request and a sent confirmation.",
        variants: [
          {
            id: "request",
            name: "Request link",
            description: "Email entry that sends a one-time password reset link.",
          },
          {
            id: "sent",
            name: "Link sent",
            description: "Confirmation that a reset link was emailed, with a resend action.",
          },
        ],
      },
      {
        slug: "otp",
        name: "Two-Factor Code",
        description: "A two-factor authentication card with a six-digit one-time code entry.",
      },
      {
        slug: "magic-link",
        name: "Magic Link",
        description: "A passwordless email link flow with a request and a sent confirmation.",
        variants: [
          {
            id: "request",
            name: "Request link",
            description: "Passwordless email entry that sends a single-use sign-in link.",
          },
          {
            id: "sent",
            name: "Link sent",
            description:
              "Confirmation that a magic sign-in link was emailed, with a resend action.",
          },
        ],
      },
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    items: [
      {
        slug: "hero",
        name: "Hero",
        description: "A centered marketing hero with eyebrow, headline, copy and CTAs.",
        variants: [
          {
            id: "centered",
            name: "Centered launch",
            description: "Classic centered SaaS hero with trust proof and two CTAs.",
          },
          {
            id: "split",
            name: "Split dashboard",
            description: "Two-column hero with a compact product-quality panel.",
          },
          {
            id: "compact",
            name: "Compact registry",
            description: "Contained hero card for docs, registries and template libraries.",
          },
        ],
      },
      {
        slug: "pricing",
        name: "Pricing",
        description: "A three-tier pricing grid with a highlighted plan.",
        variants: [
          {
            id: "tiers",
            name: "Three tiers",
            description: "A responsive three-plan grid with a highlighted popular tier.",
          },
          {
            id: "toggle",
            name: "Plan toggle",
            description: "Two-plan pricing with a monthly/annual segmented control.",
          },
          {
            id: "usage",
            name: "Usage based",
            description: "A metered pricing layout for API, infra and event-based products.",
          },
        ],
      },
      {
        slug: "feature-grid",
        name: "Feature Grid",
        description: "A responsive grid of product features with icons.",
        variants: [
          {
            id: "cards",
            name: "Card grid",
            description: "Six balanced feature cards for broad capability overviews.",
          },
          {
            id: "bento",
            name: "Bento grid",
            description: "Editorial bento layout for showcasing a platform narrative.",
          },
        ],
      },
      {
        slug: "cta",
        name: "Call to Action",
        description: "A bold gradient call-to-action banner.",
      },
    ],
  },
  {
    slug: "application",
    name: "Application",
    items: [
      {
        slug: "stats",
        name: "Stats Cards",
        description: "A dashboard row of KPI metric cards with trends.",
        variants: [
          {
            id: "kpi-grid",
            name: "KPI grid",
            description: "Four-card dashboard metrics with icons, deltas, and contextual hints.",
          },
          {
            id: "compact-summary",
            name: "Compact summary",
            description: "A single-card metric summary for dense dashboards and overview panels.",
          },
          {
            id: "pipeline-funnel",
            name: "Pipeline funnel",
            description: "A segmented stats card for activation, pipeline, or conversion steps.",
          },
        ],
      },
      {
        slug: "settings",
        name: "Settings Panel",
        description: "An account settings form with switches and inputs.",
      },
      {
        slug: "team",
        name: "Team Members",
        description: "A team list with avatars, roles and a menu.",
      },
    ],
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    items: [
      {
        slug: "dashboard",
        name: "Dashboard",
        description: "A full application shell with sidebar nav, KPI cards, a chart, and a table.",
        variants: [
          {
            id: "analytics",
            name: "Analytics dashboard",
            description:
              "A full application shell — sidebar nav, search topbar, KPI cards, a revenue chart and a recent-activity table.",
          },
          {
            id: "admin-overview",
            name: "Admin overview",
            description:
              "An admin console with an icon-collapsible sidebar, status cards, a signups trend and a larger users & orders table.",
          },
        ],
      },
    ],
  },
  {
    slug: "billing",
    name: "Billing",
    items: [
      {
        slug: "billing",
        name: "Billing",
        description: "Subscription management, usage meters, invoices, and a plan selector.",
        variants: [
          {
            id: "subscription",
            name: "Subscription",
            description:
              "Current plan, usage meters, payment method, and a downloadable invoice history.",
          },
          {
            id: "plans",
            name: "Plan selector",
            description:
              "Three-tier plan picker with a highlighted popular plan and a monthly/annual toggle.",
          },
        ],
      },
    ],
  },
  {
    slug: "commerce",
    name: "Commerce",
    items: [
      {
        slug: "checkout",
        name: "Checkout",
        description: "A product checkout with an order summary and a card payment form.",
      },
      {
        slug: "payouts",
        name: "Payouts",
        description:
          "A creator payout dashboard with balance cards and a settlement history table.",
      },
      {
        slug: "product-grid",
        name: "Product Grid",
        description:
          "A digital-products storefront grid of product cards with prices and buy buttons.",
      },
      {
        slug: "invoice",
        name: "Invoice",
        description: "An invoice receipt with line items, totals, status, and a download action.",
      },
    ],
  },
  {
    slug: "page",
    name: "Page sections",
    items: [
      {
        slug: "page-header",
        name: "Page Header",
        description: "A page header with breadcrumbs, title, status, actions, and optional tabs.",
        variants: [
          {
            id: "with-actions",
            name: "Title and actions",
            description:
              "Breadcrumb, title with status badge, supporting copy, and primary/secondary actions.",
          },
          {
            id: "with-tabs",
            name: "Title and tabs",
            description: "Adds a section tab row beneath the header for switching detail views.",
          },
        ],
      },
      {
        slug: "filter-bar",
        name: "Filter Bar",
        description: "A search and filter toolbar with chips and a result count.",
        variants: [
          {
            id: "toolbar",
            name: "Search and filters",
            description:
              "Search input, status select, owner combobox, list/grid toggle, removable filter chips, and a result count.",
          },
        ],
      },
      {
        slug: "empty-state",
        name: "Empty State",
        description: "Empty and error states with illustrations, guidance, and recovery actions.",
        variants: [
          {
            id: "empty",
            name: "Empty list",
            description: "A friendly empty list with an illustration, guidance, and creation CTAs.",
          },
          {
            id: "error",
            name: "Error / not found",
            description:
              "An error state for failed loads or 404s, with retry and recovery actions.",
          },
        ],
      },
    ],
  },
];

export const ALL_BLOCKS: (BlockMeta & { category: string })[] = BLOCK_CATEGORIES.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.name })),
);

export function getBlockMeta(slug: string): (BlockMeta & { category: string }) | undefined {
  return ALL_BLOCKS.find((b) => b.slug === slug);
}

export function getBlockVariantMetas(slug: string): BlockVariantMeta[] {
  const meta = getBlockMeta(slug);
  if (!meta) return [];

  return meta.variants?.length
    ? meta.variants
    : [{ id: "default", name: meta.name, description: meta.description }];
}

export function getBlockVariantMeta(slug: string, variantId: string): BlockVariantMeta | undefined {
  return getBlockVariantMetas(slug).find((variant) => variant.id === variantId);
}

export const BLOCK_SLUGS = ALL_BLOCKS.map((b) => b.slug);
export const BLOCK_COUNT = ALL_BLOCKS.length;
export const BLOCK_VARIANT_COUNT = ALL_BLOCKS.reduce(
  (total, block) => total + (block.variants?.length ?? 1),
  0,
);
export const BLOCK_VARIANT_PARAMS = ALL_BLOCKS.flatMap((block) =>
  (block.variants?.length
    ? block.variants
    : [{ id: "default", name: block.name, description: block.description }]
  ).map((variant) => ({ slug: block.slug, variant: variant.id })),
);
