import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import { defaultSelection } from "./engine";
import { generateCommand, generateKickoff, generateStackJson } from "./kickoff";

/**
 * The Stack Builder's payoff is a KICKOFF brief that encodes both the tech stack
 * AND the project's conventions, so generated code stays consistent. These lock
 * the convention wiring (KICKOFF section, CLI flags, stack.json) in place.
 */
describe("kickoff — conventions & standards", () => {
  const config = defaultSelection(catalog);

  it("KICKOFF.md carries a Conventions & standards section built from the defaults", () => {
    const md = generateKickoff(config, "acme", catalog);
    expect(md).toContain("## Conventions & standards");
    expect(md).toContain("kebab-case");
    expect(md).toContain("under `src/`");
    expect(md).toContain("`@/…`");
    expect(md).toContain("Conventional Commits");
    expect(md).toContain("strict mode");
  });

  it("is fully out of beta (no BETA marker in the brief)", () => {
    const md = generateKickoff(config, "acme", catalog);
    expect(md).not.toContain("BETA");
    expect(md).not.toContain("(Beta)");
  });

  it("reflects a changed convention in the brief", () => {
    const snake = { ...config, naming: "naming-snake", structure: "structure-root" };
    const md = generateKickoff(snake, "acme", catalog);
    expect(md).toContain("snake_case");
    expect(md).toContain("no `src/` directory");
    expect(md).not.toContain("kebab-case");
  });

  it("the scaffold command carries the convention flags", () => {
    const cmd = generateCommand(config, "acme");
    expect(cmd).toContain("--naming kebab");
    expect(cmd).toContain("--structure src");
    expect(cmd).toContain("--import-alias alias");
    expect(cmd).toContain("--commits conventional");
    expect(cmd).toContain("--ts strict");
  });

  it("stack.json snapshots the convention choices", () => {
    const json = JSON.parse(generateStackJson(config, "acme")) as {
      stack: Record<string, unknown>;
    };
    expect(json.stack.naming).toBe("naming-kebab");
    expect(json.stack.structure).toBe("structure-src");
    expect(json.stack.importAlias).toBe("import-alias");
    expect(json.stack.commitStyle).toBe("commit-conventional");
    expect(json.stack.tsStrict).toBe("ts-strict");
  });
});
