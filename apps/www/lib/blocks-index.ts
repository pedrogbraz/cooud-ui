/**
 * Server-safe metadata for "Blocks" — larger, copy-paste UI sections composed
 * from @cooud/ui primitives. The live preview + source live in `lib/blocks/*`.
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
        slug: "login",
        name: "Login",
        description: "A centered authentication card with email + social login.",
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
