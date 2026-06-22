#!/usr/bin/env node
// @ts-check
/**
 * playwright-placeholder.mjs — informative no-op standing in for the
 * Playwright-driven suites (`test:a11y`, `test:e2e`) until the apps/www phase
 * lands the real Playwright config + specs.
 *
 * The root scripts `test:a11y` / `test:e2e` point here so that:
 *   - the script names already exist and are wired into CI today, and
 *   - CI does NOT fail just because Playwright isn't configured yet.
 *
 * When the apps/www phase adds `playwright.config.ts` (+ a `@playwright/test`
 * dependency), swap these scripts to `playwright test ...` (e.g. filtered to
 * the www app) and delete this placeholder.
 *
 * Usage: node scripts/playwright-placeholder.mjs <suite-label>
 * Exits 0 (informative, non-blocking).
 */

const suite = process.argv[2] ?? "playwright";
console.log(
  `[${suite}] Playwright suite not configured yet — skipping (no-op).\n` +
    "  This becomes `playwright test` once the apps/www phase adds the config\n" +
    "  and specs. See scripts/playwright-placeholder.mjs.",
);
process.exit(0);
