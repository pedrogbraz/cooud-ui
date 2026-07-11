#!/usr/bin/env node
// @ts-check
/**
 * build-a11y-routes.mjs — the source of truth for which routes the accessibility
 * gate scans.
 *
 * The axe gate must cover EVERY documented component and block page, not a
 * curated subset, so coverage can't silently rot as the catalog grows. This
 * script derives the full slug set from the same index modules the showcase
 * uses for `generateStaticParams` (so a new component page is scanned the moment
 * it's documented) and writes `e2e/a11y/routes.generated.json`.
 *
 * Run modes:
 *   node scripts/build-a11y-routes.mjs           # write the manifest
 *   node scripts/build-a11y-routes.mjs --check    # fail if the manifest is stale
 *
 * The `--check` mode is a CI drift gate (mirrors registry:check / props:check):
 * add a component to the index, forget to regenerate, and CI fails loudly.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const COMPONENTS_INDEX = resolve(repoRoot, "apps/www/lib/components-index.ts");
const BLOCKS_INDEX = resolve(repoRoot, "apps/www/lib/blocks-index.ts");
const OUT = resolve(repoRoot, "e2e/a11y/routes.generated.json");

/**
 * Extract the unique, sorted ITEM `slug`s from an index module.
 *
 * Both index files nest `items: ComponentMeta[]` under category objects, and a
 * category ALSO has a `slug` (`buttons`, `auth`, …) — but `/components/buttons`
 * is not a real route. A category slug is the one whose object opens `items:`
 * within the next couple of lines (category shape: `slug` → `name` → `items:`);
 * an item slug is followed by `name`/`description`, never a nearby `items:`. We
 * skip the category slugs so the manifest only holds real, navigable routes.
 */
function slugsFrom(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  const slugs = new Set();
  for (let i = 0; i < lines.length; i++) {
    const m = /slug:\s*"([a-z0-9-]+)"/.exec(lines[i]);
    if (!m) continue;
    // Look ahead a few lines: a category declares `items:` right after its slug.
    const isCategory = lines.slice(i + 1, i + 4).some((l) => /^\s*items:/.test(l));
    if (!isCategory) slugs.add(m[1]);
  }
  return [...slugs].sort();
}

const manifest = {
  // Non-component/block pages carry bespoke settle logic in the spec, so they
  // stay curated there; this manifest is only the data-driven catalog routes.
  components: slugsFrom(COMPONENTS_INDEX),
  blocks: slugsFrom(BLOCKS_INDEX),
};

const serialized = `${JSON.stringify(manifest, null, 2)}\n`;

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(OUT, "utf8");
  } catch {
    current = "";
  }
  if (current !== serialized) {
    console.error(
      "a11y routes manifest is stale — run `bun run a11y:routes` and commit e2e/a11y/routes.generated.json",
    );
    process.exit(1);
  }
  console.log(
    `a11y routes manifest in sync (${manifest.components.length} components, ${manifest.blocks.length} blocks).`,
  );
} else {
  writeFileSync(OUT, serialized);
  console.log(
    `wrote ${OUT} — ${manifest.components.length} components + ${manifest.blocks.length} blocks`,
  );
}
