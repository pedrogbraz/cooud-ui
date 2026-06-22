#!/usr/bin/env node

// @ts-check
/**
 * bundle-check.mjs — first-load JS budget gate for the @cooud/www site.
 *
 * Reads the Next.js build diagnostics emitted by `next build`
 * (apps/www/.next/diagnostics/route-bundle-stats.json) and fails if the
 * first-load JS of any tracked key route exceeds its budget.
 *
 * Run AFTER building www, e.g.:
 *   bun run build            # turbo build, produces apps/www/.next
 *   node scripts/bundle-check.mjs
 *
 * The script does NOT build on its own (build is owned by turbo); it only
 * inspects the already-produced .next output so it can run standalone in CI
 * right after the build step.
 *
 * Tuning knobs (env):
 *   BUNDLE_BUDGET_SLACK   multiplier applied to every budget (default "1").
 *                         e.g. "1.1" gives a temporary +10% across the board.
 *   BUNDLE_STATS_FILE     override path to route-bundle-stats.json.
 *   BUNDLE_CHECK_STRICT   "1" => fail if a tracked route is missing from stats
 *                         (default: warn only, so partial builds don't break).
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const DEFAULT_STATS_FILE = resolve(repoRoot, "apps/www/.next/diagnostics/route-bundle-stats.json");
const statsFile = process.env.BUNDLE_STATS_FILE
  ? resolve(process.env.BUNDLE_STATS_FILE)
  : DEFAULT_STATS_FILE;

const slackRaw = process.env.BUNDLE_BUDGET_SLACK;
const slack = slackRaw ? Number.parseFloat(slackRaw) : 1;
if (!Number.isFinite(slack) || slack <= 0) {
  console.error(`bundle-check: invalid BUNDLE_BUDGET_SLACK=${slackRaw}`);
  process.exit(2);
}

const strict = process.env.BUNDLE_CHECK_STRICT === "1";

/**
 * Budgets in bytes, keyed by Next route id.
 *
 * Baseline measured 2026-06-22 (Next 16.2.6, Turbopack) after the apps/www
 * split work. Budgets sit roughly 10-15% above current first-load sizes so the
 * gate has useful sensitivity while leaving room for normal compiler drift.
 * Run strict (BUNDLE_CHECK_STRICT=1) in CI so a missing route also fails.
 */
const ROUTE_BUDGETS = /** @type {Record<string, RouteBudget>} */ ({
  "/": { firstLoadUncompressedJsBytes: 735_000, firstLoadGzipJsBytes: 220_000 },
  "/stack": { firstLoadUncompressedJsBytes: 970_000, firstLoadGzipJsBytes: 300_000 },
  "/docs": { firstLoadUncompressedJsBytes: 680_000, firstLoadGzipJsBytes: 205_000 },
  "/docs/installation": {
    firstLoadUncompressedJsBytes: 790_000,
    firstLoadGzipJsBytes: 240_000,
  },
  "/docs/cli": { firstLoadUncompressedJsBytes: 790_000, firstLoadGzipJsBytes: 240_000 },
  "/docs/theming": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/frameworks": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/accessibility": {
    firstLoadUncompressedJsBytes: 775_000,
    firstLoadGzipJsBytes: 235_000,
  },
  "/docs/forms": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/registry": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/rtl": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/stack-builder": {
    firstLoadUncompressedJsBytes: 775_000,
    firstLoadGzipJsBytes: 235_000,
  },
  "/components/[slug]": {
    firstLoadUncompressedJsBytes: 780_000,
    firstLoadGzipJsBytes: 240_000,
  },
  "/components": { firstLoadUncompressedJsBytes: 680_000, firstLoadGzipJsBytes: 205_000 },
  "/create": { firstLoadUncompressedJsBytes: 920_000, firstLoadGzipJsBytes: 275_000 },
  "/blocks": { firstLoadUncompressedJsBytes: 680_000, firstLoadGzipJsBytes: 205_000 },
  "/blocks/[slug]": { firstLoadUncompressedJsBytes: 690_000, firstLoadGzipJsBytes: 205_000 },
  "/blocks/[slug]/[variant]": {
    firstLoadUncompressedJsBytes: 700_000,
    firstLoadGzipJsBytes: 205_000,
  },
});

/**
 * Budgets for chunks shared by the tracked route set. `common*` covers chunks
 * used by every tracked route; `shared*` covers unique chunks used by two or
 * more tracked routes.
 */
const SHARED_CHUNK_BUDGETS = /** @type {SharedChunkBudgets} */ ({
  commonUncompressedJsBytes: 640_000,
  commonGzipJsBytes: 190_000,
  sharedUncompressedJsBytes: 950_000,
  sharedGzipJsBytes: 290_000,
});

/**
 * @typedef {{
 *   firstLoadUncompressedJsBytes: number,
 *   firstLoadGzipJsBytes: number,
 * }} RouteBudget
 *
 * @typedef {{
 *   commonUncompressedJsBytes: number,
 *   commonGzipJsBytes: number,
 *   sharedUncompressedJsBytes: number,
 *   sharedGzipJsBytes: number,
 * }} SharedChunkBudgets
 *
 * @typedef {{
 *   route: string,
 *   firstLoadUncompressedJsBytes: number,
 *   firstLoadChunkPaths?: string[],
 * }} RouteStat
 *
 * @typedef {{
 *   firstLoadUncompressedJsBytes: number,
 *   firstLoadGzipJsBytes: number,
 * }} RouteMeasurements
 */

/** @returns {RouteStat[]} */
function readStats() {
  let raw;
  try {
    raw = readFileSync(statsFile, "utf8");
  } catch (err) {
    console.error(
      `bundle-check: could not read ${statsFile}\n` +
        "  Did you run the www build first? (bun run build)\n" +
        `  ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(2);
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("expected a JSON array");
    return parsed;
  } catch (err) {
    console.error(
      `bundle-check: ${statsFile} is not valid route-bundle-stats JSON\n` +
        `  ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(2);
  }
}

function fmtKiB(bytes) {
  return `${(bytes / 1024).toFixed(0)} KiB`;
}

/** @param {number} bytes */
function withSlack(bytes) {
  return Math.round(bytes * slack);
}

/** @param {string} chunkPath */
function readChunk(chunkPath) {
  try {
    return readFileSync(resolve(repoRoot, "apps/www", chunkPath));
  } catch (err) {
    console.error(
      `bundle-check: could not read first-load chunk ${chunkPath}\n` +
        `  ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(2);
  }
}

/**
 * @param {RouteStat} stat
 * @returns {RouteMeasurements}
 */
function measureRoute(stat) {
  let gzipBytes = 0;
  for (const chunkPath of stat.firstLoadChunkPaths ?? []) {
    gzipBytes += gzipSync(readChunk(chunkPath)).byteLength;
  }

  return {
    firstLoadUncompressedJsBytes: Number(stat.firstLoadUncompressedJsBytes) || 0,
    firstLoadGzipJsBytes: gzipBytes,
  };
}

/**
 * @param {Map<string, RouteStat>} byRoute
 */
function measureSharedChunks(byRoute) {
  /** @type {Map<string, number>} */
  const usage = new Map();
  let trackedRoutesFound = 0;

  for (const route of Object.keys(ROUTE_BUDGETS)) {
    const stat = byRoute.get(route);
    if (!stat) continue;
    trackedRoutesFound += 1;
    for (const chunkPath of stat.firstLoadChunkPaths ?? []) {
      usage.set(chunkPath, (usage.get(chunkPath) ?? 0) + 1);
    }
  }

  const totals = {
    commonUncompressedJsBytes: 0,
    commonGzipJsBytes: 0,
    sharedUncompressedJsBytes: 0,
    sharedGzipJsBytes: 0,
  };

  for (const [chunkPath, count] of usage) {
    if (count < 2) continue;
    const chunk = readChunk(chunkPath);
    const gzipBytes = gzipSync(chunk).byteLength;

    totals.sharedUncompressedJsBytes += chunk.byteLength;
    totals.sharedGzipJsBytes += gzipBytes;

    if (trackedRoutesFound > 0 && count === trackedRoutesFound) {
      totals.commonUncompressedJsBytes += chunk.byteLength;
      totals.commonGzipJsBytes += gzipBytes;
    }
  }

  return totals;
}

/**
 * @param {string} label
 * @param {number} actual
 * @param {number} budget
 * @returns {{ ok: boolean, message: string }}
 */
function compareBudget(label, actual, budget) {
  if (actual > budget) {
    return {
      ok: false,
      message: `  ✗ ${label}  ${fmtKiB(actual)} > budget ${fmtKiB(budget)}  (+${fmtKiB(
        actual - budget,
      )})`,
    };
  }

  return {
    ok: true,
    message: `  ✓ ${label}  ${fmtKiB(actual)} <= ${fmtKiB(budget)}  (${fmtKiB(
      budget - actual,
    )} headroom)`,
  };
}

function main() {
  const stats = readStats();
  /** @type {Map<string, RouteStat>} */
  const byRoute = new Map();
  for (const s of stats) {
    if (s && typeof s.route === "string") {
      byRoute.set(s.route, s);
    }
  }

  /** @type {string[]} */
  const failures = [];
  /** @type {string[]} */
  const missing = [];
  /** @type {string[]} */
  const ok = [];

  for (const [route, routeBudget] of Object.entries(ROUTE_BUDGETS)) {
    const stat = byRoute.get(route);
    if (stat === undefined) {
      missing.push(route);
      continue;
    }

    const measurements = measureRoute(stat);
    for (const [metric, actual] of Object.entries(measurements)) {
      const result = compareBudget(
        `${route} ${metric}`,
        actual,
        withSlack(routeBudget[/** @type {keyof RouteBudget} */ (metric)]),
      );
      (result.ok ? ok : failures).push(result.message);
    }
  }

  const sharedMeasurements = measureSharedChunks(byRoute);
  for (const [metric, actual] of Object.entries(sharedMeasurements)) {
    const result = compareBudget(
      `shared chunks ${metric}`,
      actual,
      withSlack(SHARED_CHUNK_BUDGETS[/** @type {keyof SharedChunkBudgets} */ (metric)]),
    );
    (result.ok ? ok : failures).push(result.message);
  }

  console.log(`bundle-check: first-load JS budgets${slack !== 1 ? ` (slack x${slack})` : ""}`);
  console.log(`  stats: ${statsFile}`);
  for (const line of ok) console.log(line);

  if (missing.length > 0) {
    const msg = `  ? not found in build stats: ${missing.join(", ")}`;
    if (strict) {
      failures.push(msg);
    } else {
      console.warn(`${msg} (non-strict: ignored)`);
    }
  }

  if (failures.length > 0) {
    console.error("\nbundle-check: FAILED — first-load JS over budget:");
    for (const line of failures) console.error(line);
    console.error(
      "\nEither trim the route bundle or, if intentional, raise the budget in" +
        " scripts/bundle-check.mjs.",
    );
    process.exit(1);
  }

  console.log("bundle-check: OK — all tracked routes within budget.");
}

main();
