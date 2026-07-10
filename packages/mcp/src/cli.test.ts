import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  applyTheme,
  DEFAULT_CLI_TIMEOUT_MS,
  findProjectRoot,
  installComponent,
  PINNED_CLI,
  parseAddOutput,
  parseThemeOutput,
  resolveCliInvocations,
  resolveCliTimeoutMs,
  stripAnsi,
} from "./cli.js";
import { SERVER_VERSION } from "./version.js";

/**
 * A fake `cooud-ui` CLI used to assert the spawn wiring. It echoes its argv and
 * cwd as a JSON first line, then prints representative `add`/`theme add` log
 * lines so the output parsers are exercised end-to-end.
 */
const ECHO_CLI = `
const args = process.argv.slice(2);
console.log(JSON.stringify({ argv: args, cwd: process.cwd() }));
if (args[0] === "theme") {
  console.log("\\u2714 Updated app/layout.tsx (2 attribute(s) changed)");
  console.log("\\u203a Would write this block to app/globals.css (replacing any previous one):");
  console.log("\\u26a0 No layout mounting the theme runtime was found");
} else {
  console.log("\\u2714 Added components/ui/button.tsx");
  console.log("\\u26a0 Skipped components/ui/card.tsx (exists \\u2014 use --overwrite)");
  console.log("\\u2714 Installed dependencies");
}
`;

const FAIL_CLI = `
console.log("partial output");
console.error("boom: registry unreachable");
process.exit(2);
`;

const SLEEP_CLI = `
setTimeout(() => {}, 30_000);
`;

/** First stdout line of the echo CLI, parsed. */
function echoed(stdout: string): { argv: string[]; cwd: string } {
  const [first = ""] = stdout.split("\n");
  return JSON.parse(first) as { argv: string[]; cwd: string };
}

let fixtures: string;
let project: string;
let echoArgv: string[];
let failArgv: string[];
let sleepArgv: string[];

beforeAll(() => {
  fixtures = mkdtempSync(join(tmpdir(), "cooud-ui-mcp-cli-"));
  writeFileSync(join(fixtures, "echo-cli.mjs"), ECHO_CLI);
  writeFileSync(join(fixtures, "fail-cli.mjs"), FAIL_CLI);
  writeFileSync(join(fixtures, "sleep-cli.mjs"), SLEEP_CLI);
  echoArgv = [process.execPath, join(fixtures, "echo-cli.mjs")];
  failArgv = [process.execPath, join(fixtures, "fail-cli.mjs")];
  sleepArgv = [process.execPath, join(fixtures, "sleep-cli.mjs")];

  project = join(fixtures, "project");
  mkdirSync(project);
  writeFileSync(join(project, "package.json"), JSON.stringify({ name: "consumer" }));
});

afterAll(() => {
  rmSync(fixtures, { recursive: true, force: true });
});

describe("resolveCliInvocations", () => {
  it("pins the CLI to the server's own version", () => {
    expect(PINNED_CLI).toBe(`cooud-ui@${SERVER_VERSION}`);
  });

  it("defaults to bunx with an npx fallback", () => {
    expect(resolveCliInvocations({})).toEqual([
      ["bunx", "--bun", PINNED_CLI],
      ["npx", "-y", PINNED_CLI],
    ]);
  });

  it("lets COOUD_MCP_CLI_CMD replace the launchers entirely", () => {
    expect(resolveCliInvocations({ COOUD_MCP_CLI_CMD: "bun /repo/cli/index.ts" })).toEqual([
      ["bun", "/repo/cli/index.ts"],
    ]);
  });
});

describe("resolveCliTimeoutMs", () => {
  it("defaults to 120s", () => {
    expect(resolveCliTimeoutMs({})).toBe(DEFAULT_CLI_TIMEOUT_MS);
    expect(DEFAULT_CLI_TIMEOUT_MS).toBe(120_000);
  });

  it("honours a valid override and rejects garbage", () => {
    expect(resolveCliTimeoutMs({ COOUD_MCP_CLI_TIMEOUT_MS: "5000" })).toBe(5000);
    expect(resolveCliTimeoutMs({ COOUD_MCP_CLI_TIMEOUT_MS: "abc" })).toBe(DEFAULT_CLI_TIMEOUT_MS);
    expect(resolveCliTimeoutMs({ COOUD_MCP_CLI_TIMEOUT_MS: "-1" })).toBe(DEFAULT_CLI_TIMEOUT_MS);
  });
});

describe("findProjectRoot", () => {
  it("walks up to the nearest package.json", () => {
    const nested = join(project, "src", "app");
    mkdirSync(nested, { recursive: true });
    expect(findProjectRoot(nested)).toEqual({ dir: project, hasCooudConfig: false });
  });

  it("prefers a cooud-ui.json anywhere up the tree over a nearer package.json", () => {
    const root = join(fixtures, "config-wins");
    const workspace = join(root, "apps", "web");
    mkdirSync(workspace, { recursive: true });
    writeFileSync(join(root, "cooud-ui.json"), "{}");
    writeFileSync(join(workspace, "package.json"), "{}");
    expect(findProjectRoot(workspace)).toEqual({ dir: root, hasCooudConfig: true });
  });

  it("returns undefined when no project marker exists up the tree", () => {
    const bare = join(fixtures, "bare", "deep");
    mkdirSync(bare, { recursive: true });
    expect(findProjectRoot(bare)).toBeUndefined();
  });
});

describe("output parsing", () => {
  it("strips ANSI color from forced-color output", () => {
    const colored = "\u001B[32m\u2714\u001B[39m Added lib/cn.ts";
    expect(stripAnsi(colored)).toBe("\u2714 Added lib/cn.ts");
    expect(parseAddOutput(colored).installedFiles).toEqual(["lib/cn.ts"]);
  });

  it("parses add output: written, skipped, and installed deps", () => {
    const parsed = parseAddOutput(
      [
        "Adding 1 component(s)",
        "✔ Added components/ui/button.tsx",
        "✔ Added lib/cn.ts",
        "⚠ Skipped components/ui/card.tsx (exists — use --overwrite)",
        "✔ Installed dependencies",
      ].join("\n"),
    );
    expect(parsed.installedFiles).toEqual(["components/ui/button.tsx", "lib/cn.ts"]);
    expect(parsed.skippedFiles).toEqual(["components/ui/card.tsx"]);
    expect(parsed.dependencies).toEqual({ installed: true, pending: [] });
  });

  it("parses pending deps from --skip-install and failed-install output", () => {
    const skipped = parseAddOutput("› Dependencies to install: clsx@^2.1.1 tailwind-merge@^3.3.1");
    expect(skipped.dependencies).toEqual({
      installed: false,
      pending: ["clsx@^2.1.1", "tailwind-merge@^3.3.1"],
    });

    const failed = parseAddOutput(
      ["⚠ Install failed: exit 1", "› Install manually: bun add clsx@^2.1.1"].join("\n"),
    );
    expect(failed.dependencies).toEqual({ installed: false, pending: ["clsx@^2.1.1"] });
  });

  it("parses theme output: changes, dry-run plan, and warnings", () => {
    const parsed = parseThemeOutput(
      [
        "✔ Updated app/layout.tsx (2 attribute(s) changed)",
        "› Would write this block to app/globals.css (replacing any previous one):",
        "⚠ No layout mounting the theme runtime was found",
      ].join("\n"),
    );
    expect(parsed.changes).toEqual(["Updated app/layout.tsx (2 attribute(s) changed)"]);
    expect(parsed.planned).toEqual([
      "Would write this block to app/globals.css (replacing any previous one):",
    ]);
    expect(parsed.warnings).toEqual(["No layout mounting the theme runtime was found"]);
  });
});

describe("installComponent argument validation", () => {
  it("rejects an empty name list", async () => {
    await expect(installComponent({ names: [] }, { cwd: project })).rejects.toThrow(
      /at least one/i,
    );
    await expect(installComponent({ names: ["  ", ""] }, { cwd: project })).rejects.toThrow(
      /at least one/i,
    );
  });

  it("rejects names that are not registry slugs (no flag/shell smuggling)", async () => {
    for (const bad of ["--registry", "-o", "button card", "a;b", "../evil"]) {
      await expect(installComponent({ names: [bad] }, { cwd: project })).rejects.toThrow(
        /Invalid registry item name/,
      );
    }
  });

  it("fails with a clear error when not inside a project", async () => {
    const bare = join(fixtures, "no-project");
    mkdirSync(bare, { recursive: true });
    await expect(
      installComponent({ names: ["button"] }, { cwd: bare, candidates: [echoArgv] }),
    ).rejects.toThrow(/Not inside a project/);
  });
});

describe("installComponent spawn wiring", () => {
  it("composes the add argv and runs at the detected project root", async () => {
    const result = await installComponent(
      { names: [" button ", "card", "button"], overwrite: true, skipInstall: true },
      { cwd: join(project, "src", "app"), candidates: [echoArgv], env: {} },
    );
    expect(result.status).toBe("success");
    expect(result.exitCode).toBe(0);
    expect(result.projectRoot).toBe(project);
    const echo = echoed(result.stdout);
    expect(echo.argv).toEqual(["add", "button", "card", "--overwrite", "--skip-install"]);
    // The child runs at the project root (realpath), not the requesting dir.
    expect(echo.cwd.endsWith("project")).toBe(true);
    // Command line surfaced verbatim for transparency.
    expect(result.command).toBe(`${echoArgv.join(" ")} add button card --overwrite --skip-install`);
  });

  it("forwards a registry override so the CLI resolves the same registry", async () => {
    const result = await installComponent(
      { names: ["button"] },
      { cwd: project, candidates: [echoArgv], env: { COOUD_UI_REGISTRY: "/some/registry" } },
    );
    expect(echoed(result.stdout).argv).toEqual(["add", "button", "--registry", "/some/registry"]);
  });

  it("surfaces the parsed CLI report plus verbatim stdout/stderr", async () => {
    const result = await installComponent(
      { names: ["button"] },
      { cwd: project, candidates: [echoArgv], env: {} },
    );
    expect(result.installedFiles).toEqual(["components/ui/button.tsx"]);
    expect(result.skippedFiles).toEqual(["components/ui/card.tsx"]);
    expect(result.dependencies).toEqual({ installed: true, pending: [] });
    expect(result.stdout).toContain("✔ Added components/ui/button.tsx");
    expect(result.stderr).toBe("");
  });

  it("classifies a non-zero exit as failed with stderr intact", async () => {
    const result = await installComponent(
      { names: ["button"] },
      { cwd: project, candidates: [failArgv], env: {} },
    );
    expect(result.status).toBe("failed");
    expect(result.exitCode).toBe(2);
    expect(result.stdout).toContain("partial output");
    expect(result.stderr).toContain("boom: registry unreachable");
  });

  it("kills a hung CLI at the timeout and reports it", async () => {
    const result = await installComponent(
      { names: ["button"] },
      { cwd: project, candidates: [sleepArgv], env: {}, timeoutMs: 300 },
    );
    expect(result.status).toBe("timeout");
  }, 10_000);

  it("falls back to the next launcher when one is not installed (ENOENT)", async () => {
    const result = await installComponent(
      { names: ["button"] },
      { cwd: project, candidates: [["cooud-ui-mcp-no-such-launcher"], echoArgv], env: {} },
    );
    expect(result.status).toBe("success");
    expect(echoed(result.stdout).argv).toEqual(["add", "button"]);
  });

  it("throws a clear error when no launcher exists at all", async () => {
    await expect(
      installComponent(
        { names: ["button"] },
        { cwd: project, candidates: [["no-launcher-a"], ["no-launcher-b"]], env: {} },
      ),
    ).rejects.toThrow(/Could not launch the cooud-ui CLI/);
  });

  it.skipIf(process.execPath.includes(" "))("honours the COOUD_MCP_CLI_CMD env seam", async () => {
    const result = await installComponent(
      { names: ["button"] },
      { cwd: project, env: { COOUD_MCP_CLI_CMD: echoArgv.join(" ") } },
    );
    expect(result.status).toBe("success");
    expect(echoed(result.stdout).argv).toEqual(["add", "button"]);
  });
});

describe("applyTheme", () => {
  it("rejects an empty or flag-like source", async () => {
    await expect(applyTheme({ source: "  " }, { cwd: project })).rejects.toThrow(/theme source/);
    await expect(applyTheme({ source: "--dry-run" }, { cwd: project })).rejects.toThrow(
      /must not look like a CLI flag/,
    );
  });

  it("composes the theme add argv (with --dry-run) and parses the report", async () => {
    const result = await applyTheme(
      { source: "https://cooud-ui.dev/studio?c=abc123", dryRun: true },
      { cwd: project, candidates: [echoArgv], env: {} },
    );
    expect(result.status).toBe("success");
    expect(result.dryRun).toBe(true);
    expect(result.projectRoot).toBe(project);
    expect(echoed(result.stdout).argv).toEqual([
      "theme",
      "add",
      "https://cooud-ui.dev/studio?c=abc123",
      "--dry-run",
    ]);
    expect(result.changes).toEqual(["Updated app/layout.tsx (2 attribute(s) changed)"]);
    expect(result.planned).toEqual([
      "Would write this block to app/globals.css (replacing any previous one):",
    ]);
    expect(result.warnings).toEqual(["No layout mounting the theme runtime was found"]);
  });

  it("omits --dry-run by default", async () => {
    const result = await applyTheme(
      { source: "theme.json" },
      { cwd: project, candidates: [echoArgv], env: {} },
    );
    expect(result.dryRun).toBe(false);
    expect(echoed(result.stdout).argv).toEqual(["theme", "add", "theme.json"]);
  });
});

// Real end-to-end smoke: run the actual repo CLI (via bun) against the repo's
// own registry directory inside a scratch consumer project. Skipped where bun
// is not installed.
const REPO_CLI = fileURLToPath(new URL("../../cli/src/index.ts", import.meta.url));
const REPO_REGISTRY = fileURLToPath(new URL("../../../registry", import.meta.url));
const hasBun = spawnSync("bun", ["--version"], { stdio: "ignore" }).error === undefined;

describe.skipIf(!hasBun || !existsSync(REPO_CLI) || !existsSync(REPO_REGISTRY))(
  "real CLI smoke (bun + local registry)",
  () => {
    it("installs button into a scratch consumer project", async () => {
      const consumer = mkdtempSync(join(tmpdir(), "cooud-ui-mcp-consumer-"));
      try {
        writeFileSync(
          join(consumer, "package.json"),
          JSON.stringify({ name: "scratch-consumer", version: "0.0.0", private: true }),
        );
        writeFileSync(
          join(consumer, "cooud-ui.json"),
          JSON.stringify({
            aliases: { ui: "@/components/ui", lib: "@/lib", blocks: "@/components/blocks" },
            paths: { ui: "components/ui", lib: "lib", blocks: "components/blocks" },
            registry: REPO_REGISTRY,
          }),
        );

        const result = await installComponent(
          { names: ["button"], skipInstall: true },
          {
            cwd: consumer,
            candidates: [["bun", REPO_CLI]],
            env: { COOUD_UI_REGISTRY: REPO_REGISTRY },
            timeoutMs: 60_000,
          },
        );

        expect(result.stderr).toBe("");
        expect(result.status).toBe("success");
        expect(result.installedFiles).toContain("components/ui/button.tsx");
        // button pulls in its registry dependency (cn) automatically.
        expect(result.installedFiles).toContain("lib/cn.ts");
        expect(existsSync(join(consumer, "components/ui/button.tsx"))).toBe(true);
        expect(existsSync(join(consumer, "lib/cn.ts"))).toBe(true);
        // --skip-install leaves the npm deps pending rather than installed.
        expect(result.dependencies.installed).toBe(false);
        expect(result.dependencies.pending.join(" ")).toContain("@radix-ui/react-slot");
      } finally {
        rmSync(consumer, { recursive: true, force: true });
      }
    }, 60_000);
  },
);
