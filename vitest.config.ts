import { defineConfig } from "vitest/config";

/**
 * Root Vitest config (Vitest 4 `projects`). One project per package, plus a
 * dedicated jsdom project for React component render tests.
 *
 * Convention: `*.test.ts` = Node-env logic, `*.test.tsx` = jsdom component test
 * (Testing Library + vitest-axe via packages/ui/vitest.setup.ts).
 * Test files live next to their sources and are excluded from each package's
 * tsconfig "include", so they never land in `dist`.
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "cli",
          root: "./packages/cli",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "ui",
          root: "./packages/ui",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "ui-dom",
          root: "./packages/ui",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        test: {
          name: "www",
          root: "./apps/www",
          environment: "node",
          include: ["lib/**/*.test.{ts,tsx}"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      // Measure the component-library surface — the code adopters actually run.
      include: ["packages/ui/src/components/**/*.{ts,tsx}"],
      exclude: ["**/*.test.*", "**/*.stories.*", "**/motion-presets.ts"],
      reporter: ["text-summary", "json-summary", "html"],
      reportsDirectory: "./coverage",
      // Ratchet floor — set just under the current measured coverage (lines
      // ~73%, branches ~57%) so deleting tests or shipping untested code fails
      // CI. Raise as coverage climbs.
      thresholds: { lines: 70, functions: 67, statements: 68, branches: 52 },
    },
  },
});
