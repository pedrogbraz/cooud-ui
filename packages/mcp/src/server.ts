import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { applyTheme, type CliRunOptions, installComponent, type RunStatus } from "./cli.js";
import type { RegistryClient } from "./registry.js";
import {
  getComponent,
  getInstallCommand,
  listBlocks,
  listComponents,
  searchRegistry,
} from "./tools.js";
import { SERVER_VERSION } from "./version.js";

export const SERVER_NAME = "cooud-ui";

/**
 * The shape returned by every tool handler in the SDK 1.x API. A `type` alias
 * (not an `interface`) so it stays assignable to the SDK's result type, which
 * carries an open `[x: string]: unknown` index signature.
 */
type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

/** Wrap a JSON-serialisable value as a successful text tool result. */
function ok(value: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

/** Wrap an error as a tool result (never throws across the transport). */
function fail(error: unknown): ToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

/**
 * Wrap a completed CLI run as a tool result: the full structured outcome
 * (verbatim stdout/stderr included) either way, flagged as an error when the
 * CLI did not succeed so agents notice without parsing the JSON.
 */
function ranCli(result: { status: RunStatus }): ToolResult {
  const body = ok(result);
  return result.status === "success" ? body : { ...body, isError: true };
}

/**
 * Annotation sets (all MCP `ToolAnnotations` are hints, not guarantees).
 *
 * - Read tools never touch the consumer project and only fetch from the one
 *   configured registry, hence `readOnlyHint` and a closed world.
 * - Write tools modify the consumer project's files (and `install_component`
 *   runs the package manager). They can replace existing content
 *   (`--overwrite`, theme override block), hence `destructiveHint`. Re-running
 *   with the same arguments converges on the same state, hence
 *   `idempotentHint`.
 */
const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;
const WRITES_PROJECT = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: true,
  openWorldHint: false,
} as const;

/**
 * Build the configured MCP server. Exposes the Cooud UI registry as a set of
 * read-only tools (and the index as a resource) plus two write tools that
 * install components and apply themes by running the version-pinned `cooud-ui`
 * CLI in the consumer project.
 *
 * `cliOptions` (cwd/env/launcher/timeout) is a seam for tests and embedding —
 * the stdio entry point passes nothing and the write tools then operate on
 * `process.cwd()`.
 */
export function createServer(
  client: RegistryClient,
  source: string,
  cliOptions: CliRunOptions = {},
): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  server.registerTool(
    "list_components",
    {
      title: "List Cooud UI components",
      description:
        "List the installable Cooud UI components (registry items of type 'registry:ui'). " +
        "Returns each component's name, a readable title, its npm and registry dependencies, " +
        "and the `npx cooud-ui add <name>` command to install it.",
      inputSchema: {},
      annotations: READ_ONLY,
    },
    async () => {
      try {
        return ok(await listComponents(client));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "list_blocks",
    {
      title: "List Cooud UI blocks",
      description:
        "List the installable Cooud UI blocks (registry items of type 'registry:block') — " +
        "larger, composed sections such as hero, pricing, login, and dashboard. Returns each " +
        "block's name, title, dependencies, and its `npx cooud-ui add <name>` install command.",
      inputSchema: {},
      annotations: READ_ONLY,
    },
    async () => {
      try {
        return ok(await listBlocks(client));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "search_registry",
    {
      title: "Search the Cooud UI registry",
      description:
        "Fuzzy-search Cooud UI components and blocks by name (case-insensitive substring match). " +
        "Use this to find the right item before fetching its source with `get_component`.",
      inputSchema: {
        query: z
          .string()
          .describe(
            "Search text matched against component and block names, e.g. 'button' or 'card'.",
          ),
      },
      annotations: READ_ONLY,
    },
    async ({ query }) => {
      try {
        return ok(await searchRegistry(client, query));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a Cooud UI component or block",
      description:
        "Fetch the full detail for a single Cooud UI component or block by name: its source " +
        "file(s) (path + content), its npm `dependencies`, its `registryDependencies` (other " +
        "registry items it needs), and the `npx cooud-ui add <name>` install command. Works for " +
        "both components and blocks.",
      inputSchema: {
        name: z
          .string()
          .describe("The exact registry item name, e.g. 'button', 'data-table', or 'pricing'."),
      },
      annotations: READ_ONLY,
    },
    async ({ name }) => {
      try {
        return ok(await getComponent(client, name));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_install_command",
    {
      title: "Build a Cooud UI install command",
      description:
        "Build the `npx cooud-ui add ...` command for one or more components/blocks. The CLI " +
        "resolves and installs each item's registry dependencies automatically. This only " +
        "returns the command string — to actually install, use `install_component`.",
      inputSchema: {
        names: z
          .array(z.string())
          .min(1)
          .describe(
            "One or more registry item names to install, e.g. ['button', 'card', 'dialog'].",
          ),
      },
      annotations: READ_ONLY,
    },
    async ({ names }) => {
      try {
        return ok(getInstallCommand(names));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "install_component",
    {
      title: "Install Cooud UI components into the project",
      description:
        "MODIFIES THE FILESYSTEM. Install one or more Cooud UI components/blocks into the " +
        "current project by running the version-pinned `cooud-ui add` CLI at the detected " +
        "project root (nearest directory with cooud-ui.json, else package.json). It writes the " +
        "component source files, pulls in their registry dependencies, and installs their npm " +
        "packages with the project's package manager. Use this — not a shell command — whenever " +
        "the user asks to add/install a Cooud UI component or block. Existing files are " +
        "skipped unless `overwrite` is true (overwrite discards local edits to those files). " +
        "Requires a project initialised with `npx cooud-ui init`.",
      inputSchema: {
        names: z
          .array(z.string())
          .min(1)
          .describe(
            "Registry item names to install, e.g. ['button', 'card'] or ['pricing']. " +
              "Registry dependencies are resolved automatically.",
          ),
        overwrite: z
          .boolean()
          .optional()
          .describe(
            "Overwrite files that already exist in the project (destroys local edits to " +
              "those files). Default: existing files are skipped.",
          ),
        skipInstall: z
          .boolean()
          .optional()
          .describe(
            "Write the source files but skip the package-manager install of npm " +
              "dependencies; the result then lists them as pending.",
          ),
      },
      annotations: WRITES_PROJECT,
    },
    async ({ names, overwrite, skipInstall }) => {
      try {
        return ranCli(await installComponent({ names, overwrite, skipInstall }, cliOptions));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "apply_theme",
    {
      title: "Apply a Cooud UI theme to the project",
      description:
        "MODIFIES THE FILESYSTEM. Apply a theme built in the Cooud UI Create Studio to the " +
        "current project by running the version-pinned `cooud-ui theme add` CLI at the " +
        "detected project root. It updates the app layout's theme attributes, writes the theme " +
        "override block into the global stylesheet (replacing any previous one), and records " +
        "the theme in cooud-ui.json. Use this when the user provides a Create Studio permalink " +
        "or an exported theme JSON file and wants it applied. Set `dryRun` to preview the " +
        "changes without writing anything.",
      inputSchema: {
        source: z
          .string()
          .describe(
            "The theme to apply: a Create Studio permalink URL, a bare `c=` payload, or a " +
              "path to an exported theme JSON file.",
          ),
        dryRun: z
          .boolean()
          .optional()
          .describe("Preview what would change without writing any files."),
      },
      annotations: WRITES_PROJECT,
    },
    async ({ source: themeSource, dryRun }) => {
      try {
        return ranCli(await applyTheme({ source: themeSource, dryRun }, cliOptions));
      } catch (error) {
        return fail(error);
      }
    },
  );

  // Expose the registry index as a resource so agents can browse the full
  // catalog in one read.
  server.registerResource(
    "registry-index",
    "cooud-ui://registry/index",
    {
      title: "Cooud UI registry index",
      description:
        "The full Cooud UI registry listing (all components and blocks with their dependencies). " +
        `Source: ${source}`,
      mimeType: "application/json",
    },
    async (uri) => {
      const index = await client.index();
      return {
        contents: [
          { uri: uri.href, mimeType: "application/json", text: JSON.stringify(index, null, 2) },
        ],
      };
    },
  );

  return server;
}
