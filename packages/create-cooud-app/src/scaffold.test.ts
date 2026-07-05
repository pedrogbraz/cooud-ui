import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyTokens, scaffold } from "./scaffold.js";

describe("applyTokens", () => {
  it("replaces every __APP_NAME__ occurrence", () => {
    expect(applyTokens('"name": "__APP_NAME__"\n# __APP_NAME__', "my-app")).toBe(
      '"name": "my-app"\n# my-app',
    );
  });

  it("leaves content without tokens untouched", () => {
    expect(applyTokens("const x = 1;", "my-app")).toBe("const x = 1;");
  });
});

describe("scaffold (into a temp dir, no install)", () => {
  let root: string;
  let targetDir: string;
  const name = "scaffold-test-app";

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "create-cooud-app-"));
    targetDir = join(root, name);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("creates the app dir and copies template files", () => {
    const { fileCount } = scaffold({ targetDir, name });
    expect(existsSync(targetDir)).toBe(true);
    expect(fileCount).toBeGreaterThan(5);
    expect(existsSync(join(targetDir, "app", "page.tsx"))).toBe(true);
  });

  it("writes package.json with the project name and the three @cooud-ui/* deps", () => {
    scaffold({ targetDir, name });
    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      name: string;
      dependencies: Record<string, string>;
    };
    expect(pkg.name).toBe(name);
    expect(pkg.dependencies).toHaveProperty("@cooud-ui/ui");
    expect(pkg.dependencies).toHaveProperty("@cooud-ui/tokens");
    expect(pkg.dependencies).toHaveProperty("@cooud-ui/theme");
  });

  it("renames gitignore → .gitignore (and does not leave the undotted file)", () => {
    scaffold({ targetDir, name });
    expect(existsSync(join(targetDir, ".gitignore"))).toBe(true);
    expect(existsSync(join(targetDir, "gitignore"))).toBe(false);
  });

  it("wires the anti-flash theme script in app/layout.tsx", () => {
    scaffold({ targetDir, name });
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain("CooudThemeScript");
    expect(layout).toContain("CooudUIProvider");
  });

  it("replaces template tokens (no __APP_NAME__ left behind)", () => {
    scaffold({ targetDir, name });
    for (const file of ["package.json", "README.md"]) {
      const content = readFileSync(join(targetDir, file), "utf8");
      expect(content).not.toContain("__APP_NAME__");
      expect(content).toContain(name);
    }
  });

  it("ships a cooud-ui.json so `npx cooud-ui add` works in the app", () => {
    scaffold({ targetDir, name });
    expect(existsSync(join(targetDir, "cooud-ui.json"))).toBe(true);
  });

  it("defaults to the aurora/dark theme when none is given (no tokens left behind)", () => {
    scaffold({ targetDir, name });
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain('defaultThemeName="aurora"');
    expect(layout).toContain('defaultModeName="dark"');
    expect(layout).not.toContain("__THEME__");
    expect(layout).not.toContain("__MODE__");
    const config = JSON.parse(readFileSync(join(targetDir, "cooud-ui.json"), "utf8")) as {
      theme: { name: string; mode: string };
    };
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });

  it("bakes the chosen theme + mode into layout.tsx and cooud-ui.json", () => {
    scaffold({ targetDir, name, theme: "sunset", mode: "light" });
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain('defaultThemeName="sunset"');
    expect(layout).toContain('defaultModeName="light"');
    const config = JSON.parse(readFileSync(join(targetDir, "cooud-ui.json"), "utf8")) as {
      theme: { name: string; mode: string };
    };
    expect(config.theme).toEqual({ name: "sunset", mode: "light" });
  });
});
