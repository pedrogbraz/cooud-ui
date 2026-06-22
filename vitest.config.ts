import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "apps/www/lib/**/*.test.{ts,tsx}",
      "packages/cli/src/**/*.test.{ts,tsx}",
      "packages/ui/src/**/*.test.{ts,tsx}",
    ],
    exclude: ["e2e/**", "**/node_modules/**", "**/dist/**", "**/.next/**"],
  },
});
