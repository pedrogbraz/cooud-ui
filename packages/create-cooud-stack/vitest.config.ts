import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@cooud-ui/ai-kit": src("../ai-kit/src/index.ts"),
      "@cooud-ui/stack": src("../stack/src/index.ts"),
      "@cooud-ui/stack/catalog": src("../stack/src/catalog.ts"),
      "@cooud-ui/stack/cli": src("../stack/src/cli.ts"),
      "@cooud-ui/stack/constants": src("../stack/src/constants.ts"),
      "@cooud-ui/stack/engine": src("../stack/src/engine.ts"),
      "@cooud-ui/stack/kickoff": src("../stack/src/kickoff.ts"),
      "@cooud-ui/stack/schema": src("../stack/src/schema.ts"),
      "@cooud-ui/stack/types": src("../stack/src/types.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
