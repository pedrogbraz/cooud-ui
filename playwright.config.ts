import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Cooud UI showcase app (`@cooud/www`).
 *
 * Two projects, both Chromium-headless, separated by spec directory so each
 * `test:*` script can target one suite:
 *   - `a11y` → e2e/a11y/**  (axe-core scans of the core routes)
 *   - `e2e`  → e2e/flows/** (skip-link, command palette, install tabs behavior)
 *
 * The `webServer` serves the **already-built** production app via `next start`
 * (the CI runs `bun run build` before the test steps; locally you must build
 * first too). We deliberately do NOT build inside the webServer command so the
 * server boots fast and the suite reflects the shipped SSG/SSR output.
 *
 * Port 4747 matches `apps/www`'s `start`/`dev` scripts. `reuseExistingServer`
 * is on outside CI so a dev server you already have running is reused.
 */

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4747);
const BASE_URL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  // Only Playwright specs live here; vitest unit tests live under packages/**
  // and apps/** and are matched by their own runner, never by Playwright.
  testDir: "./e2e",
  // Deterministic, sequential-ish runs: fail fast on flake in CI.
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["list"]] : [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // Stable, predictable viewport for both a11y scans and flows.
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: "a11y",
      testDir: "./e2e/a11y",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "e2e",
      testDir: "./e2e/flows",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    // Serve the already-built app. Build is the CI step BEFORE these tests
    // (and you must `bun run build` locally before running the suite).
    command: "bun run --filter @cooud/www start",
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
