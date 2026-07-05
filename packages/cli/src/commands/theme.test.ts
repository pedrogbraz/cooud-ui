import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONFIG_FILE, DEFAULT_CONFIG, readConfig } from "../config.js";
import { themeSet } from "./theme.js";

const LAYOUT = `import { CooudThemeScript } from "@cooud-ui/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CooudThemeScript defaultThemeName="aurora" defaultModeName="dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;

function writeLayout(cwd: string, content = LAYOUT): string {
  mkdirSync(join(cwd, "app"), { recursive: true });
  const path = join(cwd, "app/layout.tsx");
  writeFileSync(path, content, "utf8");
  return path;
}

function writeConfigFile(cwd: string, theme?: { name: string; mode: string }): void {
  const config = { ...DEFAULT_CONFIG, ...(theme ? { theme } : {}) };
  writeFileSync(join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

describe("themeSet", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "cooud-ui-theme-"));
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  it("rewrites the layout theme name and records it in config.theme", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "midnight", cwd });

    const onDisk = readFileSync(layoutPath, "utf8");
    expect(onDisk).toContain('defaultThemeName="midnight"');
    expect(onDisk).not.toContain('defaultThemeName="aurora"');
    // --mode omitted → the existing mode attribute is left untouched.
    expect(onDisk).toContain('defaultModeName="dark"');

    const config = await readConfig(cwd);
    // Preserves the config's existing mode when --mode is omitted.
    expect(config.theme).toEqual({ name: "midnight", mode: "dark" });
  });

  it("rewrites both attributes and config when --mode is given", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "sunset", mode: "light", cwd });

    const onDisk = readFileSync(layoutPath, "utf8");
    expect(onDisk).toContain('defaultThemeName="sunset"');
    expect(onDisk).toContain('defaultModeName="light"');

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "sunset", mode: "light" });
  });

  it("defaults the mode to dark when config has none and --mode is omitted", async () => {
    writeLayout(cwd);
    writeConfigFile(cwd); // no theme block

    await themeSet({ name: "emerald", cwd });

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "emerald", mode: "dark" });
  });

  it("is idempotent — a re-run reports zero attribute changes and leaves the file byte-identical", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "neutral", mode: "light", cwd });
    const first = readFileSync(layoutPath, "utf8");

    await themeSet({ name: "neutral", mode: "light", cwd });
    const second = readFileSync(layoutPath, "utf8");

    expect(second).toBe(first);
    expect(second).toContain('defaultThemeName="neutral"');
    expect(second).toContain('defaultModeName="light"');
  });

  it("rejects an unknown theme without touching the layout or config", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await expect(themeSet({ name: "bogus", cwd })).resolves.toBeUndefined();

    expect(readFileSync(layoutPath, "utf8")).toBe(LAYOUT);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });

  it("rejects an invalid mode without touching the layout or config", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await expect(themeSet({ name: "emerald", mode: "sepia", cwd })).resolves.toBeUndefined();

    expect(readFileSync(layoutPath, "utf8")).toBe(LAYOUT);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });

  it("still updates config when no layout file is present", async () => {
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await expect(themeSet({ name: "midnight", mode: "light", cwd })).resolves.toBeUndefined();

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "midnight", mode: "light" });
  });

  it("ignores a layout that does not mount the theme runtime", async () => {
    // A layout.tsx without CooudThemeScript/CooudUIProvider must be left alone.
    const bare = "export default function RootLayout() {\n  return null;\n}\n";
    const layoutPath = writeLayout(cwd, bare);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "midnight", cwd });

    expect(readFileSync(layoutPath, "utf8")).toBe(bare);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "midnight", mode: "dark" });
  });

  it("does not crash when there is no cooud-ui.json", async () => {
    writeLayout(cwd);

    await expect(themeSet({ name: "sunset", cwd })).resolves.toBeUndefined();

    const onDisk = readFileSync(join(cwd, "app/layout.tsx"), "utf8");
    expect(onDisk).toContain('defaultThemeName="sunset"');
  });
});
