import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ASSISTANTS, parseList, SKILLS, writeAiKit } from "./ai-kit.js";

describe("writeAiKit", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "ai-kit-"));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("writes the full kit for all assistants + the standard doctrine", () => {
    const { written } = writeAiKit({ targetDir: dir, name: "acme" });
    expect(existsSync(join(dir, "AGENTS.md"))).toBe(true);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(join(dir, ".mcp.json"))).toBe(true);
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(dir, ".claude/agents/code-reviewer.md"))).toBe(true);
    for (const s of SKILLS) {
      expect(existsSync(join(dir, `.claude/skills/${s}/SKILL.md`))).toBe(true);
    }
    expect(existsSync(join(dir, ".cursor/rules/00-doctrine.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".cursor/rules/10-cooud-ui.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".github/copilot-instructions.md"))).toBe(true);
    expect(written.length).toBeGreaterThan(10);
  });

  it("substitutes __APP_NAME__ and leaves no token behind", () => {
    writeAiKit({ targetDir: dir, name: "acme" });
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).toContain("acme");
    expect(agents).not.toContain("__APP_NAME__");
  });

  it("appends the fintech preset only when preset=fintech", () => {
    writeAiKit({ targetDir: dir, name: "acme", preset: "fintech" });
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).toContain("Fintech / payments preset");
  });

  it("standard preset omits the fintech section", () => {
    writeAiKit({ targetDir: dir, name: "acme", preset: "standard" });
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).not.toContain("Fintech / payments preset");
  });

  it("respects the assistants selection (claude only → no cursor/github)", () => {
    writeAiKit({ targetDir: dir, name: "acme", assistants: ["claude"] });
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(dir, ".cursor"))).toBe(false);
    expect(existsSync(join(dir, ".github/copilot-instructions.md"))).toBe(false);
  });

  it("includes only the selected skills", () => {
    writeAiKit({ targetDir: dir, name: "acme", assistants: ["claude"], skills: ["ui-add"] });
    expect(existsSync(join(dir, ".claude/skills/ui-add/SKILL.md"))).toBe(true);
    expect(existsSync(join(dir, ".claude/skills/theme/SKILL.md"))).toBe(false);
  });

  it("preset=none skips the doctrine docs but keeps the design-system rule", () => {
    writeAiKit({ targetDir: dir, name: "acme", preset: "none" });
    expect(existsSync(join(dir, "AGENTS.md"))).toBe(false);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/00-doctrine.mdc"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/10-cooud-ui.mdc"))).toBe(true);
  });

  it("is idempotent: a second run writes nothing and skips the existing files", () => {
    writeAiKit({ targetDir: dir, name: "acme" });
    const second = writeAiKit({ targetDir: dir, name: "acme" });
    expect(second.written).toEqual([]);
    expect(second.skipped.length).toBeGreaterThan(10);
  });
});

describe("parseList", () => {
  it("expands undefined / empty / 'all' to the full set", () => {
    expect(parseList(undefined, ASSISTANTS, "assistant")).toEqual([...ASSISTANTS]);
    expect(parseList("all", ASSISTANTS, "assistant")).toEqual([...ASSISTANTS]);
    expect(parseList("", ASSISTANTS, "assistant")).toEqual([...ASSISTANTS]);
  });

  it("parses a comma list and trims whitespace", () => {
    expect(parseList("claude, cursor", ASSISTANTS, "assistant")).toEqual(["claude", "cursor"]);
  });

  it("throws on an unknown token", () => {
    expect(() => parseList("windsurf", ASSISTANTS, "assistant")).toThrow(/Unknown assistant/);
  });
});
