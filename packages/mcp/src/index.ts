#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { RegistryClient, resolveRegistrySource, SourceRegistryLoader } from "./registry.js";
import {
  getComponent,
  getInstallCommand,
  listBlocks,
  listComponents,
  searchRegistry,
} from "./tools.js";
import { SERVER_VERSION } from "./version.js";

const SERVER_NAME = "cooud-ui";
const HELP = `cooud-ui-mcp — expose the Cooud UI registry through MCP.

Usage
  cooud-ui-mcp [options]

Options
  -h, --help     Show this help
  -v, --version  Show the version

Environment
  COOUD_UI_REGISTRY_URL  Override the registry source
`;

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
 * Build the configured MCP server. Exposes the Cooud UI registry as a set of
 * read-only tools (and the index as a resource) for MCP-compatible agents.
 */
export function createServer(client: RegistryClient, source: string): McpServer {
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
        "resolves and installs each item's registry dependencies automatically.",
      inputSchema: {
        names: z
          .array(z.string())
          .min(1)
          .describe(
            "One or more registry item names to install, e.g. ['button', 'card', 'dialog'].",
          ),
      },
    },
    async ({ names }) => {
      try {
        return ok(getInstallCommand(names));
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(HELP);
    return;
  }
  if (args.includes("--version") || args.includes("-v")) {
    process.stdout.write(`${SERVER_VERSION}\n`);
    return;
  }

  const source = resolveRegistrySource();
  const client = new RegistryClient(new SourceRegistryLoader(source));
  const server = createServer(client, source);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stdout is reserved for the MCP protocol — diagnostics go to stderr only.
  process.stderr.write(`cooud-ui-mcp ${SERVER_VERSION} ready (registry: ${source})\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`cooud-ui-mcp failed to start: ${message}\n`);
  process.exitCode = 1;
});
