import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RegistryClient, type RegistryIndex, type RegistryLoader } from "./registry.js";
import { createServer } from "./server.js";

const INDEX: RegistryIndex = [
  { name: "cn", type: "registry:lib", dependencies: ["clsx@^2.1.1"], registryDependencies: [] },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot@^1.2.3"],
    registryDependencies: ["cn"],
  },
  {
    name: "pricing",
    type: "registry:block",
    dependencies: ["@cooud-ui/ui@0.2.0"],
    registryDependencies: [],
  },
];

function fixtureLoader(): RegistryLoader {
  return {
    async readJson<T>(file: string): Promise<T> {
      if (file === "index.json") return INDEX as unknown as T;
      throw new Error(`registry fetch failed (404): ${file}`);
    },
  };
}

/** Same fake CLI as cli.test.ts: echoes argv/cwd, then prints add/theme lines. */
const ECHO_CLI = `
const args = process.argv.slice(2);
console.log(JSON.stringify({ argv: args, cwd: process.cwd() }));
if (args[0] === "theme") {
  console.log("\\u203a Would write this block to app/globals.css (replacing any previous one):");
} else {
  console.log("\\u2714 Added components/ui/button.tsx");
  console.log("\\u2714 Installed dependencies");
}
`;

let scratch: string;
let project: string;
let client: Client;

/** Parse the single JSON text block every tool on this server returns. */
function body(result: Awaited<ReturnType<Client["callTool"]>>): Record<string, unknown> {
  const content = result.content as { type: string; text: string }[];
  expect(content).toHaveLength(1);
  expect(content[0]?.type).toBe("text");
  return JSON.parse(content[0]?.text ?? "") as Record<string, unknown>;
}

beforeAll(async () => {
  scratch = mkdtempSync(join(tmpdir(), "cooud-ui-mcp-server-"));
  writeFileSync(join(scratch, "echo-cli.mjs"), ECHO_CLI);
  project = join(scratch, "project");
  mkdirSync(project);
  writeFileSync(join(project, "package.json"), JSON.stringify({ name: "consumer" }));

  const server = createServer(new RegistryClient(fixtureLoader()), "fixture://registry", {
    cwd: project,
    candidates: [[process.execPath, join(scratch, "echo-cli.mjs")]],
    env: {},
  });
  client = new Client({ name: "smoke", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
});

afterAll(async () => {
  await client.close();
  rmSync(scratch, { recursive: true, force: true });
});

describe("MCP server over an in-memory transport", () => {
  it("exposes the five read tools and the two write tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "apply_theme",
      "get_component",
      "get_install_command",
      "install_component",
      "list_blocks",
      "list_components",
      "search_registry",
    ]);
  });

  it("marks read tools read-only and write tools destructive via annotations", async () => {
    const { tools } = await client.listTools();
    const byName = new Map(tools.map((t) => [t.name, t]));

    for (const name of [
      "list_components",
      "list_blocks",
      "search_registry",
      "get_component",
      "get_install_command",
    ]) {
      expect(byName.get(name)?.annotations, name).toMatchObject({
        readOnlyHint: true,
        openWorldHint: false,
      });
    }
    for (const name of ["install_component", "apply_theme"]) {
      expect(byName.get(name)?.annotations, name).toMatchObject({
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      });
      expect(byName.get(name)?.description).toMatch(/MODIFIES THE FILESYSTEM/);
    }
  });

  it("answers a read tool from the registry", async () => {
    const result = await client.callTool({ name: "list_components", arguments: {} });
    expect(result.isError).toBeFalsy();
    const listed = body(result) as { count: number; items: { name: string }[] };
    expect(listed.count).toBe(1);
    expect(listed.items[0]?.name).toBe("button");
  });

  it("runs install_component through the CLI seam at the project root", async () => {
    const result = await client.callTool({
      name: "install_component",
      arguments: { names: ["button"], overwrite: true },
    });
    expect(result.isError).toBeFalsy();
    const outcome = body(result) as {
      status: string;
      projectRoot: string;
      installedFiles: string[];
      dependencies: { installed: boolean };
      stdout: string;
    };
    expect(outcome.status).toBe("success");
    expect(outcome.projectRoot).toBe(project);
    expect(outcome.installedFiles).toEqual(["components/ui/button.tsx"]);
    expect(outcome.dependencies.installed).toBe(true);
    const echo = JSON.parse(outcome.stdout.split("\n")[0] ?? "") as { argv: string[] };
    expect(echo.argv).toEqual(["add", "button", "--overwrite"]);
  });

  it("runs apply_theme with dryRun through the CLI seam", async () => {
    const result = await client.callTool({
      name: "apply_theme",
      arguments: { source: "https://cooud-ui.dev/studio?c=abc", dryRun: true },
    });
    expect(result.isError).toBeFalsy();
    const outcome = body(result) as {
      status: string;
      dryRun: boolean;
      planned: string[];
      stdout: string;
    };
    expect(outcome.status).toBe("success");
    expect(outcome.dryRun).toBe(true);
    expect(outcome.planned).toEqual([
      "Would write this block to app/globals.css (replacing any previous one):",
    ]);
    const echo = JSON.parse(outcome.stdout.split("\n")[0] ?? "") as { argv: string[] };
    expect(echo.argv).toEqual(["theme", "add", "https://cooud-ui.dev/studio?c=abc", "--dry-run"]);
  });

  it("returns an in-band error for an invalid item name", async () => {
    const result = await client.callTool({
      name: "install_component",
      arguments: { names: ["not a slug!"] },
    });
    expect(result.isError).toBe(true);
    const content = result.content as { text: string }[];
    expect(content[0]?.text).toMatch(/Invalid registry item name/);
  });

  it("rejects schema-invalid arguments before the handler runs", async () => {
    const result = await client.callTool({
      name: "install_component",
      arguments: { names: [] },
    });
    expect(result.isError).toBe(true);
    const content = result.content as { text: string }[];
    expect(content[0]?.text).toMatch(/Input validation error/);
  });
});
