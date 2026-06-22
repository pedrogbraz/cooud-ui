import { defineWorkspace } from "vitest/config";

/**
 * Root Vitest workspace — runs the unit tests of every package from the repo
 * root via `bun run test`.
 *
 * Projects:
 *  - cooud-ui (packages/cli): pure Node logic (path-traversal containment).
 *  - @cooud/ui (packages/ui): pure functions only for now (CSS-color allowlist);
 *    no DOM env is configured because the current suites don't render React.
 *  - www (apps/www): pure logic for the Stack Builder engine/kickoff (no DOM).
 *
 * Test files live next to their sources (*.test.ts[x]) and are excluded from
 * each package's tsconfig "include", so they never land in `dist`.
 */
export default defineWorkspace([
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
      include: ["src/**/*.test.{ts,tsx}"],
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
]);
