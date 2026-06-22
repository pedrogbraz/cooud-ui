/**
 * Server-safe map of block slug → its content *family* key.
 *
 * The live block previews (heavy composed JSX) live in
 * `lib/blocks/marketing.tsx` and `lib/blocks/application.tsx`. This registry
 * lets the catalog and detail routes know which family a slug belongs to
 * WITHOUT importing either module, so the index never pulls in any preview and
 * a detail route only loads the one family it needs.
 */

export type BlockFamily = "marketing" | "application" | "dashboard" | "billing" | "page";

/** slug → the family module that owns its content. */
export const BLOCK_FAMILY_BY_SLUG: Record<string, BlockFamily> = {
  // marketing
  hero: "marketing",
  pricing: "marketing",
  "feature-grid": "marketing",
  cta: "marketing",
  // application
  stats: "application",
  login: "application",
  settings: "application",
  team: "application",
  // dashboard
  dashboard: "dashboard",
  // billing
  billing: "billing",
  // page sections
  "page-header": "page",
  "filter-bar": "page",
  "empty-state": "page",
};

export function getBlockFamily(slug: string): BlockFamily | undefined {
  return BLOCK_FAMILY_BY_SLUG[slug];
}
