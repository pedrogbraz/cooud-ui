import { describe, expect, it } from "vitest";
import { parseCli } from "./index.js";
import { dirNameFromProjectName, isValidProjectName } from "./utils.js";

describe("isValidProjectName", () => {
  it("accepts simple lowercase names", () => {
    expect(isValidProjectName("my-app")).toBe(true);
    expect(isValidProjectName("my_app.v2")).toBe(true);
  });

  it("accepts scoped names", () => {
    expect(isValidProjectName("@acme/widget")).toBe(true);
  });

  it("rejects empty, uppercase, leading-dot, and space-containing names", () => {
    expect(isValidProjectName("")).toBe(false);
    expect(isValidProjectName("MyApp")).toBe(false);
    expect(isValidProjectName(".hidden")).toBe(false);
    expect(isValidProjectName("my app")).toBe(false);
    expect(isValidProjectName("a/b/c")).toBe(false);
  });
});

describe("dirNameFromProjectName", () => {
  it("returns the name unchanged when unscoped", () => {
    expect(dirNameFromProjectName("my-app")).toBe("my-app");
  });

  it("strips the scope for scoped names", () => {
    expect(dirNameFromProjectName("@acme/widget")).toBe("widget");
  });
});

describe("parseCli", () => {
  it("reads the positional name and defaults install to true", () => {
    expect(parseCli(["my-app"])).toMatchObject({
      name: "my-app",
      pm: undefined,
      install: true,
      theme: undefined,
      mode: undefined,
      yes: false,
      ai: undefined,
    });
  });

  it("honors --no-install and --pm", () => {
    expect(parseCli(["my-app", "--no-install", "--pm", "pnpm"])).toMatchObject({
      name: "my-app",
      pm: "pnpm",
      install: false,
    });
  });

  it("parses --theme, --mode and --yes", () => {
    expect(parseCli(["my-app", "--theme", "sunset", "--mode", "light", "--yes"])).toMatchObject({
      theme: "sunset",
      mode: "light",
      yes: true,
    });
  });

  it("defaults the AI Kit fields (ai undecided, all assistants/skills, standard preset)", () => {
    const parsed = parseCli(["my-app"]);
    expect(parsed.ai).toBeUndefined();
    expect(parsed.preset).toBe("standard");
    expect(parsed.assistants).toEqual(["claude", "cursor", "copilot", "windsurf", "gemini"]);
    expect(parsed.skills).toEqual(["ui-add", "theme", "code-review", "ship-pr", "evidence-check"]);
  });

  it("parses --ai / --no-ai / --assistants / --preset / --skills", () => {
    expect(parseCli(["my-app", "--no-ai"]).ai).toBe(false);
    expect(parseCli(["my-app", "--ai"]).ai).toBe(true);
    expect(
      parseCli([
        "my-app",
        "--ai",
        "--assistants",
        "claude,cursor",
        "--preset",
        "fintech",
        "--skills",
        "ui-add,theme",
      ]),
    ).toMatchObject({
      ai: true,
      assistants: ["claude", "cursor"],
      preset: "fintech",
      skills: ["ui-add", "theme"],
    });
  });

  it("throws on an unknown --pm", () => {
    expect(() => parseCli(["my-app", "--pm", "cargo"])).toThrow(/Unknown --pm/);
  });

  it("throws on an unknown --theme", () => {
    expect(() => parseCli(["my-app", "--theme", "galaxy"])).toThrow(/Unknown --theme/);
  });

  it("throws on an unknown --mode", () => {
    expect(() => parseCli(["my-app", "--mode", "sepia"])).toThrow(/Unknown --mode/);
  });

  it("throws on an unknown --assistant, --preset, or --skill", () => {
    expect(() => parseCli(["my-app", "--assistants", "notepad"])).toThrow(/Unknown assistant/);
    expect(() => parseCli(["my-app", "--preset", "crypto"])).toThrow(/Unknown --preset/);
    expect(() => parseCli(["my-app", "--skills", "deploy"])).toThrow(/Unknown skill/);
  });
});
