import { type BlockMeta, getBlockMeta } from "../blocks-index";
import type { BlockContent, BlockContentMap, BlockVariant } from "./types";

/**
 * Family-agnostic variant resolution. These helpers take a single block's
 * `BlockContent` (resolved from whichever family chunk was lazily loaded) and
 * normalize it against the lightweight metadata — so NO family module is
 * imported here. The detail components pass in only the content they loaded.
 */

type ResolvedBlockMeta = BlockMeta & { category: string };
type NonEmptyArray<T> = [T, ...T[]];

export interface ResolvedBlockVariation {
  slug: string;
  meta: ResolvedBlockMeta;
  variants: NonEmptyArray<BlockVariant>;
  variant: BlockVariant;
}

function createDefaultVariant(meta: ResolvedBlockMeta, block: BlockContent): BlockVariant {
  return {
    id: "default",
    name: meta.name,
    description: meta.description,
    appearance: "dark",
    preview: block.preview,
    code: block.code,
  };
}

export function normalizeBlockVariants(
  meta: ResolvedBlockMeta,
  block: BlockContent,
): NonEmptyArray<BlockVariant> {
  return block.variants?.length
    ? [block.variants[0] as BlockVariant, ...block.variants.slice(1)]
    : [createDefaultVariant(meta, block)];
}

/** Resolve every variant of a block given its already-loaded family map. */
export function getBlockContentVariantsFrom(
  blocks: BlockContentMap,
  slug: string,
): NonEmptyArray<BlockVariant> | undefined {
  const block = blocks[slug];
  const meta = getBlockMeta(slug);

  if (!block || !meta) return undefined;

  return normalizeBlockVariants(meta, block);
}

/** Resolve a single block variation given its already-loaded family map. */
export function resolveBlockVariationFrom(
  blocks: BlockContentMap,
  slug: string,
  variantId?: string | null,
): ResolvedBlockVariation | undefined {
  const block = blocks[slug];
  const meta = getBlockMeta(slug);

  if (!block || !meta) return undefined;

  const variants = normalizeBlockVariants(meta, block);
  const variant = variants.find((item) => item.id === variantId) ?? variants[0];

  return { slug, meta, variants, variant };
}
