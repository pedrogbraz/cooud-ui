/**
 * Fails (exit 1) when the committed `registry/*.json` (incl. the `meta.json`
 * sidecar) has drifted from the current @cooud-ui/ui + block sources.
 * Regenerates the registry AND metadata into a temporary directory, then diffs
 * every file (content + presence) against the committed `registry/`.
 *
 * The metadata build (`buildMeta`) additionally enforces the compose invariants
 * before any byte-compare: every block `exportName` is unique across blocks, and
 * every block that declares a data-slot or brand-token actually carries those
 * markers/literals in its shipped source. Those throw a clear, block-scoped
 * Error here (caught and reported) rather than crashing.
 *
 * Finally, every bundled app-template manifest (`templates/apps/*.json`) is
 * planned against the freshly-built registry so a typo'd/dropped block, chrome,
 * or `extras` slug is a RED gate here — not a silent broken app the end user
 * only discovers when they run `compose <template>` (SDD §5 "manifest refs exist").
 *
 * Run:  bun run packages/cli/scripts/check-registry.ts
 *       (wired as the "registry:check" package script)
 */
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ManifestError, parseManifest } from "../src/compose/manifest.ts";
import { buildComposePlan, type ComposeMeta, ComposePlanError } from "../src/compose/plan.ts";
import type { RegistryIndex } from "../src/registry.ts";
import {
  buildItems,
  buildMeta,
  extractExportName,
  loadAppManifests,
  outDir,
  type RegistryItem,
  type RegistryMeta,
  readBlockSources,
  readVariantSources,
  serializeRegistry,
  variantItemName,
  writeRegistry,
} from "./build-registry.ts";

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

/** Build the planner's `RegistryIndex` view from the freshly-built items. */
function indexOf(items: RegistryItem[]): RegistryIndex {
  return items.map(({ name, type, dependencies, registryDependencies }) => ({
    name,
    type,
    dependencies,
    registryDependencies,
  }));
}

/**
 * The compose-time app-template reference gate (SDD §5 "manifest refs exist").
 *
 * For every bundled `templates/apps/*.json`, strictly `parseManifest` it and then
 * `buildComposePlan` it against the FRESHLY-BUILT registry index + meta + chrome
 * sources — the exact resolution the end user hits at `compose <template>` time,
 * moved to build/CI time. The planner aggregates EVERY reference error: each
 * `pages[].blocks[]` (bare slug or `{ block }`), each `chrome[].{navbar,footer}`
 * ref, and each `extras{}` value (Next special-file blocks like `not-found`) is
 * resolved against the registry, so a typo'd/dropped slug anywhere is a hard gate
 * failure with the offending template + slug — never a silent broken app the end
 * user only hits at `compose <template>`.
 *
 * Returns a flat list of `"<template>: <problem>"` strings (empty when clean).
 */
export function validateAppTemplateRefs(
  manifests: Awaited<ReturnType<typeof loadAppManifests>>,
  items: RegistryItem[],
  meta: RegistryMeta,
  blockSources: Map<string, string>,
): string[] {
  const problems: string[] = [];
  const index = indexOf(items);
  // RegistryMeta.blocks is a structural superset of the planner's ComposeMeta.
  const composeMeta: ComposeMeta = { blocks: meta.blocks };
  // Every chrome-kind block's shipped source, so the planner can resolve a
  // manifest's navbar/footer refs (a missing source is itself reported by it).
  const chromeSources: Record<string, string> = {};
  for (const [slug, block] of Object.entries(meta.blocks)) {
    if (block.kind !== "chrome") continue;
    const source = blockSources.get(slug);
    if (source !== undefined) chromeSources[slug] = source;
  }

  for (const { file, name, raw } of manifests) {
    const where = `templates/apps/${file}`;

    let parsed: ReturnType<typeof parseManifest>;
    try {
      parsed = parseManifest(raw);
    } catch (err) {
      if (err instanceof ManifestError) {
        for (const e of err.errors) problems.push(`${where}: ${e}`);
      } else {
        problems.push(`${where}: ${err instanceof Error ? err.message : String(err)}`);
      }
      continue;
    }

    // The planner resolves every page/chrome/extras block ref against index+meta
    // and aggregates all unknown-block/kind errors into one ComposePlanError.
    try {
      buildComposePlan(parsed, { appName: name }, index, composeMeta, chromeSources);
    } catch (err) {
      if (err instanceof ComposePlanError) {
        for (const e of err.errors) problems.push(`${where}: ${e}`);
      } else {
        throw err;
      }
    }
  }

  return problems;
}

/**
 * The variant-item gate (F2): for every block variant declared in `meta`, its
 * `item` must be a PUBLISHED registry item whose file's shipped export matches
 * the variant's `exportName`, and every block export must be unique across the
 * WHOLE registry (a generated page imports the export by name). Uniqueness is
 * checked against every shipped block item's export — bare blocks (incl. the 35
 * that declare no variants) AND variant items — not just variant-vs-variant, so
 * a variant renamed onto a bare block's export (e.g. `SettingsBlock`) fails loud
 * here. The DEFAULT variant must map to the bare `<slug>` item; a non-default
 * variant to `<slug>--<id>`. Returns a flat list of problems (empty when clean).
 */
export function validateVariantItems(items: RegistryItem[], meta: RegistryMeta): string[] {
  const problems: string[] = [];
  const itemsByName = new Map(items.map((i) => [i.name, i] as const));
  // Every published block item's TS-parsed export (the single exported top-level
  // function), so a variant's meta.exportName can be checked against what really
  // ships. Uses the same robust extractor as the build (comment/string-proof,
  // single-export-enforced); an item that ships zero or multiple exports is left
  // out here and surfaced as a `ships no \`export function\`` problem downstream.
  const exportOfItem = new Map<string, string>();
  for (const item of items) {
    if (item.type !== "registry:block") continue;
    const content = item.files[0]?.content ?? "";
    try {
      exportOfItem.set(item.name, extractExportName(content, item.name));
    } catch {
      // Left unrecorded → the downstream "ships no `export function`" check fires.
    }
  }

  // exportName → the ITEM NAME that first claimed it (must be globally unique
  // across the WHOLE import namespace — bare blocks AND variants). Seed it with
  // every shipped block item's export FIRST so a variant renamed onto a
  // zero-variant bare block's export (e.g. SettingsBlock/OtpBlock — 35 blocks
  // that never appear as a variant entry) is caught here, matching the
  // docstring's "unique across the registry" claim. Owner values are item names
  // throughout, so the variant loop below can assert an exportName is owned by no
  // item other than the variant's own `variant.item` (its default variant simply
  // re-confirms the bare item it already owns from this seed pass — no conflict).
  const exportOwner = new Map<string, string>();
  for (const [itemName, exportName] of exportOfItem) {
    const prior = exportOwner.get(exportName);
    if (prior !== undefined && prior !== itemName) {
      problems.push(
        `item "${itemName}": exportName "${exportName}" is also shipped by "${prior}" — ` +
          `block exports must be unique across the registry.`,
      );
    } else {
      exportOwner.set(exportName, itemName);
    }
  }

  for (const [slug, block] of Object.entries(meta.blocks)) {
    for (const variant of block.variants) {
      const where = `block "${slug}" variant "${variant.id}"`;
      const isDefault = variant.item === slug;
      const expectedItem = isDefault ? slug : variantItemName(slug, variant.id);

      // The default variant maps to the bare slug; a non-default one to `slug--id`.
      if (variant.item !== expectedItem) {
        problems.push(
          `${where}: item "${variant.item}" should be "${expectedItem}" ` +
            `(default → bare slug, non-default → <slug>--<id>).`,
        );
      }

      const published = itemsByName.get(variant.item);
      if (published === undefined) {
        problems.push(`${where}: no published registry item "${variant.item}".`);
        continue;
      }

      const shipped = exportOfItem.get(variant.item);
      if (shipped === undefined) {
        problems.push(`${where}: item "${variant.item}" ships no \`export function\`.`);
      } else if (shipped !== variant.exportName) {
        problems.push(
          `${where}: meta.exportName "${variant.exportName}" ≠ shipped export "${shipped}" ` +
            `in item "${variant.item}".`,
        );
      }

      // The variant's meta.exportName must be owned by NO item other than its
      // own backing `variant.item`. exportOwner is pre-seeded with every shipped
      // block export (bare + variant), so this now also catches a variant that
      // collides with a zero-variant bare block's export (the 35 bare blocks that
      // never appear as a variant entry), not just variant-vs-variant.
      const prior = exportOwner.get(variant.exportName);
      if (prior !== undefined && prior !== variant.item) {
        problems.push(
          `${where}: exportName "${variant.exportName}" is also used by "${prior}" — ` +
            `variant exports must be unique across the registry.`,
        );
      } else {
        exportOwner.set(variant.exportName, variant.item);
      }
    }
  }

  return problems;
}

async function main() {
  // Build + validate from source, then materialize into a tmp dir (literal regen).
  // `buildMeta` runs the compose gates (unique exportName + data-slot/brand-token
  // markers present); a violation throws a clear Error caught by `main().catch`.
  const items = await buildItems();
  const blockSources = await readBlockSources();
  const variantSources = await readVariantSources();
  let meta: Awaited<ReturnType<typeof buildMeta>>;
  try {
    meta = await buildMeta(blockSources, variantSources);
  } catch (err) {
    console.error("registry:check FAILED — metadata invariant violated:");
    console.error(`  - ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  // Every meta-declared variant must have a published item with a matching,
  // globally-unique export (default → bare slug, non-default → <slug>--<id>).
  const variantProblems = validateVariantItems(items, meta);
  if (variantProblems.length > 0) {
    console.error("registry:check FAILED — block variant items are out of sync with meta:");
    for (const p of variantProblems) console.error(`  - ${p}`);
    process.exit(1);
  }

  // Every bundled app-template must reference only blocks that exist in the
  // registry it ships with — fail loud on a typo'd/dropped ref rather than
  // deferring the break to the end user's `compose <template>` call.
  const manifests = await loadAppManifests();
  const refProblems = validateAppTemplateRefs(manifests, items, meta, blockSources);
  if (refProblems.length > 0) {
    console.error("registry:check FAILED — app template references a block not in the registry:");
    for (const p of refProblems) console.error(`  - ${p}`);
    process.exit(1);
  }

  const expected = serializeRegistry(items, meta);

  const tmp = await mkdtemp(join(tmpdir(), "cooud-registry-check-"));
  const diffs: string[] = [];
  try {
    await writeRegistry(tmp, items, meta);

    // 1. Every expected file must match the committed copy byte-for-byte.
    for (const [file, content] of Object.entries(expected)) {
      const committed = await readIfExists(join(outDir, file));
      if (committed === null) {
        diffs.push(`missing in registry/: ${file}`);
      } else if (committed !== content) {
        diffs.push(`drifted: ${file}`);
      }
    }

    // 2. No stale files left in registry/ that the generator no longer produces.
    let committedFiles: string[] = [];
    try {
      committedFiles = (await readdir(outDir)).filter((f) => f.endsWith(".json"));
    } catch {
      committedFiles = [];
    }
    for (const file of committedFiles) {
      if (!(file in expected)) diffs.push(`stale (not generated): ${file}`);
    }
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }

  if (diffs.length > 0) {
    console.error("registry:check FAILED — registry/ is out of sync with packages/ui:");
    for (const d of diffs) console.error(`  - ${d}`);
    console.error("\nRun `bun run -F cooud-ui registry` and commit the result.");
    process.exit(1);
  }

  console.log(`registry:check OK — ${Object.keys(expected).length} files in sync.`);
}

// Only run when invoked directly (not when imported by a test that exercises
// `validateAppTemplateRefs`), so the import has no side effects / process.exit.
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
