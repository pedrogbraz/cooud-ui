/**
 * Server-safe metadata for "Blocks" — larger, copy-paste UI sections composed
 * from @cooud/ui primitives. The live preview + source live in `lib/blocks/*`.
 */

export interface BlockMeta {
  slug: string;
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
      },
      {
        slug: "pricing",
        name: "Pricing",
        description: "A three-tier pricing grid with a highlighted plan.",
      },
      {
        slug: "feature-grid",
        name: "Feature Grid",
        description: "A responsive grid of product features with icons.",
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

export const BLOCK_SLUGS = ALL_BLOCKS.map((b) => b.slug);
export const BLOCK_COUNT = ALL_BLOCKS.length;
