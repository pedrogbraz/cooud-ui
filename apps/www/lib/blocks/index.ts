import { type BlockMeta, getBlockMeta } from "../blocks-index";
import { applicationBlocks } from "./application";
import { marketingBlocks } from "./marketing";
import type { BlockContentMap, BlockVariant } from "./types";

export const BLOCKS: BlockContentMap = {
  ...marketingBlocks,
  ...applicationBlocks,
};

type ResolvedBlockMeta = BlockMeta & { category: string };
type NonEmptyArray<T> = [T, ...T[]];

export interface ResolvedBlockVariation {
  slug: string;
  meta: ResolvedBlockMeta;
  variants: NonEmptyArray<BlockVariant>;
  variant: BlockVariant;
}

function createDefaultVariant(
  meta: ResolvedBlockMeta,
  block: BlockContentMap[string],
): BlockVariant {
  return {
    id: "default",
    name: meta.name,
    description: meta.description,
    appearance: "dark",
    preview: block.preview,
    code: block.code,
  };
}

function normalizeBlockVariants(
  meta: ResolvedBlockMeta,
  block: BlockContentMap[string],
): NonEmptyArray<BlockVariant> {
  return block.variants?.length
    ? [block.variants[0] as BlockVariant, ...block.variants.slice(1)]
    : [createDefaultVariant(meta, block)];
}

export function getBlockContentVariants(slug: string): NonEmptyArray<BlockVariant> | undefined {
  const block = BLOCKS[slug];
  const meta = getBlockMeta(slug);

  if (!block || !meta) return undefined;

  return normalizeBlockVariants(meta, block);
}

export function resolveBlockVariation(
  slug: string,
  variantId?: string | null,
): ResolvedBlockVariation | undefined {
  const block = BLOCKS[slug];
  const meta = getBlockMeta(slug);

  if (!block || !meta) return undefined;

  const variants = normalizeBlockVariants(meta, block);
  const variant = variants.find((item) => item.id === variantId) ?? variants[0];

  return { slug, meta, variants, variant };
}
