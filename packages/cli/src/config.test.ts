import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CLI_VERSION, DEFAULT_CONFIG, DEFAULT_REGISTRY } from "./config.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

describe("release-pinned registry defaults", () => {
  it("keeps the CLI runtime version aligned with package.json", () => {
    expect(CLI_VERSION).toBe(pkg.version);
  });

  it("uses the matching release tag instead of mutable main", () => {
    expect(DEFAULT_REGISTRY).toBe(
      `https://raw.githubusercontent.com/pedrogbraz/cooud-ui/v${pkg.version}/registry`,
    );
    expect(DEFAULT_REGISTRY).not.toContain("/main/registry");
    expect(DEFAULT_CONFIG.registry).toBe(DEFAULT_REGISTRY);
  });
});
