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
    expect(existsSync(join(dir, ".windsurf/rules/doctrine.md"))).toBe(true);
    expect(existsSync(join(dir, "GEMINI.md"))).toBe(true);
    expect(written.length).toBeGreaterThan(10);
  });

  it("substitutes __APP_NAME__ and leaves no token behind", () => {
    writeAiKit({ targetDir: dir, name: "acme" });
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).toContain("acme");
    expect(agents).not.toContain("__APP_NAME__");
  });

  it.each([
    ["fintech", "Fintech / payments preset"],
    ["saas", "SaaS preset"],
    ["oss", "Open-source preset"],
    ["agency", "Agency / client-work preset"],
  ] as const)("appends the %s preset addendum to AGENTS.md", (preset, heading) => {
    writeAiKit({ targetDir: dir, name: "acme", preset });
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).toContain(heading);
  });

  it("standard preset is the base doctrine only (no preset addendum)", () => {
    writeAiKit({ targetDir: dir, name: "acme", preset: "standard" });
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).not.toContain("Fintech / payments preset");
    expect(agents).not.toContain("SaaS preset");
  });

  it("respects the assistants selection (claude only → no cursor/github/windsurf/gemini)", () => {
    writeAiKit({ targetDir: dir, name: "acme", assistants: ["claude"] });
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(dir, ".cursor"))).toBe(false);
    expect(existsSync(join(dir, ".github/copilot-instructions.md"))).toBe(false);
    expect(existsSync(join(dir, ".windsurf"))).toBe(false);
    expect(existsSync(join(dir, "GEMINI.md"))).toBe(false);
  });

  it("includes only the selected skills", () => {
    writeAiKit({ targetDir: dir, name: "acme", assistants: ["claude"], skills: ["ui-add"] });
    expect(existsSync(join(dir, ".claude/skills/ui-add/SKILL.md"))).toBe(true);
    expect(existsSync(join(dir, ".claude/skills/theme/SKILL.md"))).toBe(false);
  });

  it("preset=none skips the doctrine + its references but keeps the design-system rule", () => {
    writeAiKit({ targetDir: dir, name: "acme", preset: "none" });
    expect(existsSync(join(dir, "AGENTS.md"))).toBe(false);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/agents/code-reviewer.md"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/00-doctrine.mdc"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/10-cooud-ui.mdc"))).toBe(true);
  });

  it("can emit generic assistant tooling without Cooud UI rules or skills", () => {
    writeAiKit({
      targetDir: dir,
      name: "acme",
      assistants: ["claude", "cursor", "copilot"],
      includeCooudUi: false,
    });

    expect(existsSync(join(dir, "AGENTS.md"))).toBe(true);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(join(dir, ".mcp.json"))).toBe(false);
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(dir, ".claude/agents/code-reviewer.md"))).toBe(true);
    expect(existsSync(join(dir, ".claude/skills/code-review/SKILL.md"))).toBe(true);
    expect(existsSync(join(dir, ".claude/skills/ui-add/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/skills/theme/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/00-doctrine.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".cursor/rules/10-cooud-ui.mdc"))).toBe(false);
    expect(existsSync(join(dir, ".github/copilot-instructions.md"))).toBe(true);

    const claude = readFileSync(join(dir, "CLAUDE.md"), "utf8");
    expect(claude).toContain("If `.mcp.json` registers");
  });

  it("decouples the cooud-ui MCP config from the Claude assistant", () => {
    writeAiKit({
      targetDir: dir,
      name: "acme",
      assistants: ["cursor"],
      cooudUiMcp: true,
    });

    expect(existsSync(join(dir, ".mcp.json"))).toBe(true);
    expect(existsSync(join(dir, ".cursor/rules/10-cooud-ui.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(false);
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

  it("maps 'none' to an empty list", () => {
    expect(parseList("none", ASSISTANTS, "assistant")).toEqual([]);
  });

  it("parses a comma list and trims whitespace", () => {
    expect(parseList("claude, cursor", ASSISTANTS, "assistant")).toEqual(["claude", "cursor"]);
  });

  it("throws on an unknown token", () => {
    expect(() => parseList("notepad", ASSISTANTS, "assistant")).toThrow(/Unknown assistant/);
  });
});
