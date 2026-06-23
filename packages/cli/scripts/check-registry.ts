/**
 * Fails (exit 1) when the committed `registry/*.json` has drifted from the current
 * @cooud-ui/ui sources. Regenerates the registry into a temporary directory, then
 * diffs every file (content + presence) against the committed `registry/`.
 *
 * Run:  bun run packages/cli/scripts/check-registry.ts
 *       (wired as the "registry:check" package script)
 */
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildItems, outDir, serializeRegistry, writeRegistry } from "./build-registry.ts";

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

async function main() {
  // Build + validate from source, then materialize into a tmp dir (literal regen).
  const items = await buildItems();
  const expected = serializeRegistry(items);

  const tmp = await mkdtemp(join(tmpdir(), "cooud-registry-check-"));
  const diffs: string[] = [];
  try {
    await writeRegistry(tmp, items);

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
