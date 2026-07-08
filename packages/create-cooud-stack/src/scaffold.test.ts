import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { catalog, defaultSelection, resolve } from "@cooud-ui/stack";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scaffoldStack } from "./scaffold.js";
import { CREATE_STACK_VERSION } from "./version.js";

describe("scaffoldStack", () => {
  let root: string;
  let targetDir: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "create-cooud-stack-"));
    targetDir = join(root, "my-app");
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("creates a runnable Next + Cooud UI starter for the default stack", () => {
    const config = resolve(catalog, { ...defaultSelection(catalog), install: false }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(result.fileCount).toBeGreaterThan(8);
    expect(existsSync(join(targetDir, "src", "app", "page.tsx"))).toBe(true);
    expect(existsSync(join(targetDir, "KICKOFF.md"))).toBe(true);
    expect(existsSync(join(targetDir, "stack.json"))).toBe(true);

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies["@cooud-ui/ui"]).toBe(`^${CREATE_STACK_VERSION}`);
    expect(pkg.dependencies["@cooud-ui/tokens"]).toBe(`^${CREATE_STACK_VERSION}`);
    expect(pkg.dependencies["@cooud-ui/theme"]).toBe(`^${CREATE_STACK_VERSION}`);
    expect(pkg.scripts.dev).toBe("next dev");

    const cooudUi = JSON.parse(readFileSync(join(targetDir, "cooud-ui.json"), "utf8")) as {
      paths: Record<"ui" | "lib" | "blocks", string>;
      registry: string;
    };
    expect(cooudUi.paths).toEqual({
      ui: "src/components/ui",
      lib: "src/lib",
      blocks: "src/components/blocks",
    });
    expect(cooudUi.registry).toBe(
      `https://raw.githubusercontent.com/pedrogbraz/cooud-ui/v${CREATE_STACK_VERSION}/registry`,
    );

    const stack = JSON.parse(readFileSync(join(targetDir, "stack.json"), "utf8")) as {
      name: string;
      stack: Record<string, unknown>;
    };
    expect(stack.name).toBe("my-app");
    expect(stack.stack.web).toBe("web-next");
  });

  it("writes root app files when structure-root is selected", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      structure: "structure-root",
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });
    expect(existsSync(join(targetDir, "app", "page.tsx"))).toBe(true);
    const tsconfig = readFileSync(join(targetDir, "tsconfig.json"), "utf8");
    expect(tsconfig).toContain('"@/*"');
    expect(tsconfig).toContain('"./*"');
    const cooudUi = JSON.parse(readFileSync(join(targetDir, "cooud-ui.json"), "utf8")) as {
      paths: Record<"ui" | "lib" | "blocks", string>;
    };
    expect(cooudUi.paths).toEqual({
      ui: "components/ui",
      lib: "lib",
      blocks: "components/blocks",
    });
  });

  it("creates a neutral Next starter for non-Cooud UI selections", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      ui: "ui-shadcn",
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(result.unsupported).toContain(
      "The selected UI library is captured in KICKOFF.md; this generator writes a neutral Next.js starter unless Cooud UI is selected, so install and wire the chosen UI library manually.",
    );
    expect(existsSync(join(targetDir, "src", "app", "page.tsx"))).toBe(true);
    expect(existsSync(join(targetDir, "cooud-ui.json"))).toBe(false);
    expect(existsSync(join(targetDir, "postcss.config.mjs"))).toBe(false);

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies["@cooud-ui/ui"]).toBeUndefined();
    expect(pkg.dependencies["@cooud-ui/tokens"]).toBeUndefined();
    expect(pkg.dependencies["@cooud-ui/theme"]).toBeUndefined();
    expect(pkg.devDependencies.tailwindcss).toBeUndefined();
    expect(pkg.scripts.dev).toBe("next dev");

    const layout = readFileSync(join(targetDir, "src", "app", "layout.tsx"), "utf8");
    const page = readFileSync(join(targetDir, "src", "app", "page.tsx"), "utf8");
    const globals = readFileSync(join(targetDir, "src", "app", "globals.css"), "utf8");
    expect(layout).not.toContain("@cooud-ui");
    expect(page).not.toContain("@cooud-ui");
    expect(globals).not.toContain("@cooud-ui");
    expect(existsSync(join(targetDir, ".mcp.json"))).toBe(false);
    expect(existsSync(join(targetDir, ".cursor/rules/10-cooud-ui.mdc"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/ui-add/SKILL.md"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/theme/SKILL.md"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/code-review/SKILL.md"))).toBe(true);
  });

  it("does not tell ui-none projects to install a selected UI library", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      ui: "ui-none",
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    const page = readFileSync(join(targetDir, "src", "app", "page.tsx"), "utf8");
    expect(page).toContain("No UI library was selected");
    expect(page).not.toContain("Install and configure the selected UI library");
  });

  it("emits cooud-ui MCP config when selected without Claude", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      assistants: ["ai-cursor"],
      mcp: ["mcp-cooud-ui"],
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(existsSync(join(targetDir, ".mcp.json"))).toBe(true);
    expect(existsSync(join(targetDir, ".cursor/rules/10-cooud-ui.mdc"))).toBe(true);
    expect(existsSync(join(targetDir, ".claude/settings.json"))).toBe(false);

    const kickoff = readFileSync(join(targetDir, "KICKOFF.md"), "utf8");
    expect(kickoff).toContain(
      "Use it only after your assistant has loaded the generated `.mcp.json`",
    );
  });

  it("does not generate cooud-ui MCP for non-Cooud UI stacks", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      ui: "ui-none",
      mcp: ["mcp-cooud-ui"],
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(result.unsupported).toContain(
      "The cooud-ui MCP server is not generated for stacks that do not use Cooud UI.",
    );
    expect(existsSync(join(targetDir, ".mcp.json"))).toBe(false);
  });
});
