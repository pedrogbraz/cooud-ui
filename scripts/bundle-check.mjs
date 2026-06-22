#!/usr/bin/env node
// @ts-check
/**
 * bundle-check.mjs — first-load JS budget gate for the @cooud/www site.
 *
 * Reads the Next.js build diagnostics emitted by `next build`
 * (apps/www/.next/diagnostics/route-bundle-stats.json) and fails if the
 * uncompressed first-load JS of any tracked key route exceeds its budget.
 *
 * Run AFTER building www, e.g.:
 *   bun run build            # turbo build, produces apps/www/.next
 *   node scripts/bundle-check.mjs
 *
 * The script does NOT build on its own (build is owned by turbo); it only
 * inspects the already-produced .next output so it can run standalone in CI
 * right after the build step.
 *
 * Budgets are intentionally LOOSE for now: they are pinned slightly above the
 * current (pre-optimization) first-load sizes so the mechanism exists and runs
 * green today. APERTAR (tighten) these budgets after Fase apps/www, once the
 * route bundles have been code-split / trimmed.
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
 * Budgets in bytes of UNCOMPRESSED first-load JS, keyed by Next route id.
 *
 * Baseline first-load sizes measured 2026-06-22 (Next 16.2.6, Turbopack),
 * pre-optimization. Budgets = baseline rounded up with ~12-15% headroom so a
 * normal dependency bump doesn't trip the gate before the apps/www diet.
 *
 * Tightened after the apps/www code-splitting phase: budgets now sit ~10% above
 * the optimized first-load sizes, locking in the win and surfacing regressions.
 * Run STRICT (BUNDLE_CHECK_STRICT=1) in CI so a missing route also fails.
 */
const BUDGETS = /** @type {Record<string, number>} */ ({
  // task-critical routes (current optimized size in comment)
  "/components/[slug]": 780_000, // now ~692 KiB (was ~1.81 MB before splitting)
  "/components": 680_000, // now ~600 KiB (was ~1.72 MB)
  "/create": 895_000, // now ~794 KiB (was ~1.23 MB)
  "/blocks": 680_000, // now ~598 KiB (was ~0.78 MB)
  // adjacent heavy routes (kept honest so regressions surface)
  "/blocks/[slug]": 680_000, // now ~600 KiB
  "/blocks/[slug]/[variant]": 700_000, // now ~600 KiB
});

/** @typedef {{ route: string, firstLoadUncompressedJsBytes: number }} RouteStat */

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

function main() {
  const stats = readStats();
  /** @type {Map<string, number>} */
  const byRoute = new Map();
  for (const s of stats) {
    if (s && typeof s.route === "string") {
      byRoute.set(s.route, Number(s.firstLoadUncompressedJsBytes) || 0);
    }
  }

  /** @type {string[]} */
  const failures = [];
  /** @type {string[]} */
  const missing = [];
  /** @type {string[]} */
  const ok = [];

  for (const [route, baseBudget] of Object.entries(BUDGETS)) {
    const budget = Math.round(baseBudget * slack);
    const actual = byRoute.get(route);
    if (actual === undefined) {
      missing.push(route);
      continue;
    }
    if (actual > budget) {
      failures.push(
        `  ✗ ${route}  ${fmtKiB(actual)} > budget ${fmtKiB(budget)}  ` +
          `(+${fmtKiB(actual - budget)})`,
      );
    } else {
      ok.push(
        `  ✓ ${route}  ${fmtKiB(actual)} <= ${fmtKiB(budget)}  ` +
          `(${fmtKiB(budget - actual)} headroom)`,
      );
    }
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
